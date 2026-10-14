import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const platform = url.searchParams.get('platform') || 'windows';

  const filename = platform === 'macos' || platform === 'jamf' ? 'sevlex.pkg' : 'sevlex.intunewin';
  const filePath = path.resolve(process.cwd(), `../deploy/dist/${filename}`);

  try {
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath);
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${filename}"`
        }
      });
    }
    return NextResponse.json({ error: `Package ${filename} not found on server` }, { status: 404 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error downloading package' }, { status: 500 });
  }
}
