'use client';

import ShoppingCart from '@/components/ShoppingCart';
import Luz from '@/components/Luz';
import BurbujaAdaptable from '@/components/Burbujaadaptable';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Products } from './actions';
import Skeleton from '@/components/SkeletonBurbuja';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState([]);
  const [shoppingCart, setShoppingCart] = useState([]);

  const [sliceStart, setSliceStart] = useState(false);
  const [sliceEnd, setSliceEnd] = useState(false);
  const [viewShoppingCart, setViewShoppingCart] = useState(false);
  const [countItems, setCountItems] = useState(0);

  const [subTotal, setSubTotal] = useState(0);

  const randyAviseRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    const getProducts = async () => {
      const productsFetch = await Products();

      setProducts(productsFetch);
    };

    getProducts();
  }, []);

  useEffect(() => {
    setOrder(() => products.slice(0, 3));
  }, [products]);

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

  const handleSetLStorage = (currArr) => {
    localStorage.setItem('cart', JSON.stringify(currArr));
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
    handleSetLStorage(auxArr);
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

  const handleRemoveRandy = async () => { };

  const handlePayment = () => {
    router.push('/payment');
  };

  useEffect(() => {
    const existsCart = localStorage.getItem('cart');

    if (existsCart) {
      const saveData = JSON.parse(existsCart);
      setShoppingCart(saveData);
      handleSubTotal(saveData);
      handleCountItems(saveData);
    }
  }, []);

  return (
    <div className="h-[100dvh] w-screen bg-[url('/fondo.png')]  max-h-screen  bg-cover bg-left-bottom lg:bg-center  bg-no-repeat  overflow-hidden flex flex-col select-none">
      {viewShoppingCart && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/50 z-30"
          onClick={() => setViewShoppingCart(false)}
        />
      )}
      <header className="header-tienda h-32 w-screen flex flex-col justify-center items-start ps-5 sm:items-center md:gap-3 relative">
        <div className="holanes">
          <div className="holan"></div>
          <div className="holan"></div>
          <div className="holan"></div>
          <div className="holan"></div>
          <div className="holan"></div>
          <div className="holan"></div>
        </div>
        <div className="flex px-3">
          <Image
            src="https://cdn.randomlandia.com/ecommerce/logoLarge.svg"
            width={300}
            height={100}
            alt="Logo largo de randomlandia"
            className="md:scale-150 pb-6 animate-fade-left"
          />
          <h2 className="hidden md:inline-block font-lucky pl-10 text-white text-xl animate-fade-right hover:animate-jump">
            Los mejores productos
          </h2>
        </div>
        <div className="absolute bottom-3 sm:top-1/2 sm:transition sm:-translate-y-1/2 end-8">
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
      </header>

      <ShoppingCart
        view={viewShoppingCart}
        setView={setViewShoppingCart}
        items={shoppingCart}
        setItems={setShoppingCart}
        subTotal={subTotal}
        setSub={handleSubTotal}
        setCount={handleCountItems}
        setLocalStorage={handleSetLStorage}
        navigatePayment={handlePayment}
      />

      <main className="grow px-2 sm:p-5 flex items-center overflow-hidden relative">
        <RandyAvise randyRef={randyAviseRef} />
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
          {order.length < 1 && <Skeleton />}
          {order.map(
            (
              { id, name, description, price, stock, category, images },
              index
            ) => {

              const isExistsInCart = shoppingCart.some((product) => product.id === id)

              return (
                <div
                  id="burbuja2"
                  key={`product-${id}`}
                  className={`${index === 0 && 'hidden md:flex'} ${sliceStart ? 'animate-fade-right' : ''
                    } ${index === 1 && 'md:size-[350px]'
                    } hover:scale-105 size-[250px] md:size-[300px] rounded-2xl  transition-transform ease-in-out relative font-lucky p-3 ${index === 2 && 'hidden lg:flex'
                    } ${sliceEnd ? 'animate-fade-left' : ''
                    } animate-duration-200 group`}>
                  <BurbujaAdaptable className='w-full h-full' />
                  <Image
                    src={images[0]}
                    height={200}
                    width={200}
                    alt={name}
                    className={`${isExistsInCart && 'blur-md drop-shadow-xl'} drop-shadow-2xl absolute top-1/2 start-1/2 transition -translate-x-1/2 -translate-y-1/2 z-0 scale-75 md:scale-100`}
                  />

                  <h2 className="absolute top-3 start-0 text-4xl text-center w-full text-white truncate">
                    {name}
                  </h2>
                  {isExistsInCart && (
                    <>
                      <span className="text-dorange text-2xl text-center absolute end-1/2 top-1/2 transition translate-x-1/2 -translate-y-1/2 z-50">
                        ¡Agregado al carrito!
                      </span>
                    </>
                  )}
                  <span
                    className={`absolute bottom-3 start-1/2 transition -translate-x-1/2  text-dorange  drop-shadow-md filter brightness-110 text-2xl ${index === 1 ? 'md:text-5xl' : 'md:text-4xl'
                      }`}>
                    $ {price}
                  </span>
                  <button
                    className="absolute start-[25%] md:start-[15%] bottom-3 group-hover:animate-wiggle-more group-hover:animate-infinite"
                    onClick={() => handleAddCart(id)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={`fill-white group-hover:scale-[1.5] size-8 md:size-12`}>
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

      <footer className="font-lucky text-sm fixed bottom-3 start-1/2 transition -translate-x-1/2 hover:scale-125 backdrop-blur-md backdrop-opacity-100 text-dgreen p-2 rounded-3xl whitespace-nowrap">
        <div className="absolute inset-0 -z-10 bg-white/65 rounded-full"></div>
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
      className="absolute z-40 translate-x-full pr-3 h-auto w-auto -end-10 
       flex flex-col-reverse justify-end items-center -rotate-90">
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
