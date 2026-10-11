import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const platform = url.searchParams.get('platform') || 'windows';

  const scriptPath = platform === 'macos' || platform === 'jamf'
    ? path.resolve(process.cwd(), '../deploy/deploy-mdm.sh')
    : path.resolve(process.cwd(), '../deploy/deploy-mdm.ps1');

  try {
    if (fs.existsSync(scriptPath)) {
      const content = fs.readFileSync(scriptPath, 'utf-8');
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': `attachment; filename="${path.basename(scriptPath)}"`
        }
      });
    }
    return NextResponse.json({ error: 'Script not found' }, { status: 404 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Internal error reading script' }, { status: 500 });
  }
}
