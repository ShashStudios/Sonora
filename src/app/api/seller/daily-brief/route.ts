import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { speakDailyBrief } from '@/lib/elevenlabs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId') || 'demo'; // Default to demo store

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetch today's orders
    const orders = await db.order.findMany({
      where: {
        storeId,
        status: 'completed',
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Calculate stats
    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const orderCount = orders.length;

    // Find top product
    const productSales: Record<string, { name: string; count: number }> = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.product.id;
        if (!productSales[productId]) {
          productSales[productId] = {
            name: item.product.name,
            count: 0,
          };
        }
        productSales[productId].count += item.quantity;
      });
    });

    const topProduct = Object.values(productSales)
      .sort((a, b) => b.count - a.count)[0]?.name;

    // Generate voice brief
    const voiceResult = await speakDailyBrief(totalSales, orderCount, topProduct);

    return NextResponse.json({
      success: true,
      audioUrl: voiceResult.audioUrl,
      stats: {
        totalSales,
        orderCount,
        topProduct,
      },
    });
  } catch (error: any) {
    console.error('Daily brief error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate daily brief' },
      { status: 500 }
    );
  }
}
