"use client"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import '@solana/wallet-adapter-react-ui/styles.css';
import { useEffect, useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { RecoilRoot } from "recoil";
import { useRouter } from "next/navigation";
import {Toaster} from "react-hot-toast"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    // const router = useRouter()

    const network = WalletAdapterNetwork.Mainnet

  //   useEffect(() => {
  //     // This code will only run on the client side
  //     const token = localStorage.getItem("token")

  //     console.log(token)

  //     if (!token) {
  //         router.push("/login");
  //     }
  // }, [router]);

    const wallets = useMemo(()=>[],[network])

    const endPoint = "https://solana-mainnet.g.alchemy.com/v2/MTvpBMXIb6K-Zhm9O1PQUyr2YeS0xAfL"
    const devnet = "https://api.devnet.solana.com"

  return (
    <ConnectionProvider endpoint={devnet}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
               <RecoilRoot>
                   {children}
               </RecoilRoot>
           </WalletModalProvider>
        </WalletProvider>
    </ConnectionProvider>
  );
}
