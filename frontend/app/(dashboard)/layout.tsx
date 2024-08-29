"use client"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import '@solana/wallet-adapter-react-ui/styles.css';
import { useEffect, useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { RecoilRoot } from "recoil";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const router = useRouter()

    const network = WalletAdapterNetwork.Mainnet

    useEffect(() => {
      async function main(){
        try{
          const token = localStorage.getItem("token")
        if (!token) {
          localStorage.clear()
          router.push("/login")
          return
        }
        const result = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/me`,{
          headers:{
            Authorization:JSON.parse(localStorage.getItem("token")||"")
          }
        })

        if (result.status===200) {
          toast.success(result.data.message)
          router.push("/")
        }
        }catch(error){
          if (axios.isAxiosError(error)) {
            // Handle Axios-specific errors
            if (error.response?.status === 400) {
              console.log("Bad Request:", error.response.data.message,error.response.data);
              localStorage.clear()
              toast.error(error.response.data.message,{style:{
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
              }},
              )
              router.push("/login")
            } else if (error.response?.status === 404) {
              console.log("Not Found:", error.response.data);
              localStorage.clear()
              toast.error(error.response.data.message,{style:{
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
              }},
              )
              router.push("/login")
            } else {
              localStorage.clear()
              router.push("/login")
              console.log("Unexpected error:", error.response?.data || error.message);
            }
          } else {
            localStorage.clear()
            router.push("/login")
            console.log("An unexpected error occurred:", error);
          }
        }
      }
      main()
  }, []);

    const wallets = useMemo(()=>[],[network])

    const endPoint = "https://solana-mainnet.g.alchemy.com/v2/MTvpBMXIb6K-Zhm9O1PQUyr2YeS0xAfL"
    const devnet = "https://api.devnet.solana.com"

  return (
    <ConnectionProvider endpoint={endPoint}>
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
