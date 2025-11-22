// app/(users)/profile/[slug]/not-found.jsx
"use client"
import Button from '@/components/common/button';
import { signOut } from 'next-auth/react';
import {useState} from 'react';

export default function NotFound() {
    const [isSigningOut, setIsSigningOut] = useState(false);

    const handleSignOut = async () => {
        setIsSigningOut(true);
        try {
        await signOut({ callbackUrl: '/' });
        // No need to reset state — user will be redirected
        } catch (error) {
        console.error('Sign out failed:', error);
        setIsSigningOut(false); // Re-enable button if something goes wrong
        }
    };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-red-100">
      <div className="text-center">
        {/* Big 404 */}
        <h1 className="text-6xl md:text-8xl font-bold text-gray-800 mb-6">404</h1>

        {/* Custom message */}
        <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-md mx-auto">
          Something went wrong...
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleSignOut}
            disabled={isSigningOut}
            loading={isSigningOut}
            loadingText="Signing you out..."
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-300 transition"
          >
            Sign Out
          </Button>
        </div>

        {/* Optional small footer */}
        {/* <p className="mt-12 text-sm text-gray-500">
          Signed in as <span className="font-medium">@{session?.user?.username}</span>
        </p> */}
      </div>
    </div>
  );
}