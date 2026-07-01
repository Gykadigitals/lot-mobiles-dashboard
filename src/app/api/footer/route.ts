import { NextResponse } from 'next/server';
import fs from 'fs';

const FRONTEND_FOOTER_PATH = '/Users/apple/Gyka Digitals /Developer Files /LOT Mobiles /lot-mobiles/src/data/footer.ts';

export async function GET() {
  try {
    if (!fs.existsSync(FRONTEND_FOOTER_PATH)) {
      return NextResponse.json({ error: 'Footer file not found in frontend project.' }, { status: 404 });
    }

    const content = fs.readFileSync(FRONTEND_FOOTER_PATH, 'utf8');
    
    // Extract the object part
    const match = content.match(/export const FOOTER: FooterData = ([\s\S]*);/);
    if (!match || !match[1]) {
      return NextResponse.json({ error: 'Could not parse footer data' }, { status: 500 });
    }

    const dataString = match[1].trim();
    const data = eval('(' + dataString + ')');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading footer data:', error);
    return NextResponse.json({ error: 'Failed to read footer data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const fileContent = `export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterData {
  contact: {
    address: string;
    phone: string;
    email: string;
  };
  columns: FooterColumn[];
  copyright: string;
}

export const FOOTER: FooterData = ${JSON.stringify(data, null, 2)};
`;

    fs.writeFileSync(FRONTEND_FOOTER_PATH, fileContent, 'utf8');

    return NextResponse.json({ success: true, message: 'Footer data updated successfully' });
  } catch (error) {
    console.error('Error updating footer data:', error);
    return NextResponse.json({ error: 'Failed to update footer data' }, { status: 500 });
  }
}
