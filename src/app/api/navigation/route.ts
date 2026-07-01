import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// The path to the navigation.ts file in the frontend repository
const FRONTEND_NAV_PATH = '/Users/apple/Gyka Digitals /Developer Files /LOT Mobiles /lot-mobiles/src/data/navigation.ts';

export async function GET() {
  try {
    if (!fs.existsSync(FRONTEND_NAV_PATH)) {
      return NextResponse.json({ error: 'Navigation file not found in frontend project.' }, { status: 404 });
    }

    const content = fs.readFileSync(FRONTEND_NAV_PATH, 'utf8');
    
    // Extract the object part
    const match = content.match(/export const navigationData: NavigationData = ([\s\S]*);/);
    if (!match || !match[1]) {
      return NextResponse.json({ error: 'Could not parse navigation data' }, { status: 500 });
    }

    // Using eval to parse the JS object literal since JSON.parse won't work on unquoted keys
    const dataString = match[1].trim();
    // Wrap in parentheses to evaluate as an expression
    const data = eval('(' + dataString + ')');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading navigation data:', error);
    return NextResponse.json({ error: 'Failed to read navigation data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const fileContent = `export interface NavItemLink {
  label: string;
  href: string;
  icon?: string;
  isNew?: boolean;
}

export interface NavMenuSection {
  title: string;
  items: NavItemLink[];
}

export interface NavColumn {
  sections: NavMenuSection[];
}

export interface NavMenuItem {
  id: string;
  title: string;
  href: string;
  columns?: NavColumn[];
}

export interface NavigationData {
  items: NavMenuItem[];
}

export const navigationData: NavigationData = ${JSON.stringify(data, null, 2)};
`;

    fs.writeFileSync(FRONTEND_NAV_PATH, fileContent, 'utf8');

    return NextResponse.json({ success: true, message: 'Navigation data updated successfully' });
  } catch (error) {
    console.error('Error updating navigation data:', error);
    return NextResponse.json({ error: 'Failed to update navigation data' }, { status: 500 });
  }
}
