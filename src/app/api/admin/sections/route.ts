// app/api/admin/sections/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Define proper types for the where clause
interface WhereClause {
  tenant_id: string;
  role?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    
    const whereClause: WhereClause = { tenant_id: '1' };
    if (role) {
      whereClause.role = role;
    }

    const sections = await prisma.apply_role_fields_sections.findMany({
      where: whereClause,
      include: {
        fields: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sections' },
      { status: 500 }
    );
  }
}

// Define proper type for the request body
interface PostRequestBody {
  name: string;
  role: string;
  order?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as PostRequestBody;
    const { name, role, order } = body;

    const section = await prisma.apply_role_fields_sections.create({
      data: {
        tenant_id: '1',
        name,
        role,
        order: order || 0,
      },
    });

    return NextResponse.json(section);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create section' },
      { status: 500 }
    );
  }
}