import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { voiceCheckout } from '@/lib/agentic';

/**
 * ACP (Agentic Commerce Protocol) Checkout Handler
 * This is the core integration with OpenAI's Agentic Commerce Protocol
 * 
 * Flow:
 * 1. Receive cart items from client
 * 2. Create order in database
 * 3. Call ACP API to initiate checkout
 * 4. Return ACP order ID and status
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { storeId, items, customerEmail, customerName } = body;

    // Validation
    if (!storeId || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Store ID and items are required' },
        { status: 400 }
      );
    }

    // Calculate total and fetch product details
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        );
      }

      if (!product.inStock) {
        return NextResponse.json(
          { error: `Product ${product.name} is out of stock` },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        priceAtPurchase: product.price,
      });
    }

    // Create order in database
    const order = await db.order.create({
      data: {
        storeId,
        buyerEmail: customerEmail || 'guest@sonora.app',
        buyerName: customerName || 'Guest',
        totalAmount,
        status: 'pending',
        items: {
          create: orderItems,
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

    try {
      // Call ACP API for instant checkout
      const acpResult = await voiceCheckout({
        storeId,
        cartItems: items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        customerEmail,
        customerName,
      });

      // Update order with ACP order ID
      await db.order.update({
        where: { id: order.id },
        data: {
          acpOrderId: acpResult.orderId,
          status: acpResult.status === 'completed' ? 'completed' : 'processing',
        },
      });

      return NextResponse.json({
        success: true,
        orderId: order.id,
        acpOrderId: acpResult.orderId,
        status: acpResult.status,
        totalAmount,
        message: 'Order created successfully with ACP checkout',
      }, { status: 201 });

    } catch (acpError: any) {
      console.error('ACP checkout error:', acpError);
      
      // If ACP fails, mark order as failed but keep it in database
      await db.order.update({
        where: { id: order.id },
        data: { status: 'failed' },
      });

      // For demo purposes, if ACP is not configured, complete the order anyway
      if (acpError.message.includes('ACP_API_KEY not configured')) {
        console.warn('ACP not configured - simulating successful checkout for demo');
        
        await db.order.update({
          where: { id: order.id },
          data: { status: 'completed' },
        });

        return NextResponse.json({
          success: true,
          orderId: order.id,
          status: 'completed',
          totalAmount,
          message: 'Order completed (demo mode - ACP not configured)',
          demo: true,
        }, { status: 201 });
      }

      throw acpError;
    }

  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to process checkout',
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Get checkout session status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

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

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        totalAmount: order.totalAmount,
        acpOrderId: order.acpOrderId,
        items: order.items,
      },
    });

  } catch (error: any) {
    console.error('Checkout status error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get checkout status' },
      { status: 500 }
    );
  }
}
