import React, { useState } from "react";
import Link from 'next/link';
import { UserAuth } from "../context/AuthContext";
import { addUserToFirestore } from "../firebase";
import { useMediaQuery } from '@react-hook/media-query';
import { FiMenu } from 'react-icons/fi'; // Assuming FiMenu is your hamburger icon
import Sidebar from "./Sidebar"; // Import the Sidebar component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaugh, faPalette, faImage, faFileAlt, faFont } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { user, googleSignIn, logOut } = UserAuth();
  const isMobile = useMediaQuery('(max-width: 767px)'); // Define the mobile breakpoint
  const [showMenu, setShowMenu] = useState(false); // State for toggling menu visibility
  const toggleSidebar = () => setShowMenu(!showMenu); 

  const items = [
    { label: 'Memes', href: '/Chat?type=Memes', icon: faLaugh },
    { label: 'Logos', href: '/Chat?type=Logos', icon: faPalette },
    { label: 'Images', href: '/Chat?type=Images', icon: faImage },
    { label: 'Resumes', href: '/Chat?type=Resumes', icon: faFileAlt },
    { label: 'Texts', href: '/Chat?type=Texts', icon: faFont },
];
  

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
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex flex-col sm:flex-row justify-between items-center py-4 px-6 bg-white shadow">
        <div className="flex mb-2 sm:mb-0 space-x-2">
          <img src="https://firebasestorage.googleapis.com/v0/b/data-bounty-9a821.appspot.com/o/WhatsApp%20Image%202024-02-20%20at%204.27.58%20PM.jpeg?alt=media&token=14bd86c5-9492-411c-bdf3-ed5d4798c617" width={35} height={35} alt="Logo" />
          <Link href="/" passHref>
            <span className="text-2xl no-underline text-gray-900 hover:text-blue-700 font-bold">DataLabAi</span>
          </Link>
        </div>

        <div className="flex items-center">
          {isMobile && (
            <button className="text-md no-underline text-black hover:text-blue-700 ml-2 focus:outline-none" onClick={toggleSidebar}>
              <FiMenu size={24} />
            </button>
          )}
          {user ? (
            <div className={`flex items-center`}>
              <span className="text-md no-underline text-black hover:text-blue-700 ml-2 px-1">
                {formatDisplayName(user.displayName)}
              </span>
              <button onClick={handleSignOut} className="text-md no-underline text-black hover:text-blue-700 ml-2 px-4 py-2 bg-blue-500 rounded-md text-white focus:outline-none">
                Logout
              </button>
            </div>
          ) : (
            <button onClick={handleSignIn} className={`text-md no-underline text-black hover:text-blue-700 ml-2 px-4 py-2 bg-blue-500 rounded-md text-white focus:outline-none ${isMobile && !showMenu ? 'hidden' : 'block'}`}>
              Login With Google
            </button>
          )}
        </div>
      </nav>
      {isMobile && showMenu && 

<div className="w-72 bg-white h-full fixed shadow-md opacity-100 z-50" style={{ fontFamily: 'Arial, sans-serif',marginTop: '115px' }}>
<div className="flex flex-col p-4 space-y-2">
    {items.map((item, index) => (
        <Link key={index} href="/chat?type=[type]" as={item.href}>
        <div
            className='flex items-center p-3 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out'
            onClick={() => setShowMenu(false)} // Add onClick to set showMenu to false
        >
            <FontAwesomeIcon icon={item.icon} className="text-xl text-gray-600 mr-4" size="lg" />
            <span className="text-lg font-medium text-gray-900">{item.label}</span>
        </div>
    </Link>
    
    ))}
</div>
<div className="border-t border-gray-200"></div>
<div className="flex flex-col p-4 space-y-2">
    <span className="text-lg font-semibold text-gray-900">Private Channels</span>
    <div className='flex items-center p-3 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out'>
        <FontAwesomeIcon icon={faFileAlt} className="text-xl text-gray-600 mr-4" size="lg" />
        <Link href="/Chat?type=Private">
        <div
            className='flex items-center p-3 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out'
            onClick={() => setShowMenu(false)} // Add onClick to set showMenu to false
        >
            <span className="text-lg font-medium text-gray-900">My Channel</span>
            </div>
        </Link>
    </div>
</div>
</div>
      
      } 
    </>
  );
};

export default Navbar;
