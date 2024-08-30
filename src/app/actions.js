'use server';

import { getProducts } from './_lib/mongo/adapter';

export async function Products() {
  const products = await getProducts();

  if (!products) return false;

  return products;
}
