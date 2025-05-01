'use client';

import LoginForm from '@/components/LoginForm';
import Blobs from '@/components/Blobs';
import Copyright from '@/components/Copyright';
export default function LoginPage() {

  return (
    <div className="min-h-screen kontainer">
      {/* Animated Blobs */}
      <div className="row">
        <main className="w-full flex flex-col lg:flex-row items-center justify-center lg:justify-between">
          <div className=" w-full lg:w-1/2">
            <Blobs />
          </div>
          <div className="w-full lg:w-1/2">
            <LoginForm />
          </div>
        </main>
      </div>

      <Copyright />
    </div>
  );
}