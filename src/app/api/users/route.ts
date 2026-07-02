import { NextResponse } from 'next/server';
import fs from 'fs';

const FRONTEND_USERS_PATH = '/Users/apple/Gyka Digitals /Developer Files /LOT Mobiles /lot-mobiles/src/data/users.ts';

export async function GET() {
  try {
    if (!fs.existsSync(FRONTEND_USERS_PATH)) {
      return NextResponse.json({ error: 'Users file not found in frontend project.' }, { status: 404 });
    }

    const content = fs.readFileSync(FRONTEND_USERS_PATH, 'utf8');
    
    const match = content.match(/export const USERS_DATA: UserData\[\] = ([\s\S]*);/);
    if (!match || !match[1]) {
      return NextResponse.json({ error: 'Could not parse users data' }, { status: 500 });
    }

    const dataString = match[1].trim();
    const data = eval('(' + dataString + ')');

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading users data:', error);
    return NextResponse.json({ error: 'Failed to read users data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const fileContent = `export interface UserData {
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
}

export const USERS_DATA: UserData[] = ${JSON.stringify(data, null, 2)};
`;

    fs.writeFileSync(FRONTEND_USERS_PATH, fileContent, 'utf8');

    return NextResponse.json({ success: true, message: 'Users data updated successfully' });
  } catch (error) {
    console.error('Error updating users data:', error);
    return NextResponse.json({ error: 'Failed to update users data' }, { status: 500 });
  }
}
