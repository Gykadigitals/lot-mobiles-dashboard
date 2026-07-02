import { NextResponse } from 'next/server';
import fs from 'fs';

const FRONTEND_CATEGORIES_PATH = '/Users/apple/Gyka Digitals /Developer Files /LOT Mobiles /lot-mobiles/src/data/categories.ts';

export async function GET() {
  try {
    if (!fs.existsSync(FRONTEND_CATEGORIES_PATH)) {
      return NextResponse.json({ error: 'Categories file not found in frontend project.' }, { status: 404 });
    }

    const content = fs.readFileSync(FRONTEND_CATEGORIES_PATH, 'utf8');
    
    // Extract the object array part
    const match = content.match(/export const CATEGORIES: CategoryData\[\] = ([\s\S]*);/);
    if (!match || !match[1]) {
      return NextResponse.json({ error: 'Could not parse categories data' }, { status: 500 });
    }

    const dataString = match[1].trim();
    // Use eval carefully, only because we trust the file content and structure
    const data = eval('(' + dataString + ')');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading categories data:', error);
    return NextResponse.json({ error: 'Failed to read categories data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const fileContent = `export interface CategoryData {
  id: string;
  name: string;
  count: number;
  startprice: number;
  bgImage: string;
  url: string;
}

export const CATEGORIES: CategoryData[] = ${JSON.stringify(data, null, 2)};
`;

    fs.writeFileSync(FRONTEND_CATEGORIES_PATH, fileContent, 'utf8');

    return NextResponse.json({ success: true, message: 'Categories data updated successfully' });
  } catch (error) {
    console.error('Error updating categories data:', error);
    return NextResponse.json({ error: 'Failed to update categories data' }, { status: 500 });
  }
}
