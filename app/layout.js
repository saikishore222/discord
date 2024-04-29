"use client";

import React from "react";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import "./globals.css";
import { AuthContextProvider } from "./context/AuthContext";
import { auth } from './firebase';
import { useRouter } from 'next/navigation';
import Sidebar from "./components/Sidebar";
import { ToastContainer } from "react-toastify";

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body> 
        <AuthContextProvider>
        <div className="flex flex-col">
          <Navbar />
          <div className="flex flex-row mt-16 h-screen space-x-[16rem]">
            <Sidebar />
            <div className="flex-grow h-full ml-[16rem]">{children}</div>
          </div>
        </div>
        <ToastContainer/>
        </AuthContextProvider>
      </body>
    </html>
  );
};


export default RootLayout;
