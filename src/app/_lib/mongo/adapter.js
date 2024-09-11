import 'server-only';

import { connectToDatabase } from './connect';

export async function getUserAddress(email) {
  const { db } = await connectToDatabase();
  try {
    const result = await db
      .collection('users')
      .findOne({ email: email }, { projection: { address: 1 } });

    if (!result.address) {
      return false;
    }

    return result.address;
  } catch (error) {
    console.error('Failed to get user address', error);
    throw error;
  }
}

export async function updateUserAddress(email, address) {
  const { db } = await connectToDatabase();

  try {
    const result = await db.collection('users').updateOne(
      { email: email },
      {
        $set: {
          address: {
            name: address.name,
            address: address.address,
            city: address.city,
            postalCode: address.postalCode,
            country: 'México',
          },
        },
      }
    );

    if (result.matchedCount > 0 && result.modifiedCount > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Failed to update user address', error);
    throw error;
  }
}

export async function getProducts() {
  const { db } = await connectToDatabase();

  try {
    const products = await db.collection('products').find().toArray();

    const plainProducts = products.map(({ _id, ...rest }) => ({
      ...rest,
      id: _id.toString(),
    }));

    return plainProducts;
  } catch (error) {
    console.error('Failed to get products', error);
    throw error;
  }
}

export async function createOrder(email, items, totalAmount, order) {
  const { db } = await connectToDatabase();

  try {
    const result = await db.collection('orders').insertOne({
      email: email,
      order,
      items,
      totalAmount,
      createdAt: new Date(),
      status: 'pending',
    });

    return result.insertedId;
  } catch (error) {
    console.error('Failed to create order', error);
    throw error;
  }
}

export async function getUserOrders(email) {
  const { db } = await connectToDatabase();

  try {
    const orders = await db
      .collection('orders')
      .find({ email: email })
      .toArray();
    return orders;
  } catch (error) {
    console.error('Failed to get user orders', error);
    throw error;
  }
}

export async function updateOrderStatus(order, status) {
  const { db } = await connectToDatabase();

  try {
    const currOrder = await db.collection('orders').findOne({ order: order });

    if (!currOrder) {
      return false;
    }

    const result = await db
      .collection('orders')
      .updateOne({ order: order }, { $set: { status } });

    if (result.matchedCount > 0 && result.modifiedCount > 0)
      return { email: currOrder.email, id: currOrder._id };
    else return false;
  } catch (error) {
    console.error('Failed to update order status', error);
    throw error;
  }
}
