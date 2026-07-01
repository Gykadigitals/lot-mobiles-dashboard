import { NextResponse } from 'next/server';
import fs from 'fs';

const FRONTEND_FEATURES_PATH = '/Users/apple/Gyka Digitals /Developer Files /LOT Mobiles /lot-mobiles/src/data/storeFeatures.ts';

export async function GET() {
  try {
    if (!fs.existsSync(FRONTEND_FEATURES_PATH)) {
      return NextResponse.json({ error: 'Store features file not found in frontend project.' }, { status: 404 });
    }

    const content = fs.readFileSync(FRONTEND_FEATURES_PATH, 'utf8');
    
    // Extract the object array part
    const match = content.match(/export const STORE_FEATURES: StoreFeature\[\] = ([\s\S]*);/);
    if (!match || !match[1]) {
      return NextResponse.json({ error: 'Could not parse store features data' }, { status: 500 });
    }

    const dataString = match[1].trim();
    const data = eval('(' + dataString + ')');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading store features data:', error);
    return NextResponse.json({ error: 'Failed to read store features data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const fileContent = `export interface StoreFeature {
  id: number;
  iconName: string;
  title: string;
  subtitle: string;
}

export const STORE_FEATURES: StoreFeature[] = ${JSON.stringify(data, null, 2)};
`;

    fs.writeFileSync(FRONTEND_FEATURES_PATH, fileContent, 'utf8');

    return NextResponse.json({ success: true, message: 'Store features data updated successfully' });
  } catch (error) {
    console.error('Error updating store features data:', error);
    return NextResponse.json({ error: 'Failed to update store features data' }, { status: 500 });
  }
}
