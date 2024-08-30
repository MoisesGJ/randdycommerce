'use client';
import Luz from '@/components/Luz';
import { useUser, SignOutButton } from '@clerk/nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';

import getStripe from '../_lib/stripe';
import { getAddress, createAddress, createCheckoutSession } from './actions';

export default function PaymentPage() {
  const [animacionActiva, setAnimacionActiva] = useState(true);
  const [hasAddress, setHasAddress] = useState(null);
  const [messageErrors, setMessageErrors] = useState(null);
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  const createError = (error) => {
    setMessageErrors(error);
    setTimeout(() => {
      setMessageErrors(null);
    }, 3000);
  };

  useEffect(() => {
    if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
      const checkUserAddress = async () => {
        try {
          const userHasAddress = await getAddress(
            user.primaryEmailAddress.emailAddress
          );
          setHasAddress(userHasAddress ? true : false);
        } catch (error) {
          console.error('Error fetching address:', error);
          setMessageErrors('Error al validar la dirección');
        }
      };

      checkUserAddress();
    }
  }, [isSignedIn, user?.primaryEmailAddress?.emailAddress]);

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }

  const handleOnSubmit = async (data) => {
    const isAddressCreated = await createAddress(
      user.primaryEmailAddress.emailAddress,
      data
    );

    if (!isAddressCreated.error) setHasAddress(true);
    else createError(isAddressCreated.error);
  };

  return (
    <div className="h-[130dvh] md:h-[100dvh] w-screen flex flex-col items-center justify-center bg-cover bg-left-bottom lg:bg-center  bg-no-repeat  bg-[url('/fondo.png')] overflow-hidden relative pt-36 pb-5">
      <Luz active={animacionActiva}></Luz>

      {messageErrors && (
        <span className="absolute top-5 bg-red-600 p-5 px-10 rounded-full">
          {messageErrors}
        </span>
      )}
      <div className="absolute z-50 top-0 py-6 md:py-2 start-0 w-screen flex justify-between px-3 md:px-12 bg-gray-100/50 text-dgreen">
        <button
          className="hover:scale-110 font-extrabold text-2xl  hover:font-bold hover:text-lorange transition-colors duration-300"
          onClick={() => router.push('/')}>
          Regresar a comprar
        </button>
        <div className="flex z-50 justify-end items-center relative group/session">
          {user.hasImage && (
            <Image
              src={user.imageUrl}
              width={40}
              height={40}
              className="rounded-full me-2"
              alt={`Imagen de usuario de ${user.firstName}`}
            />
          )}
          <span className="font-extrabold text-2xl ">
            ¡Hola, <b>{user.firstName}</b>!
          </span>
          <SignOutButton>
            <button className="absolute -bottom-3 text-sm md:hidden">
              Cerrar sesión
            </button>
          </SignOutButton>
          <div className="hidden md:group-hover/session:block absolute end-0 top-full bg-gray-100 text-dorange p-4 rounded-2xl rounded-tl-none">
            <SignOutButton>
              <button className="font-normal hover:font-semibold hover:text-dorange transition-colors duration-300">
                Cerrar sesión
              </button>
            </SignOutButton>
          </div>
        </div>
      </div>

      <main className="w-11/12 max-w-[900px] h-full md:h-[500px] rounded-2xl p-5 flex justify-center items-center bg-oldwhite/50 relative z-20">
        {hasAddress === null && <Spinner />}
        {hasAddress === false && (
          <Address
            displayName={user.fullName}
            onSubmit={handleOnSubmit}
          />
        )}
        {hasAddress === true && (
          <Payment email={user?.primaryEmailAddress?.emailAddress} />
        )}
      </main>
    </div>
  );
}

function Payment({ email }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState(
    JSON.parse(localStorage.getItem('cart')) || []
  );
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const itemsToPay = items.map(({ id, count }) => {
        return { id, count };
      });

      const sessionId = await createCheckoutSession(itemsToPay, email);
      const stripe = await getStripe();

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  const handleSubTotal = (arr) => {
    const sub = arr.reduce((acc, curr) => {
      return curr.price * curr.count + acc;
    }, 0);

    setSubtotal(sub);
  };

  const handleSetLStorage = (currArr) => {
    localStorage.setItem('cart', JSON.stringify(currArr));
  };

  const handleNotProducts = () => {
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  const handleTotal = (arr) => {
    let items = 0;
    const sub = arr.reduce((acc, curr) => {
      items += curr.count;
      return curr.price * curr.count + acc;
    }, 0);

    const iva = sub * 0.16;

    let subtotal = sub + 600;

    if (items > 5) {
      subtotal += 600;
    }

    setTotal(subtotal + iva);
  };

  useEffect(() => {
    if (items.length === 0) {
      handleNotProducts();
    }
  }, [items]);

  useEffect(() => {
    handleSubTotal(items);
    handleTotal(items);
  }, [items]);

  return (
    <div className="text-slate-700 h-full w-full pb-2 flex flex-col justify-between items-start relative">
      {loading && (
        <div className="fixed z-20 top-0 start-0 w-full h-full flex justify-center items-center backdrop-blur-sm">
          <Spinner />
        </div>
      )}
      <h1 className="text-2xl font-bold">Productos</h1>
      {items.length > 0 ? (
        <Cart
          items={items}
          setItems={setItems}
          subTotal={subtotal}
          setSub={handleSubTotal}
          setLocalStorage={handleSetLStorage}
          handleNotProducts={handleNotProducts}
          total={total}
          setTotal={handleTotal}
        />
      ) : (
        <h2 className="w-full text-center italic text-xl absolute top-1/2">
          No hay productos por aquí...
        </h2>
      )}
      <button
        role="link"
        onClick={handleCheckout}
        disabled={loading}
        className={`bg-dgreen text-white font-bold px-4 py-2 rounded hover:bg-dgreen-dark transition-colors w-full hover:bg-dgreen/90 ${
          items.length > 0 ? 'block' : 'hidden'
        }`}>
        ¡Todo se ve bien!
      </button>
    </div>
  );
}

function Cart({
  items,
  setItems,
  subTotal,
  setSub,
  setLocalStorage,
  handleNotProducts,
  total,
  setTotal,
}) {
  const handleRemoveProductToCart = (item) => {
    const currCart = items.slice();
    const indexToRemove = currCart.indexOf(item);

    if (indexToRemove !== -1) {
      currCart.splice(indexToRemove, 1);
    }

    setItems(currCart);

    setLocalStorage(currCart);

    if (currCart.length === 0) handleNotProducts();

    setSub(currCart);
    setTotal(currCart);
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

      setLocalStorage(currCart);

      if (currCart.length === 0) handleNotProducts();

      setSub(currCart);
      setTotal(currCart);
    }
  };

  return (
    <>
      <div
        className="flex flex-col gap-4 p-5 overflow-y-auto scrollbar-custom py-12 relative"
        style={{
          scrollbarWidth: 'thin',
        }}>
        {items?.map((item) => {
          const { id, name, price, images, count } = item;
          return (
            <div
              key={`cart-${id}`}
              className="items-center space-x-3 relative grid grid-cols-10 group/item md:rounded-3xl md:hover:bg-dorange/50 md:hover:text-white md:hover:font-bold">
              <div className="col-span-1 group relative">
                <Image
                  src={images[1]}
                  height={100}
                  width={100}
                  alt={name}
                />
                <Image
                  src={images[1]}
                  height={100}
                  width={100}
                  alt={name}
                  className="hidden group-hover:block absolute top-0 scale-[1.5]"
                />
              </div>

              <span className="truncate pe-3 col-span-3">{name}</span>

              <span className="truncate pe-3 col-span-2 text-sm">
                <span className="text-xs">$</span> {price} c/u
              </span>

              <div className="col-span-3 flex">
                <button
                  className="aspect-square text-2xl grow flex justify-center items-center group/characterSubs"
                  onClick={() => handleChangeCount('-', item)}>
                  <span className="group-hover/characterSubs:scale-150">-</span>
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
                className="col-span-1 md:invisible group-hover/item:visible w-full aspect-square flex justify-center items-center group/btn">
                <p className="hidden md:group-hover/btn:block absolute -top-11 text-sm bg-gray-100/80 rounded-2xl p-3 text-slate-700 ">
                  Borrar producto
                </p>
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                  className="size-2 group-hover/btn:size-4 transition-transform">
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    className="md:stroke-white"
                  />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
      <div className="my-4 font-bold w-full text-end">
        <h3 className="text-lg">Subtotal: $ {subTotal}</h3>
        <h3 className="text-xl underline">
          Total <span className="text-sm">(iva + envío)</span>: ${' '}
          <span className="text-2xl">{total}</span>
        </h3>
      </div>
    </>
  );
}

function Address({ displayName, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full text-dgreen p-3 flex flex-col">
      <h1 className="text-2xl font-bold mb-4">
        ¿A dónde enviaremos los productos?
      </h1>

      <div className="grow grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 overflow-auto">
        <div>
          <label
            htmlFor="name"
            className="block text-lg font-medium mb-1">
            Nombre
          </label>
          <input
            id="name"
            type="text"
            defaultValue={displayName}
            {...register('name', { required: 'El nombre es obligatorio' })}
            className={`w-full p-2 border rounded-[40px] ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-lg font-medium mb-1">
            Dirección
          </label>
          <input
            id="address"
            type="text"
            {...register('address', {
              required: 'La dirección es obligatoria',
            })}
            className={`w-full p-2 border rounded-[40px] ${
              errors.address ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="city"
            className="block text-lg font-medium mb-1">
            Ciudad
          </label>
          <input
            id="city"
            type="text"
            {...register('city', { required: 'La ciudad es obligatoria' })}
            className={`w-full p-2 border rounded-[40px] ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="postalCode"
            className="block text-lg font-medium mb-1">
            Código Postal
          </label>
          <input
            id="postalCode"
            type="text"
            {...register('postalCode', {
              required: 'El código postal es obligatorio',
              pattern: {
                value: /^[0-9]+$/,
                message: 'El código postal debe ser solo números',
              },
            })}
            className={`w-full p-2 border rounded-[40px] ${
              errors.postalCode ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.postalCode && (
            <p className="text-red-500 text-sm mt-1">
              {errors.postalCode.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="country"
            className="block text-lg font-medium mb-1">
            País
          </label>
          <input
            id="country"
            type="text"
            defaultValue="México"
            readOnly
            className="w-full p-2 border rounded-[40px] bg-gray-100 cursor-not-allowed font-bold"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-dgreen text-white px-4 py-2 rounded hover:bg-dgreen-dark transition-colors">
        Ir a pagar
      </button>
    </form>
  );
}

function Spinner() {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="w-8 h-8 animate-spin text-gray-400 fill-dgreen"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
