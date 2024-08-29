'use server';

import { getProducts } from './_lib/mongo/adapter';

export async function Products() {
  const products = await getProducts();

  console.log(products);

  if (!products) return false;

  return products;
}
