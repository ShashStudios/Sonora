import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Fetch all stores with product counts
    const stores = await db.store.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedStores = stores.map(store => ({
      id: store.id,
      name: store.name,
      description: store.description,
      productCount: store._count.products,
    }));

    return NextResponse.json({
      success: true,
      stores: formattedStores,
    });
  } catch (error: any) {
    console.error('Marketplace fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch stores' },
      { status: 500 }
    );
  }
}
