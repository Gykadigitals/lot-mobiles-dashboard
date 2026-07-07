import { NextResponse } from 'next/server';
import fs from 'fs';

const FRONTEND_CUSTOMERS_PATH = '/Users/apple/Gyka Digitals /Developer Files /LOT Mobiles /lot-mobiles/src/data/customers.ts';

export async function GET() {
  try {
    if (!fs.existsSync(FRONTEND_CUSTOMERS_PATH)) {
      return NextResponse.json({ error: 'Customers file not found in frontend project.' }, { status: 404 });
    }

    const content = fs.readFileSync(FRONTEND_CUSTOMERS_PATH, 'utf8');
    
    const match = content.match(/export const CUSTOMERS_DATA: CustomerData\[\] = ([\s\S]*);/);
    if (!match || !match[1]) {
      return NextResponse.json({ error: 'Could not parse customers data' }, { status: 500 });
    }

    const dataString = match[1].trim();
    const data = eval('(' + dataString + ')');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading customers data:', error);
    return NextResponse.json({ error: 'Failed to read customers data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const fileContent = `export interface Address {
  id: string;
  type: string; // 'Home', 'Shipping', 'Office', etc.
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface LastLogin {
  location: string;
  timestamp: string; // ISO string or formatted date string
}

export interface CustomerData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  sex: string;
  mobile: string;
  location: string;
  accountType: string;
  status: string;
  department: string;
  memberSince: string;
  emailVerified: boolean;
  lastLogin?: LastLogin;
  addresses?: Address[];
}

export const CUSTOMERS_DATA: CustomerData[] = ${JSON.stringify(data, null, 2)};
`;

    fs.writeFileSync(FRONTEND_CUSTOMERS_PATH, fileContent, 'utf8');

    return NextResponse.json({ success: true, message: 'Customers data updated successfully' });
  } catch (error) {
    console.error('Error updating customers data:', error);
    return NextResponse.json({ error: 'Failed to update customers data' }, { status: 500 });
  }
}
