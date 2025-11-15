import type { Metadata } from "next";
import { Geist, Geist_Mono,Inter,Noto_Serif_Myanmar,Murecho} from "next/font/google";
import { Ruda, Indie_Flower } from 'next/font/google';
import localFont from 'next/font/local'

const indie = Indie_Flower({
  subsets: ["latin"],
  variable: "--font-indie",
  weight: "400",
});

const ruda = Ruda({
  subsets: ["latin"],
  variable: "--font-ruda",
  weight: "400",
});
const murecho = Murecho({
  subsets:["latin"],
  variable:"--font-murecho",
  weight:'400'
}
)

const myFont = localFont({
  src:[
    {
      path:'../public/fonts/fontMyanmar.otf',
      weight:'400',
      style:'normal'
    }
  ],
  variable:'--font-myanmar'
})

import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rough Idea",
  description: "Create emotion idea",
};

const geistInter = Inter(
  {
    variable:"--font-inter"
  }
)

const geistNoto = Noto_Serif_Myanmar(
  {
    variable:'--font-noto',
    weight:'100'
  }
)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${geistInter} ${geistNoto} ${indie.variable} ${ruda.variable} ${myFont.variable} ${murecho.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
