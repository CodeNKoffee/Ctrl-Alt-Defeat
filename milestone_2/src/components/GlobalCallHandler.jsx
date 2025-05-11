"use client"
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import CallInterface from './CallInterface';
import CallNotification from './CallNotification';

const GlobalCallHandler = () => {
  const currentUser = useSelector((state) => state.auth.currentUser);
  
  // Only show call components for SCAD admins and PRO students
  if (!currentUser || (
    currentUser.role !== 'scad' && 
    !(currentUser.role === 'student' && currentUser.accountType === 'PRO')
  )) {
    return null;
  }
  
  return (
    <>
      <CallInterface />
      <CallNotification />
    </>
  );
};

export default GlobalCallHandler;