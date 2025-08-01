"use client";

import SignupForm from "@/components/SignupForm";
import Blobs from "@/components/Blobs";
import Header from "@/components/Header";
import Copyright from "@/components/Copyright";
import { usersOptions } from "../../../../../constants/index";
import { useRouter, useParams } from "next/navigation";
import BackButton from "@/components/shared/BackButton";
import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';

export default function SignupPage() {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'en';
  const userType = "company";

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
            <Header text={safeT('signup.title')} size="text-6xl" />
          </div>

          {/* Form Section */}
          <div className="w-full">
            <SignupForm userType={userType} />
          </div>

          {/* Login Navigation */}
          <div className="text-center mt-8 rtl:text-right ltr:text-left">
            <span className="text-black font-medium font-ibm-plex-sans">
              {safeT('signup.alreadyHaveAccount')}{" "}
              <button
                onClick={() => router.push(`/${locale}/auth/login?userType=${userType}`)}
                className="text-metallica-blue-off-charts underline"
              >
                {safeT('signup.login')}
              </button>
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
