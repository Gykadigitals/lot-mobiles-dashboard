import { NextResponse } from 'next/server';
import fs from 'fs';

// The path to the promotions.ts file in the frontend repository
const FRONTEND_PROMO_PATH = '/Users/apple/Gyka Digitals /Developer Files /LOT Mobiles /lot-mobiles/src/data/promotions.ts';

export async function GET() {
  try {
    if (!fs.existsSync(FRONTEND_PROMO_PATH)) {
      return NextResponse.json({ error: 'Promotions file not found in frontend project.' }, { status: 404 });
    }

    const content = fs.readFileSync(FRONTEND_PROMO_PATH, 'utf8');
    
    // Extract the object array part
    const match = content.match(/export const PROMO_BANNERS: PromoBanner\[\] = ([\s\S]*);/);
    if (!match || !match[1]) {
      return NextResponse.json({ error: 'Could not parse promotions data' }, { status: 500 });
    }

    // Using eval to parse the JS array
    const dataString = match[1].trim();
    // Wrap in parentheses to evaluate as an expression
    const data = eval('(' + dataString + ')');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading promotions data:', error);
    return NextResponse.json({ error: 'Failed to read promotions data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const fileContent = `export interface PromoBanner {
  id: number;
  img: string;
  url: string;
}

export const PROMO_BANNERS: PromoBanner[] = ${JSON.stringify(data, null, 2)};
`;

    fs.writeFileSync(FRONTEND_PROMO_PATH, fileContent, 'utf8');

    return NextResponse.json({ success: true, message: 'Promotions data updated successfully' });
  } catch (error) {
    console.error('Error updating promotions data:', error);
    return NextResponse.json({ error: 'Failed to update promotions data' }, { status: 500 });
  }
}
