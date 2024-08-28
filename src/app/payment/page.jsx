'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useForm } from 'react-hook-form';

export default function HomePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return <div>Loading...</div>;
  }

  const handleOnSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="h-[100dvh] w-screen bg-dgreen flex flex-col items-center justify-end pt-20 pb-5 md:justify-center md:pb-0 md:pt-0 text-white">
      <div className="absolute top-2 start-0 w-screen flex justify-between px-3 md:px-12">
        <button
          className="hover:scale-110 hover:font-bold hover:text-lorange transition-colors duration-300"
          onClick={() => router.push('/')}>
          Regresar a comprar
        </button>
        <div className="flex justify-end items-center relative group/session">
          {user.hasImage && (
            <Image
              src={user.imageUrl}
              width={40}
              height={40}
              className="rounded-full me-2"
              alt={`Imagen de usuario de ${user.firstName}`}
            />
          )}
          <span>
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
      <main className="bg-oldwhite w-11/12 max-w-[900px] h-full md:h-[500px] rounded-2xl p-5 flex justify-center items-center">
        <Address
          displayName={user.fullName}
          onSubmit={handleOnSubmit}
        />
      </main>
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
            className={`w-full p-2 border rounded ${
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
            className={`w-full p-2 border rounded ${
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
            className={`w-full p-2 border rounded ${
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
            className={`w-full p-2 border rounded ${
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
            className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed font-bold"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-dgreen text-white px-4 py-2 rounded hover:bg-dgreen-dark transition-colors">
        Pagar
      </button>
    </form>
  );
}
