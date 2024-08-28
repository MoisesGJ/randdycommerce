import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
        <SignUp
          routing="path"
          signInUrl="/sign-in"
          forceRedirectUrl="/"
          appearance={{
            variables: {
              colorPrimary: '#0070f3',
            },
          }}
        />
      </div>
    </div>
  );
}
