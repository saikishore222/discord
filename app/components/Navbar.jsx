"use client";

import React from "react";
import Link from 'next/link';
import { UserAuth } from "../context/AuthContext";
import { addUserToFirestore } from "../firebase";

const Navbar = () => {
  const { user, googleSignIn, logOut } = UserAuth();

  const formatDisplayName = (displayName) => {
    return displayName
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleSignIn = async () => {
    try {
      await googleSignIn();
      console.log("User signed in successfully.");
      addUserToFirestore(user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      console.log("User signed out successfully.");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex flex-col sm:flex-row justify-between items-center py-4 px-6 bg-white shadow">
      <div className="flex mb-2 sm:mb-0 space-x-2">
        <img src="https://firebasestorage.googleapis.com/v0/b/data-bounty-9a821.appspot.com/o/WhatsApp%20Image%202024-02-20%20at%204.27.58%20PM.jpeg?alt=media&token=14bd86c5-9492-411c-bdf3-ed5d4798c617" width={35} height={35} alt="Logo" />
        <Link href="/" passHref>
          <span className="text-2xl no-underline text-gray-900 hover:text-blue-700 font-bold">DataLabAi</span>
        </Link>
      </div>

      <div className="self-center">
        {user ? (
          <div className="flex items-center">
            <span className="text-md no-underline text-black hover:text-blue-700 ml-2 px-1">
              {formatDisplayName(user.displayName)}
            </span>
            <button onClick={handleSignOut} className="text-md no-underline text-black hover:text-blue-700 ml-2 px-4 py-2 bg-blue-500 rounded-md text-white focus:outline-none">
              Logout
            </button>
          </div>
        ) : (
          <button onClick={handleSignIn} className="text-md no-underline text-black hover:text-blue-700 ml-2 px-4 py-2 bg-blue-500 rounded-md text-white focus:outline-none">
            Login With Google
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
