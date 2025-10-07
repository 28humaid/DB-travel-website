"use client"
import { useState } from "react";
import Navbar from "../common/navbar";
import Bookings from "./bookings";
import Refunds from "./refunds"
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

const ProfileComponent = () => {
    const [currentPage, setCurrentPage] = useState('bookings');
        const { data: session, status } = useSession();
  return (
    <div>
      <Navbar setCurrentPage={setCurrentPage} currentPage={currentPage} status={status}/>
      {status === 'loading' ? (
        <div className="flex flex-1 items-center justify-center mt-8">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                    <p className="text-gray-500 animate-pulse">Loading...</p>
                  </div>
                </div>
      ):(
        <>
            {currentPage === 'bookings' && <Bookings/>}
            {currentPage === 'refunds' && <Refunds/>}
        </>
      )}
    </div>
  );
};

export default ProfileComponent;