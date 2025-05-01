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
      <div className="row flex-grow flex items-center">
        <main className="w-full flex flex-col xl:flex-row items-center xl:items-center justify-between min-h-[calc(100vh-80px)]">
          <div className="w-full xl:w-2/5 flex flex-col items-center justify-center space-y-8">
            <div className="w-full flex justify-center">
              <Blobs />
            </div>
            <div className="text-center">
              <span className="text-black font-medium font-ibm-plex-sans">Not registered yet? <Link href="/signup" className="text-metallica-blue-off-charts underline">Sign up</Link></span>
            </div>
          </div>
          <div className="w-full xl:w-2/5 relative z-10 flex flex-col items-center justify-center px-4 xl:px-8">
            <div className="w-full max-w-md">
              <Header text="Login" />
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