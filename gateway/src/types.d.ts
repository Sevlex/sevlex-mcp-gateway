declare module "better-sqlite3" {
  interface Statement {
    run(...params: any[]): any;
    get(...params: any[]): any;
    all(...params: any[]): any[];
    [key: string]: any;
  }

  interface Database {
    pragma(source: string): any;
    exec(source: string): this;
    prepare(source: string): Statement;
    close(): this;
    [key: string]: any;
  }

  interface DatabaseConstructor {
    new (filename: string, options?: any): Database;
    (filename: string, options?: any): Database;
  }

  namespace Database {
    export type Database = Database;
    export type Statement = Statement;
  }

  const Database: DatabaseConstructor;
  export default Database;
  export = Database;
}
