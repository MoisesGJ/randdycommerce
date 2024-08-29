import { ClerkProvider } from '@clerk/nextjs';

import {
  Montserrat_Alternates,
  Luckiest_Guy,
  Rammetto_One,
} from 'next/font/google';

import './globals.css';

const montserrat = Montserrat_Alternates({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-mont',
});
const luckiest = Luckiest_Guy({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-lucky',
});
const rammetto = Rammetto_One({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-ram',
});

export const metadata = {
  metadataBase: new URL('https://shopping.randomlandia.com/'),
  title: 'Randdy | Ecommerce',
  description: 'El ecommerce de Ranndy para ayudar a los desarrolladores.',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${luckiest.variable} ${rammetto.variable} font-mont text-slate-900`}
      suppressHydrationWarning={true}>
      <ClerkProvider>
        <body>{children}</body>
      </ClerkProvider>
    </html>
  );
}
