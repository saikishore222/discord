"use client";

import React from "react";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import "./globals.css";
import { AuthContextProvider } from "./context/AuthContext";
import { auth } from './firebase';
import { useRouter } from 'next/navigation';
import Sidebar from "./components/Sidebar";

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body> 
        <AuthContextProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex flex-grow">
            <Sidebar />
            <div className="flex-grow h-full w-3/4 overflow-y-auto">{children}</div>
          </div>
        </div>
        </AuthContextProvider>
      </body>
    </html>
  );
};


export default RootLayout;
