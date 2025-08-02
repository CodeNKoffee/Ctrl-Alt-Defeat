"use client";

import { useState } from "react";
import SignupForm from "@/components/SignupForm";
import Blobs from "@/components/Blobs";
import Header from "@/components/Header";
import Copyright from "@/components/Copyright";
import { usersOptions } from "../../../../../constants/index";
import { useRouter, useParams } from "next/navigation";
import BackButton from "@/components/shared/BackButton";
import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';
import { motion, AnimatePresence } from "framer-motion";
import { MutatingDots } from 'react-loader-spinner';

export default function SignupPage() {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'en';
  const userType = "company";

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isNavigatingToLogin, setIsNavigatingToLogin] = useState(false);

  const getUserOption = (type) => {
    return usersOptions.find(option => option.value === type) || {};
  };

  const userOption = getUserOption(userType);

  const handleBackClick = () => {
    setIsLoading(true);
    
    // Show loader and navigate back after delay
    setTimeout(() => {
      router.back();
      // Note: The loader will disappear when the page unmounts
    }, 250);
  };

  const handleNavigateToLogin = () => {
    setIsNavigatingToLogin(true);
    
    // Show loader and navigate to login after delay
    setTimeout(() => {
      router.push(`/${locale}/auth/login?userType=${userType}`);
      // Note: The loader will disappear when the page unmounts
    }, 250);
  };

  return (
    <div className="min-h-screen flex flex-col kontainer relative overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Loading Screens */}
        {isLoading && (
          <motion.div
            key="back-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]"
          >
            <div className="flex flex-col items-center space-y-4">
              <MutatingDots
                height={120}
                width={120}
                color="#2A5F74"
                secondaryColor="#5DB2C7"
                radius={12}
                ariaLabel="mutating-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
              <p className="text-metallica-blue-950 font-semibold text-xl mt-4">{safeT('home.loading')}</p>
            </div>
          </motion.div>
        )}

        {isNavigatingToLogin && (
          <motion.div
            key="login-nav-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]"
          >
            <div className="flex flex-col items-center space-y-4">
              <MutatingDots
                height={120}
                width={120}
                color="#2A5F74"
                secondaryColor="#5DB2C7"
                radius={12}
                ariaLabel="mutating-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
              />
              <p className="text-metallica-blue-950 font-semibold text-xl mt-4">{safeT('home.loading')}</p>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        {!isLoading && !isNavigatingToLogin && (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-grow"
          >
            <BackButton onClick={handleBackClick} />
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
                      onClick={handleNavigateToLogin}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
