import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const interSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "First Place",
  description: "Gere e gerencie classificações de premiações esportivas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${interSans.variable} antialiased bg-gray-50`}>
        {children}
        <Toaster />

        {/* 
        
        ${c1}                             .:+o+/-.             
                                `:oyys+:`         
                                   .+syyyo-`      
                    .:///+oss+.      .oyyyys:     
                  -oyyyyyyyyyso`       /yyyyyo.   
                -oyyyyyyyyys+-          :yyyyys-  
             `-oyyyyyyyyyyo.             /yyyyyy- 
           `-oyyyyyyyyyyyys/`            `syyyyys`
          `oyyyyyyyyyyyyyyyys/`           /yyyyyy/
           `/syyyyys/oyyyyyyyys/`         -yyyyyys
             `/sys/`  -+yyyyyyyys/.       -yyyyyyy
               `-`      -+syyyyyyys/.     /yyyyyys
                          .+syyyyyyys+.  `syyyyyy/
                            .+syyyyyyys+-oyyyyyys`
        `-++-                 ./syyyyyyyyyyyyyys- 
      ./syyyso/.                `/syyyyyyyyyyys-  
    -+syyyyyyyyss+:.`            .:syyyyyyyyyy/   
 `:oyyyyyys+syyyyyyssso++/////+ossyyyyyyyyyyyyyo- 
:syyyyyyo-` `:oyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyys:
`/syys/.       `:+syyyyyyyyyyyyyyyyyys+:.:syyys/` 
  `/:`             .-/+oossyysso+/:-`      :o/`   

        */}
      </body>
    </html>
  );
}
