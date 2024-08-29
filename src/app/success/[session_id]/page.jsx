'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SuccessPage({ params }) {
  const router = useRouter();
  const { session_id } = params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session_id) {
      const verifyPayment = async () => {
        try {
          const response = await fetch('/api/verify_payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ session_id }),
          });

          const result = await response.json();

          if (result.success) {
            localStorage.removeItem('cart');
            setLoading(false);
            setTimeout(() => {
              router.push('/');
            }, 3000);
          } else {
            setError('Payment verification failed');
            setLoading(false);
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
          setError('Error verifying payment');
          setLoading(false);
        }
      };

      verifyPayment();
    }
  }, [session_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="bg-red-500 text-white p-4">Error: {error}</div>;
  }

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-green-500 text-white p-4 font-lucky">
      <h1 className="text-2xl">¡Pago exitoso!</h1>
      <p>Tu pago ha sido procesado con éxito.</p>

      <p>¡Revisa tu correo para acordar la entrega!</p>
    </div>
  );
}
