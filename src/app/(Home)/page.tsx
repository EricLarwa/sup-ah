{/* Navbar Component */}
import Image from 'next/image';

import Setting from '../Components/setting'; 
import Account from '../Components/account'; 
import Features from '../Components/features';
{/* Create Option Listing | Features, Logging, Settings, Account*/}
{/* Branding | Logo (media sm), Name(media lg) */}
{/* Drop-Down Menu for Features */}

export default function Navbar() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f5eddf]">
      <nav className="w-full bg-white  p-4 shadow-md border b border-black">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold">MyApp</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <Features />
            <Setting />
            <Account />
          </div>
        </div>
      </nav>
    </div>
  )}

