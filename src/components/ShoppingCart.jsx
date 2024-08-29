import Image from 'next/image';

export default function ShoppingCart({
  view,
  setView,
  items,
  setItems,
  subTotal,
  setSub,
  setCount,
  setLocalStorage,
  navigatePayment,
}) {
  const handleRemoveProductToCart = (item) => {
    const currCart = items.slice();
    const indexToRemove = currCart.indexOf(item);

    if (indexToRemove !== -1) {
      currCart.splice(indexToRemove, 1);
    }

    setItems(currCart);

    setLocalStorage(currCart);

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

      setLocalStorage(currCart);

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
          <button
            className="font-lucky text-xl bg-dgreen p-3 rounded-full absolute end-3 bottom-3 hover:animate-wiggle-more hover:animate-infinite"
            onClick={navigatePayment}>
            Ir a pagar
          </button>
        </div>
      </div>
    </>
  );
}
