'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState([
    {
      id: '1',
      name: 'Playera de raya',
      description: 'Ola',
      price: 200,
      images: ['/prb.png'],
      category: 'a',
    },
    {
      id: '2',
      name: 'Ola2aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
      description: 'Ola',
      price: 200,
      images: ['/prb.png'],
      category: 'a',
    },
    {
      id: '3',
      name: 'Ola3',
      description: 'Ola',
      price: 200,
      images: ['/prb.png'],
      category: 'a',
    },
    {
      id: '4',
      name: 'Ola4',
      description: 'Ola',
      price: 200,
      images: ['/prb.png'],
      category: 'a',
    },
    {
      id: '5',
      name: 'Ola5',
      description: 'Ola',
      price: 200,
      images: ['/prb.png'],
      category: 'a',
    },
    {
      id: '6',
      name: 'Ola6',
      description: 'Ola',
      price: 200,
      images: ['/prb.png'],
      category: 'a',
    },
    {
      id: '7',
      name: 'Ola7',
      description: 'Ola',
      price: 200,
      images: ['/prb.png'],
      category: 'a',
    },
    {
      id: '8',
      name: 'Ola8',
      description: 'Ola',
      price: 200,
      images: ['/prb.png'],
      category: 'a',
    },
  ]);
  const [order, setOrder] = useState(() => products.slice(0, 3));
  const [shoppingCart, setShoppingCart] = useState([]);

  const [sliceStart, setSliceStart] = useState(false);
  const [sliceEnd, setSliceEnd] = useState(false);
  const [viewShoppingCart, setViewShoppingCart] = useState(false);
  const [countItems, setCountItems] = useState(0);

  const [subTotal, setSubTotal] = useState(0);

  const randyAviseRef = useRef(null);

  const handleNextArrow = (e) => {
    e.preventDefault();
    const prevOrder = order.slice();

    const lastProductIndex = products.indexOf(prevOrder[0]) + 1;
    const nextStartIndex = lastProductIndex % products.length;
    const auxOrder = products.slice(nextStartIndex, nextStartIndex + 3);

    let nextOrder = [];

    if (auxOrder.length < 3) {
      nextOrder = auxOrder.concat(products.slice(0, 3 - auxOrder.length));
    } else {
      nextOrder = auxOrder;
    }

    setOrder(nextOrder);
    setSliceEnd(true);

    setTimeout(() => {
      setSliceEnd(false);
    }, 500);
  };

  const handlePrevArrow = (e) => {
    e.preventDefault();
    const currOrder = order.slice();

    const firstProductIndex = products.indexOf(currOrder[0]);
    const prevStartIndex =
      (firstProductIndex + products.length) % products.length;

    const prevOrder = [
      products[(prevStartIndex + products.length - 1) % products.length],
      products[(prevStartIndex + products.length) % products.length],
      products[(prevStartIndex + 1) % products.length],
    ];

    setOrder(prevOrder);

    setSliceStart(true);

    setTimeout(() => {
      setSliceStart(false);
    }, 500);
  };

  const handleAddCart = (itemId) => {
    const currProduct = products.find(({ id }) => itemId === id);
    const currShoppingCart = shoppingCart.slice();

    const existsItem = currShoppingCart.some(
      (product) => product.id === currProduct.id
    );

    let auxArr = [];

    if (existsItem) {
      auxArr = currShoppingCart.map((item) => {
        if (item.id === currProduct.id) {
          let auxCount = (item.count || 1) + 1;
          return { ...item, count: auxCount };
        } else return item;
      });
    } else {
      auxArr = [...currShoppingCart, { ...currProduct, count: 1 }];
    }

    setShoppingCart(auxArr);
    handleSubTotal(auxArr);
    handleCountItems(auxArr);

    if (((countItems + 1) % 3 === 0 && countItems !== 2) || countItems === 1)
      handleRemoveRandy();
  };

  const handleSubTotal = (arr) => {
    const sub = arr.reduce((acc, curr) => {
      return curr.price * curr.count + acc;
    }, 0);

    setSubTotal(sub);
  };

  const handleCountItems = (arr) => {
    const countItems = arr.reduce((acc, curr) => {
      return curr.count + acc;
    }, 0);

    setCountItems(countItems);
  };

  const handleRemoveRandy = async () => {
    if (randyAviseRef.current) {
      randyAviseRef.current.classList.remove(
        'transition-opacity',
        'transition-transform',
        'duration-1000',
        'opacity-0',
        'translate-x-full'
      );
      randyAviseRef.current.classList.add(
        'transition-opacity',
        'transition-transform',
        'duration-1000',
        'opacity-100',
        'translate-x-0'
      );

      await new Promise((resolve) => {
        setTimeout(() => {
          randyAviseRef.current.classList.add(
            'transition-opacity',
            'transition-transform',
            'duration-1000',
            'opacity-0',
            'translate-x-full'
          );

          setTimeout(() => {
            resolve();
          }, 300);
        }, 3500);
      });
    }
  };

  return (
    <div className="h-[100dvh] w-screen overflow-hidden flex flex-col select-none">
      {viewShoppingCart && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/50 z-30"
          onClick={() => setViewShoppingCart(false)}
        />
      )}
      <header className="bg-dorange w-screen h-36 flex flex-col justify-center items-start ps-5  sm:items-center md:gap-3 relative">
        <Image
          src="https://cdn.randomlandia.com/ecommerce/logoLarge.svg"
          width={300}
          height={100}
          alt="Logo largo de randomlandia"
          className="md:scale-150 animate-fade-left"
        />
        <h2 className="font-lucky text-white text-xl animate-fade-right hover:animate-jump">
          Los mejores productos
        </h2>
        <div className="absolute bottom-3 sm:top-1/2 sm:transition sm:-translate-y-1/2 end-8 ">
          {shoppingCart.length > 0 && (
            <>
              <button
                type="button"
                className="hover:animate-jump"
                onClick={() => setViewShoppingCart(true)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-12 fill-oldwhite animate-jump-in">
                  <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 15h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
                </svg>
                <span className="absolute text-sm font-lucky text-white bg-red-600 rounded-full px-2 -top-3 end-0">
                  {countItems}
                </span>
              </button>
            </>
          )}
        </div>
        <RandyAvise randyRef={randyAviseRef} />
      </header>

      <ShoppingCart
        view={viewShoppingCart}
        setView={setViewShoppingCart}
        items={shoppingCart}
        setItems={setShoppingCart}
        subTotal={subTotal}
        setSub={handleSubTotal}
        setCount={handleCountItems}
      />

      <main className="grow px-2 sm:p-5 flex items-center overflow-hidden">
        <button
          className="size-8 md:size-10"
          onClick={(e) => handlePrevArrow(e)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-8 md:size-10 stroke-lorange hover:fill-dorange hover:scale-[1.5] transition-transform hover:stroke-white">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
        <section className="w-full flex flex-wrap justify-around items-center animate-fade-right">
          {order.map(
            (
              { id, name, description, price, stock, category, images },
              index
            ) => {
              return (
                <div
                  key={`product-${id}`}
                  className={`${index === 0 && 'hidden md:flex'} ${
                    sliceStart ? 'animate-fade-right' : ''
                  } ${
                    index === 1 && 'h-[400px] w-[300px]'
                  } hover:scale-105 h-[300px] w-56 bg-gray-400/20 rounded-2xl  transition-transform ease-in-out relative font-lucky p-3 ${
                    index === 2 && 'hidden lg:flex'
                  } ${
                    sliceEnd ? 'animate-fade-left' : ''
                  } animate-duration-200 group`}>
                  <Image
                    src={images[0]}
                    height={400}
                    width={400}
                    alt={name}
                    className="absolute top-0 start-0 aspect-square h-full z-0"
                  />
                  <h2 className="text-xl text-center w-full truncate text-dgreen">
                    {name}
                  </h2>
                  {shoppingCart.some((product) => product.id === id) && (
                    <>
                      <span className="text-transparent bg-clip-text bg-dorange text-4xl text-center absolute end-1/2 top-1/2 transition translate-x-1/2 -translate-y-1/2">
                        ¡Agregado al carrito!
                      </span>
                    </>
                  )}
                  <span
                    className={`absolute bottom-3 start-1/2 transition -translate-x-1/2 text-dorange ${
                      index === 1 ? 'text-4xl' : 'text-2xl'
                    }`}>
                    $ {price}
                  </span>
                  <button
                    className="absolute start-5 bottom-3 group-hover:animate-wiggle-more group-hover:animate-infinite"
                    onClick={() => handleAddCart(id)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-10 fill-dorange group-hover:scale-[1.5]">
                      <path
                        fillRule="evenodd"
                        d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              );
            }
          )}
        </section>
        <button
          className="size-8 md:size-10"
          onClick={(e) => handleNextArrow(e)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-8 md:size-10 stroke-lgreen hover:fill-lgreen hover:scale-[1.5] transition-transform hover:stroke-white">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </button>
      </main>

      <footer className="font-lucky text-sm fixed bottom-3 start-1/2 transition -translate-x-1/2 hover:scale-125">
        Visita{' '}
        <Link
          href={'https://randomlandia.com/'}
          className="bg-gradient-to-tl from-lorange via-orange-600/90 to-dorange text-transparent bg-clip-text">
          randomlandia.com
        </Link>
      </footer>
    </div>
  );
}

function RandyAvise({ randyRef }) {
  return (
    <div
      ref={randyRef}
      className="translate-x-full h-auto w-auto absolute -end-10 -bottom-36 flex flex-col-reverse justify-end items-center -rotate-90">
      <Image
        src="https://cdn.randomlandia.com/ecommerce/randy-avise.webp"
        width={56}
        height={56}
        alt="Aviso de Randdy para ver el carrito de compras"
      />
      <span className="text-white rounded-full font-ram w-48 bg-dgreen text-center p-2">
        Pssst, pssst... ¡Revisa tu carrito!
      </span>
    </div>
  );
}

function ShoppingCart({
  view,
  setView,
  items,
  setItems,
  subTotal,
  setSub,
  setCount,
}) {
  const handleRemoveProductToCart = (item) => {
    const currCart = items.slice();
    const indexToRemove = currCart.indexOf(item);

    if (indexToRemove !== -1) {
      currCart.splice(indexToRemove, 1);
    }

    setItems(currCart);

    if (currCart.length === 0) setView(false);

    setSub(currCart);
    setCount(currCart);
  };

  const handleChangeCount = (character, item) => {
    const currCart = items.slice();
    const indexToOperation = currCart.indexOf(item);

    if (indexToOperation !== -1) {
      if (character === '+') {
        currCart[indexToOperation].count =
          (currCart[indexToOperation].count || 0) + 1;
      } else if (character === '-') {
        currCart[indexToOperation].count =
          (currCart[indexToOperation].count || 0) - 1;
        if (currCart[indexToOperation].count <= 0) {
          currCart.splice(indexToOperation, 1);
        }
      }

      setItems(currCart);

      setItems(currCart);

      if (currCart.length === 0) setView(false);

      setSub(currCart);
      setCount(currCart);
    }
  };

  return (
    <>
      <style
        jsx
        global>{`
        .scrollbar-custom::-webkit-scrollbar {
          width: 12px;
        }

        .scrollbar-custom::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-custom::-webkit-scrollbar-thumb {
          background-color: #fff;
          border-radius: 10px;
          border: 3px solid #fff;
        }

        .scrollbar-custom {
          scrollbar-width: thin;
          scrollbar-color: #fff transparent;
        }
      `}</style>

      <div
        className={`${
          view
            ? 'translate-x-0 animate-fade-left animate-duration-200'
            : 'translate-x-full'
        } fixed top-0 right-0 z-40 h-screen w-full md:w-1/2 p-4 overflow-y-auto bg-dorange text-white flex flex-col justify-between overflow-hidden md:rounded-s-xl`}
        tabIndex="-1"
        aria-labelledby="drawer-right-label">
        <h5 className="inline-flex items-center mb-4 text-4xl font-lucky">
          Tu carrito
        </h5>
        <button
          type="button"
          onClick={() => setView(false)}
          className="text-white bg-transparent rounded-lg text-sm w-8 h-8 absolute top-2.5 end-8 inline-flex items-center justify-center">
          Cerrar
          <span className="sr-only">Cerrar menú</span>
        </button>

        <div
          className="flex flex-col gap-4 p-5 overflow-y-auto scrollbar-custom"
          style={{
            scrollbarWidth: 'thin',
          }}>
          {items?.map((item) => {
            const { id, name, price, images, count } = item;
            return (
              <div
                key={`cart-${id}`}
                className="items-center space-x-3 relative grid grid-cols-10 group/item hover:bg-slate-100/5">
                <Image
                  src={images[0]}
                  height={100}
                  width={100}
                  alt={name}
                  className="col-span-1"
                />
                <span className="truncate pe-3 col-span-3">{name}</span>

                <span className="truncate pe-3 col-span-2 text-sm">
                  <span className="text-xs">$</span> {price} c/u
                </span>

                <div className="col-span-3 flex">
                  <button
                    className="aspect-square text-2xl grow flex justify-center items-center group/characterSubs"
                    onClick={() => handleChangeCount('-', item)}>
                    <span className="group-hover/characterSubs:scale-150">
                      -
                    </span>
                  </button>
                  <span className="grow flex justify-center items-center">
                    {count}
                  </span>
                  <button
                    className="text-xl grow flex justify-center items-center group/characterAdd"
                    onClick={() => handleChangeCount('+', item)}>
                    <span className="group-hover/characterAdd:scale-150 aspect-square">
                      +
                    </span>
                  </button>
                </div>

                <button
                  onClick={() => handleRemoveProductToCart(item)}
                  className="col-span-1 md:invisible md:group-hover/item:visible w-full aspect-square flex justify-center items-center">
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                    className="size-2 hover:size-4 transition-transform">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      className="stroke-white"
                    />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        <div className="h-32 flex justify-start gap-3">
          <Image
            src="https://cdn.randomlandia.com/ecommerce/randy-cart.webp"
            height={128}
            width={128}
          />
          <div className="bg-oldwhite rounded-full rounded-es-none text-dorange font-lucky text-sm sm:text-xl h-auto sm:h-1/2 px-3 flex flex-col sm:flex-row items-center justify-center text-center">
            <span>
              Serían $<u>{subTotal}</u>, por favor
            </span>
          </div>
          <button className="font-lucky text-xl bg-dgreen p-3 rounded-full absolute end-3 bottom-3 hover:animate-wiggle-more hover:animate-infinite">
            Ir a pagar
          </button>
        </div>
      </div>
    </>
  );
}
