"use client";

import SignupForm from "@/components/SignupForm";
import Link from "next/link";
import Blobs from "@/components/Blobs";
import Header from "@/components/Header";
import Copyright from "@/components/Copyright";
import { usersOptions } from "../../../../../constants/index";
import { useSearchParams } from "next/navigation";
import BackButton from "@/components/shared/BackButton";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const userType = searchParams.get("userType");

  const getUserOption = (type) => {
    return usersOptions.find(option => option.value === type) || {};
  };

  const userOption = getUserOption(userType);

  return (
    <div className="min-h-screen flex flex-col kontainer">
      <BackButton />
      {/* Main content */}
      <div className="flex-grow flex items-center justify-center py-8">
        <main className="w-full max-w-4xl px-4">
          {/* Header Section with Blobs */}
          <div className="flex items-start gap-8 mb-12">
            <div className="w-24 h-24">
              <Blobs
                imageUrl={userOption.imageUrl}
                bgColor={userOption.bgColor}
                decreaseBorderThickness={true}
              />
            </div>
            <Header text="Sign up" size="text-6xl" />
          </div>

          {/* Form Section */}
          <div className="w-full">
            <SignupForm />
          </div>

          {/* Login Link */}
          <div className="text-center mt-8">
            <span className="text-black font-medium font-ibm-plex-sans">
              Already have an account? <Link href={`/login?userType=${userType}`} className="text-metallica-blue-off-charts underline">Login</Link>
            </span>
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
