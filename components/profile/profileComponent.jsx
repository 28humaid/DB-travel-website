"use client";
import { useState, Suspense } from "react"; // Add Suspense import
import { useSession } from "next-auth/react";
import Navbar from "../common/navbar";
import Bookings from "./bookings";
import Refunds from "./refunds";
import { Loader2 } from "lucide-react";

const ProfileComponent = ({ session: propSession }) => {
  const [currentPage, setCurrentPage] = useState('bookings');
  const { data: clientSession, status } = useSession();

  // Align userObject with client session for consistency (server prop should match)
  const displaySession = clientSession || propSession;
  const currentUser = displaySession?.user;
  if (!currentUser) {
    return (
      <div className="flex flex-1 items-center justify-center mt-8">
        <p className="text-red-500">Error: User profile not found.</p>
      </div>
    );
  }

  // Early return for loading state, handled by Navbar
  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="text-gray-500 animate-pulse">Loading your profile...</p>
      </div>
    );
  }

  // Content loader fallback (for slow Bookings/Refunds)
  const ContentLoader = () => (
    <div className="flex flex-col items-center gap-4 mt-8">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <p className="text-gray-500 animate-pulse">Loading content...</p>
    </div>
  );

  return (
    <div>
      <Navbar 
        setCurrentPage={setCurrentPage} 
        currentPage={currentPage} 
        status={status}
        companyName={currentUser.name} 
      />
      <Suspense fallback={<ContentLoader />}>
        {currentPage === 'bookings' && <Bookings />}
        {currentPage === 'refunds' && <Refunds />}
      </Suspense>
    </div>
  );
};

export default ProfileComponent;