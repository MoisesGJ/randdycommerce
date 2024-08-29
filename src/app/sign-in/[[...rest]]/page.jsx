"use client";
import { useState } from "react";
import { SignIn } from "@clerk/nextjs";
import Luz from "@/components/Luz";

export default function SignInPage() {
  const [animacionActiva, setAnimacionActiva] = useState(true);

  return (
    <div className="h-screen flex flex-col gap-3.5 items-center justify-center  bg-cover bg-left-bottom lg:bg-center  bg-no-repeat  bg-[url('/fondo.png')] ">
      <div>
        <Luz
          className="min-h-full relative overflow-hidden"
          active={animacionActiva}
        ></Luz>
      </div>
      <div className="absolute text-center flex  flex-col items-center justify-center z-50">
        <div className=" text-center pb-8 ">
          <h1 className="text-2xl font-bold mb-4">Inicia sesión</h1>
          <p>Puedes iniciar sesión con tu cuenta de randomlandia.com</p>
        </div>
        <div className="flex ">
          <SignIn
            routing="path"
            signUpUrl="/sign-up"
            forceRedirectUrl="/payment/"
            appearance={{
              variables: {
                colorPrimary: "#0070f3",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
