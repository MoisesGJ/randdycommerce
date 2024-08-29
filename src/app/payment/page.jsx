"use client";
import Luz from "@/components/Luz";
import { useUser, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import getStripe from "../_lib/stripe";
import { getAddress, createAddress, createCheckoutSession } from "./actions";

export default function HomePage() {
  const [animacionActiva, setAnimacionActiva] = useState(true);
  const [hasAddress, setHasAddress] = useState(null);
  const [messageErrors, setMessageErrors] = useState(null);
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
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
          console.error("Error fetching address:", error);
          setMessageErrors("Error al validar la dirección");
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
    <div className=" flex flex-col gap-3.5 items-center justify-center  bg-cover bg-left-bottom lg:bg-center  bg-no-repeat  bg-[url('/fondo.png')] ">
      <div className="min-h-screen w-screen Alex flex-col gap-3.5 items-center justify-center bg-transparent ">
        <Luz
          className="h-96 relative overflow-hidden"
          active={animacionActiva}
        ></Luz>
        <div className="absoute z-50">
          {messageErrors && (
            <span className="absolute top-5 bg-red-600 p-5 px-10 rounded-full">
              {messageErrors}
            </span>
          )}
          <div className="absolute z-50 top-2 start-0 w-screen flex justify-between px-3 md:px-12">
            <button
              className="hover:scale-110 font-extrabold text-2xl  hover:font-bold hover:text-lorange transition-colors duration-300"
              onClick={() => router.push("/")}
            >
              Regresar a comprar
            </button>
            <div className="flex absolute z-50 justify-end items-center relative group/session">
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
          <div className="flex justify-center items-center min-h-screen">
            <main className="absolute z-50 top-40 bg-oldwhite/50 max-w-[900px] h-full md:h-[500px] rounded-[40px] p-5 flex justify-center items-center">
              {hasAddress === null && <Spinner />}
              {hasAddress === false && (
                <Address
                  displayName={user.fullName}
                  onSubmit={handleOnSubmit}
                />
              )}
              {hasAddress === true && <Payment />}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

function Payment() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const items = [
        { name: "Item 1", amount: 1000, quantity: 1 },
        { name: "Item 2", amount: 2000, quantity: 2 },
      ];

      const sessionId = await createCheckoutSession(items);
      const stripe = await getStripe();

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button role="link" onClick={handleCheckout} disabled={loading}>
        {loading ? "Loading..." : "Checkout"}
      </button>
    </div>
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
      className="w-full h-full text-dgreen p-3 flex flex-col"
    >
      <h1 className="text-2xl font-bold mb-4">
        ¿A dónde enviaremos los productos?
      </h1>

      <div className="grow grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 overflow-auto">
        <div>
          <label htmlFor="name" className="block text-lg font-medium mb-1">
            Nombre
          </label>
          <input
            id="name"
            type="text"
            defaultValue={displayName}
            {...register("name", { required: "El nombre es obligatorio" })}
            className={`w-full p-2 border rounded-[40px] ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="address" className="block text-lg font-medium mb-1">
            Dirección
          </label>
          <input
            id="address"
            type="text"
            {...register("address", {
              required: "La dirección es obligatoria",
            })}
            className={`w-full p-2 border rounded-[40px] ${
              errors.address ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="city" className="block text-lg font-medium mb-1">
            Ciudad
          </label>
          <input
            id="city"
            type="text"
            {...register("city", { required: "La ciudad es obligatoria" })}
            className={`w-full p-2 border rounded-[40px] ${
              errors.city ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="postalCode"
            className="block text-lg font-medium mb-1"
          >
            Código Postal
          </label>
          <input
            id="postalCode"
            type="text"
            {...register("postalCode", {
              required: "El código postal es obligatorio",
              pattern: {
                value: /^[0-9]+$/,
                message: "El código postal debe ser solo números",
              },
            })}
            className={`w-full p-2 border rounded-[40px] ${
              errors.postalCode ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.postalCode && (
            <p className="text-red-500 text-sm mt-1">
              {errors.postalCode.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="country" className="block text-lg font-medium mb-1">
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
        className="m-auto h-10 w-40 md:w-60  hover:shadow-xl hover:translate-y-3 hover:translate-x-2 hover:shadow-orange-300 bg-agreen font-lucky items-center text-center justify-center rounded-3xl  flex shadow-amber-100 shadow-lg"
      >
        Pagar
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
        xmlns="http://www.w3.org/2000/svg"
      >
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
