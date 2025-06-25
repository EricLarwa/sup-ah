import Link from "next/link";

import React from 'react';

export function GetStarted() {
  return (
    <Link href="/auth">
        <button className="text-4xl cursor-pointer bg-[#4CAF50] text-black font-semibold py-5 px-15 border-3 border-black rounded hover:bg-[#45a049] transition-colors hover:shadow-[4px_4px_0px_0px_rgba(0,0,1)] duration-300 ">
        Get Started
        </button>
    </Link>
  );
}