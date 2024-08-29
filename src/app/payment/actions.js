'use server';

import {
  getUserAddress,
  updateUserAddress,
  createOrder,
} from '@/app/_lib/mongo/adapter';

import SendEmail from '../_lib/resend/send-email';
import Template from '../_lib/resend/templates/order-html';
import { Products } from '../actions';

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

const getFormattedDate = () => {
  const now = new Date();
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  };
  return now.toLocaleDateString('es-ES', options);
};

const calculatePay = (products, items) => {
  const totalItemsCount = items.reduce((acc, { count }) => acc + count, 0);
  const totalPriceInCents = items.reduce((acc, { id, count }) => {
    const currProd = products.find((product) => product.id === id);
    if (!currProd) throw new Error('Un producto es inválido');

    return acc + currProd.price * count;
  }, 0);

  const iva = totalPriceInCents * 0.16;

  let shipment = 600;

  if (totalItemsCount > 5) {
    shipment += 600;
  }

  const itemsToPay = items.map(({ id, count }) => {
    const currProd = products.find((product) => product.id === id);
    if (!currProd) throw new Error('Un producto es inválido');

    return {
      name: currProd.name,
      amount: currProd.price * 100,
      quantity: count,
      image: currProd.images[0],
      price: currProd.price,
    };
  });

  return {
    shipmentCharge: shipment * 100,
    ivaCharge: iva * 100,
    items: itemsToPay,
    total: totalPriceInCents + shipment + iva,
  };
};

export async function createCheckoutSession(items, email) {
  try {
    const products = await Products();

    const payload = calculatePay(products, items);

    if (payload) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();

      const order = await createOrder(
        email,
        items,
        payload.total,
        data.sessionId
      );

      if (order) {
        const now = getFormattedDate();

        await SendEmail(
          [email],
          `Detalles de tu compra | ${order}`,
          Template(payload.items, payload.total, order, now)
        );

        return data.sessionId;
      } else throw new Error('No se pudo crear la orden de pago');
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}
