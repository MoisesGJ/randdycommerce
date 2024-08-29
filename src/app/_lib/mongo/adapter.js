import 'server-only';

import { ObjectId } from 'mongodb';
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
