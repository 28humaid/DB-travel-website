"use client"

import { useEffect, useState } from "react";
import AboutComponent from "../about/aboutComponent";
import Navbar from "../common/navbar";
import HomeComponent from "../home/homeComponent";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function LandingPageComponenet() {
  const [currentPage, setCurrentPage] = useState('home');
    const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect if session exists AND user is really on "/"
    if (status === "authenticated" && pathname === "/") {
      router.replace("/profile");
    }
  }, [status, router, pathname]);

  if (status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center mt-8">
        <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="text-gray-500 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <Navbar setCurrentPage={setCurrentPage} currentPage={currentPage} status={status}/>
      {status === 'loading' ? (
        <div className="flex flex-1 items-center justify-center mt-8">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
            <p className="text-gray-500 animate-pulse">Loading...</p>
          </div>
        </div>
      ) : (
        <>
          {currentPage === 'home' && <HomeComponent />}
          {currentPage === 'about' && <AboutComponent />}
        </>
      )}
    </>
  );
}