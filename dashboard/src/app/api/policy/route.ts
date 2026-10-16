import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Locate the exact sevlex.json file used by the Gateway
const CONFIG_PATH = process.env.SEVLEX_POLICY_PATH || path.resolve(process.cwd(), '../gateway/sevlex.json');
const DISCOVERED_TOOLS_PATH = process.env.SEVLEX_DISCOVERED_TOOLS_PATH || path.resolve(process.cwd(), '../gateway/discovered_tools.json');

export async function GET(request: Request) {
  if (request.headers.get('Authorization') !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rawData = fs.readFileSync(/*turbopackIgnore: true*/ CONFIG_PATH, 'utf-8');
    const config = JSON.parse(rawData);

    let discoveredTools: { server: string; tools: string[] }[] = [];
    try {
      if (fs.existsSync(/*turbopackIgnore: true*/ DISCOVERED_TOOLS_PATH)) {
        discoveredTools = JSON.parse(fs.readFileSync(/*turbopackIgnore: true*/ DISCOVERED_TOOLS_PATH, 'utf-8'));
      }
    } catch {
      // Ignore errors when reading discovered tools
    }

    return NextResponse.json({ ...config, discoveredTools });
  } catch {
    return NextResponse.json({ error: 'Failed to read policy' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (request.headers.get('Authorization') !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { blockedTools, approvalRequiredTools, parameterRules, dlp } = body;
    
    // Read the current file
    const rawData = fs.readFileSync(/*turbopackIgnore: true*/ CONFIG_PATH, 'utf-8');
    const config = JSON.parse(rawData);
    
    // Update the policies
    if (Array.isArray(blockedTools)) {
      config.policy.blockedTools = blockedTools;
    }
    if (Array.isArray(approvalRequiredTools)) {
      config.policy.approvalRequiredTools = approvalRequiredTools;
    }
    if (parameterRules) {
      config.policy.parameterRules = parameterRules;
    }
    if (dlp) {
      config.policy.dlp = dlp;
    }
    
    // Write it back to the disk beautifully formatted
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true, config });
  } catch {
    return NextResponse.json({ error: 'Failed to update policy' }, { status: 500 });
  }
}
