import { NextResponse } from 'next/server';
import fs from 'fs';

const FRONTEND_HERO_PATH = '/Users/apple/Gyka Digitals /Developer Files /LOT Mobiles /lot-mobiles/src/data/heroBanners.ts';

export async function GET() {
  try {
    if (!fs.existsSync(FRONTEND_HERO_PATH)) {
      return NextResponse.json({ error: 'Hero banners file not found in frontend project.' }, { status: 404 });
    }

    const content = fs.readFileSync(FRONTEND_HERO_PATH, 'utf8');
    
    // Extract the object array part
    const match = content.match(/export const HERO_SLIDES: BannerData\[\] = ([\s\S]*);/);
    if (!match || !match[1]) {
      return NextResponse.json({ error: 'Could not parse hero banners data' }, { status: 500 });
    }

    const dataString = match[1].trim();
    const data = eval('(' + dataString + ')');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading hero banners data:', error);
    return NextResponse.json({ error: 'Failed to read hero banners data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const fileContent = `export interface BannerData {
  id: string;
  title: string;
  url: string;
  image: string;
}

export const HERO_SLIDES: BannerData[] = ${JSON.stringify(data, null, 2)};
`;

    fs.writeFileSync(FRONTEND_HERO_PATH, fileContent, 'utf8');

    return NextResponse.json({ success: true, message: 'Hero banners data updated successfully' });
  } catch (error) {
    console.error('Error updating hero banners data:', error);
    return NextResponse.json({ error: 'Failed to update hero banners data' }, { status: 500 });
  }
}
