import { NextResponse } from 'next/server';
import fs from 'fs';

const FRONTEND_BRANDS_PATH = '/Users/apple/Gyka Digitals /Developer Files /LOT Mobiles /lot-mobiles/src/data/brands.ts';

export async function GET() {
  try {
    if (!fs.existsSync(FRONTEND_BRANDS_PATH)) {
      return NextResponse.json({ error: 'Brands file not found in frontend project.' }, { status: 404 });
    }

    const content = fs.readFileSync(FRONTEND_BRANDS_PATH, 'utf8');
    
    // Extract the object array part
    const match = content.match(/export const BRANDS: BrandData\[\] = ([\s\S]*);/);
    if (!match || !match[1]) {
      return NextResponse.json({ error: 'Could not parse brands data' }, { status: 500 });
    }

    const dataString = match[1].trim();
    const data = eval('(' + dataString + ')');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading brands data:', error);
    return NextResponse.json({ error: 'Failed to read brands data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const fileContent = `export interface BrandData {
  id: string;
  name: string;
  image: string;
}

export const BRANDS: BrandData[] = ${JSON.stringify(data, null, 2)};
`;

    fs.writeFileSync(FRONTEND_BRANDS_PATH, fileContent, 'utf8');

    return NextResponse.json({ success: true, message: 'Brands data updated successfully' });
  } catch (error) {
    console.error('Error updating brands data:', error);
    return NextResponse.json({ error: 'Failed to update brands data' }, { status: 500 });
  }
}
