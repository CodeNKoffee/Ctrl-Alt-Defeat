"use client"
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import CallInterface from './CallInterface';
import CallNotification from './CallNotification';

const GlobalCallHandler = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const isInCall = useSelector((state) => state.call.isInCall);

  console.log(`[GlobalCallHandler] Rendering. User: ${currentUser?.id}, isInCall: ${isInCall}`);

  // Only show call components for SCAD admins and PRO students
  if (!currentUser || (
    currentUser.role !== 'scad' &&
    !(currentUser.role === 'student' && currentUser.accountType === 'PRO')
  )) {
    console.log("[GlobalCallHandler] User does not have permission or not logged in. Rendering null.");
    return null;
  }

  return (
    <>
      {isInCall && <CallInterface />}
      <CallNotification />
    </>
  );
};

export default GlobalCallHandler;