import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { speakReceipt } from '@/lib/elevenlabs';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Fetch order with items
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Format items for voice receipt
    const items = order.items.map(item => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.priceAtPurchase,
    }));

    // Generate voice receipt
    const voiceResult = await speakReceipt(items, order.totalAmount);

    return NextResponse.json({
      success: true,
      audioUrl: voiceResult.audioUrl,
    });
  } catch (error: any) {
    console.error('Voice receipt error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate voice receipt' },
      { status: 500 }
    );
  }
}
