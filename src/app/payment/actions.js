'use server';

import { getUserAddress, updateUserAddress } from '@/app/_lib/mongo/adapter';

export async function getAddress(email) {
  const hasAddress = await getUserAddress(email);

  if (!hasAddress) return false;

  return true;
}

export async function createAddress(email, address) {
  const createAddress = await updateUserAddress(email, address);

  if (!createAddress) return { error: 'No se ha podido guardar la dirección.' };

  return true;
}

export async function createCheckoutSession(items) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/checkout`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const data = await response.json();
    return data.sessionId;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}
