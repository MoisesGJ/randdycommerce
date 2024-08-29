'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CancelPage() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push('/');
    }, 3000);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-red-500 text-white">
      <div className="text-center font-lucky">
        <h1 className="text-3xl font-bold mb-4">Compra cancelada</h1>
        <p className="text-xl">Redireccionando al inicio...</p>
      </div>
    </div>
  );
}
