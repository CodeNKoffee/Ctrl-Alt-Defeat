"use client";

import LoginForm from "@/components/LoginForm";
import Link from "next/link";
import Blobs from "@/components/Blobs";
import Header from "@/components/Header";
import Copyright from "@/components/Copyright";
import { useSearchParams } from "next/navigation";
import { usersOptions } from "../../../constants";

import { ToastContainer, toast } from 'react-toastify';
import { use, useEffect } from "react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const userType = searchParams.get("userType");

  // Get the user option details based on user type
  const getUserOption = (type) => {
    return usersOptions.find(option => option.value === type) || {};
  };


  const userOption = getUserOption(userType);

  useEffect( () => {notify()}, [])

  const notify = () => (
    toast.info('Please check your inbox, your application has been reviewed',{
      position: "top-right",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light", 
    }),
    
    toast.success('Someone has applied to one of your internship listings',{
      position: "top-right",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light", 
    }),

    toast.info('A new internship cycle is staring soon!',{
      position: "top-right",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light", 
    }),

    toast.info('Dear student your report status has been updated',{
      position: "top-right",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light", 
    }),

    toast.success('Your appointment has been accepted',{
      position: "top-right",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light", 
    }),

    toast.info('Incoming call',{
      position: "top-right",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light", 
    }),

    toast.info('Reminder: You have an upcoming workshop',{
      position: "top-right",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light", 
    }),

    toast.info('An attendee has sent a message',{
      position: "top-right",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light", 
    })
  );


  return (
    <div className="min-h-screen flex flex-col kontainer">
      <ToastContainer />
      {/* Main content */}
      <div className="flex-grow flex items-center justify-center py-8">
        <main className="w-full flex flex-col-reverse xl:flex-row items-center justify-center gap-4 xl:gap-16 px-4">
          <div className="w-full xl:w-2/5 flex flex-col-reverse xl:flex-col items-center">
            <div className="w-full max-w-[430px] px-4 xl:block hidden">
              <Blobs imageUrl={userOption.imageUrl} bgColor={userOption.bgColor} />
            </div>
            <div className="text-center mt-0 mb-16 xl:mb-0 xl:mt-8">
              <span className="text-black font-medium font-ibm-plex-sans">Not registered yet? <Link href={`/signup?userType=${userType}`} className="text-metallica-blue-off-charts underline">Sign up</Link></span>
            </div>
          </div>
          <div className="w-full xl:w-2/5 flex flex-col items-center mb-4 xl:mb-0">
            <div className="w-full max-w-md">
              {/* Header Section with Blobs */}
              <div className="flex flex-row items-start gap-8 mb-12 xl:hidden">
                <div className="w-24 h-24">
                  <Blobs
                    imageUrl={userOption.imageUrl}
                    bgColor={userOption.bgColor}
                    decreaseBorderThickness={true}
                  />
                </div>
                <Header
                  text={`Login`}
                  className="block xl:hidden"
                  size="text-6xl"
                />
              </div>
              <Header
                text={`Login`}
                className="hidden xl:block"
                size="text-6xl"
              />
              <LoginForm userType={userType} />
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