"use client";
import { useState } from "react"; // Añade esta línea
import { SignUp } from "@clerk/nextjs";
import Luz from "@/components/Luz";

export default function SignUpPage() {
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
        <div className="max-w-md w-full p-8 bg-transparent  rounded-lg">
          <SignUp
            routing="path"
            signInUrl="/sign-in"
            forceRedirectUrl="/"
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
