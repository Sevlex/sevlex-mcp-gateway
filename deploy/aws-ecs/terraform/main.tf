terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "AWS deployment region"
}

variable "vpc_id" {
  type        = string
  description = "Customer Private VPC ID"
}

variable "private_subnet_ids" {
  type        = list(string)
  description = "Private Subnet IDs for ECS Fargate Tasks (no public IPs assigned)"
}

variable "alb_subnet_ids" {
  type        = list(string)
  description = "Subnets for Internal Application Load Balancer"
}

variable "container_image" {
  type        = string
  description = "Amazon ECR container image URI for Sevlex Dashboard"
}

variable "rds_endpoint" {
  type        = string
  description = "Internal AWS RDS PostgreSQL endpoint host"
}

variable "rds_port" {
  type        = number
  default     = 5432
  description = "PostgreSQL port"
}

variable "rds_db_name" {
  type        = string
  default     = "sevlex"
  description = "Database name"
}

variable "rds_username" {
  type        = string
  default     = "sevlex_admin"
  description = "PostgreSQL username"
}

variable "rds_password" {
  type        = string
  sensitive   = true
  description = "PostgreSQL password"
}

variable "admin_api_key" {
  type        = string
  sensitive   = true
  description = "Enterprise Admin API Key"
}

# ------------------------------------------------------------
# CloudWatch Log Group
# ------------------------------------------------------------
resource "aws_cloudwatch_log_group" "sevlex" {
  name              = "/ecs/sevlex-dashboard"
  retention_in_days = 30
}

# ------------------------------------------------------------
# IAM Roles for ECS Fargate
# ------------------------------------------------------------
resource "aws_iam_role" "ecs_execution" {
  name = "sevlex-ecs-execution-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_policy" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role" "ecs_task" {
  name = "sevlex-ecs-task-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
    }]
  })
}

# ------------------------------------------------------------
# Security Groups (Zero-Trust VPC Isolation)
# ------------------------------------------------------------
resource "aws_security_group" "alb" {
  name        = "sevlex-alb-sg"
  description = "Controls traffic to Sevlex Internal Load Balancer"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "ecs" {
  name        = "sevlex-ecs-sg"
  description = "Allows incoming traffic from ALB to Sevlex Fargate tasks"
  vpc_id      = var.vpc_id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ------------------------------------------------------------
# Internal Application Load Balancer
# ------------------------------------------------------------
resource "aws_lb" "sevlex" {
  name               = "sevlex-internal-alb"
  internal           = true
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = var.alb_subnet_ids
}

resource "aws_lb_target_group" "sevlex" {
  name        = "sevlex-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"

  health_check {
    path                = "/api/health"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
    matcher             = "200"
  }
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.sevlex.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.sevlex.arn
  }
}

# ------------------------------------------------------------
# ECS Cluster, Task Definition & Fargate Service
# ------------------------------------------------------------
resource "aws_ecs_cluster" "sevlex" {
  name = "sevlex-enterprise-cluster"
}

resource "aws_ecs_task_definition" "sevlex" {
  family                   = "sevlex-enterprise-dashboard"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name      = "sevlex-dashboard"
      image     = var.container_image
      essential = true
      portMappings = [{
        containerPort = 3000
        protocol      = "tcp"
      }]
      environment = [
        { name = "NODE_ENV", value = "production" },
        { name = "PORT", value = "3000" },
        { name = "ADMIN_API_KEY", value = var.admin_api_key },
        { name = "DATABASE_URL", value = "postgres://${var.rds_username}:${var.rds_password}@${var.rds_endpoint}:${var.rds_port}/${var.rds_db_name}?sslmode=require" },
        { name = "DATABASE_SSL", value = "true" }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.sevlex.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:3000/api/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 30
      }
    }
  ])
}

resource "aws_ecs_service" "sevlex" {
  name            = "sevlex-dashboard-service"
  cluster         = aws_ecs_cluster.sevlex.id
  task_definition = aws_ecs_task_definition.sevlex.arn
  launch_type     = "FARGATE"
  desired_count   = 2

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.sevlex.arn
    container_name   = "sevlex-dashboard"
    container_port   = 3000
  }

  depends_on = [aws_lb_listener.http]
}

output "internal_alb_dns" {
  value       = aws_lb.sevlex.dns_name
  description = "Private internal DNS name for the Sevlex Dashboard"
}
