"use client";

import { useState, Suspense, use } from "react";
import { useSession } from "next-auth/react";
import Navbar from "../common/navbar";
import Bookings from "./bookings";
import Refunds from "./refunds";
import { Loader2 } from "lucide-react";
import { fetchBookings, fetchRefunds } from "@/utils/fetchData";

// ──────────────────────────────────────────────────────────────
// Proper persistent cache that NEVER resets on error/empty response
// ──────────────────────────────────────────────────────────────
const createPersistentCache = () => {
  const cache = {
    bookings: null,
    refunds: null,
  };

  return {
    getBookings: () => {
      if (!cache.bookings) {
        cache.bookings = fetchBookings().then(data => {
          // Always resolve — even if empty or null
          return data ?? [];
        }).catch(err => {
          // Preserve the rejected promise so React doesn't retry forever
          return Promise.reject(err);
        });
      }
      return cache.bookings;
    },
    getRefunds: () => {
      if (!cache.refunds) {
        cache.refunds = fetchRefunds().then(data => data ?? []).catch(err => {
          return Promise.reject(err);
        });
      }
      return cache.refunds;
    },
  };
};

const dataCache = createPersistentCache();

// ──────────────────────────────────────────────────────────────
// Custom hooks to read with proper error handling
// ──────────────────────────────────────────────────────────────
function useBookings() {
  return use(dataCache.getBookings());
}

function useRefunds() {
  return use(dataCache.getRefunds());
}

// ──────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────
const ProfileComponent = ({ session: propSession }) => {
  const [currentPage, setCurrentPage] = useState('bookings');
  const { data: clientSession, status } = useSession();

  const displaySession = clientSession || propSession;
  const currentUser = displaySession?.user;

  if (!currentUser) {
    return (
      <div className="flex flex-1 items-center justify-center mt-8">
        <p className="text-red-500">Error: User profile not found.</p>
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="text-gray-500 animate-pulse">Loading your profile...</p>
      </div>
    );
  }

  // These will suspend only once — no infinite loop even on empty/error
  const bookings = useBookings();
  const refunds = useRefunds();

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
        {currentPage === 'bookings' && <Bookings bookings={bookings} />}
        {currentPage === 'refunds' && <Refunds refunds={refunds} />}
      </Suspense>
    </div>
  );
};

export default ProfileComponent;