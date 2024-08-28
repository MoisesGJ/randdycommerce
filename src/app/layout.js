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
  title: 'Randy | Ecommerce',
  description:
    'Este es un ecommerce para apoyar la creación de sandías en randomlandia.com.',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${montserrat.variable} ${luckiest.variable} ${rammetto.variable} font-mont text-slate-900`}
      suppressHydrationWarning={true}>
      <body>{children}</body>
    </html>
  );
}
