import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="h-screen flex flex-col gap-3.5 items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Inicia sesión</h1>
        <p>Puedes iniciar sesión con tu cuenta de randomlandia.com</p>
      </div>
      <SignIn
        routing="path"
        signUpUrl="/sign-up"
        forceRedirectUrl="/payment/"
        appearance={{
          variables: {
            colorPrimary: '#0070f3',
          },
        }}
      />
    </div>
  );
}
