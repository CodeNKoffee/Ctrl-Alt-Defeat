'use client';

import LoginForm from '@/components/LoginForm';
import Link from 'next/link';
import Blobs from '@/components/Blobs';
import Header from '@/components/Header';
import Copyright from '@/components/Copyright';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col kontainer">
      {/* Main content */}
      <div className="flex-grow flex items-center justify-center py-8">
        <main className="w-full flex flex-col-reverse xl:flex-row items-center justify-center gap-4 xl:gap-16 px-4">
          <div className="w-full xl:w-2/5 flex flex-col-reverse xl:flex-col items-center">
            <div className="w-full max-w-[430px] px-4 xl:block hidden">
              <Blobs />
            </div>
            <div className="text-center mt-0 mb-16 xl:mb-0 xl:mt-8">
              <span className="text-black font-medium font-ibm-plex-sans">Not registered yet? <Link href="/signup" className="text-metallica-blue-off-charts underline">Sign up</Link></span>
            </div>
          </div>
          <div className="w-full xl:w-2/5 flex flex-col items-center mb-4 xl:mb-0">
            <div className="w-full max-w-md">
              {/* Header Section with Blobs */}
              <div className="flex flex-row items-start gap-8 mb-12 xl:hidden">
                <div className="w-24 h-24">
                  <Blobs />
                </div>
                <Header 
                  text="Login" 
                  className="block xl:hidden" 
                />
              </div>
              <Header text="Login" className="hidden xl:block" />
              <LoginForm />
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer>
        <Copyright />
      </footer>
    </div>
  );
}