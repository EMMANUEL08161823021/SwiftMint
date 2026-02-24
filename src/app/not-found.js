'use client';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center text-center p-6 min-h-[calc(100vh)] bg-center bg-no-repeat bg-cover"
      style={{
        backgroundImage: "url('/background-transparent.jpg')",
      }}
    >
      {/* Logo */}
      <Link href={'/dashboard'}>
        <div className="absolute top-6 left-8 text-lg font-semibold flex items-center space-x-2">
          <img
            src="pivetra-logo.png"
            alt="Pivetra logo"
            className="h-[35px] w-[150px]"
          />
          <span className="font-bold text-sm mt-2 text-orange-700">
            Control Panel
          </span>
        </div>
      </Link>

      {/* 404 Section */}
      <div className="text-center flex flex-col justify-center items-center">
        <div className="flex items-center justify-center space-x-6 text-[8rem] font-extrabold">
          <span>4</span>
          <span className="text-7xl">&#x1F636;</span>
          <span>4</span>
        </div>
        <div className="flex flex-col items-center -mt-8 mb-6">
          <div className="w-32 h-2 bg-cyan-700 rounded-full mb-2"></div>
          <div className="w-32 h-2 bg-cyan-700 rounded-full mt-2"></div>
        </div>
        <p className="text-gray-700 max-w-xl mx-auto mb-8">
          The Page You’re Looking for Can’t be Found. It Looks Like You’re
          Trying to Access a Page That Either Has Been Deleted or Never
          Existed...
        </p>
        <Link
          href="/"
          className="bg-orange-700 hover:bg-orange-800 text-white flex font-semibold px-6 py-3 rounded-lg shadow-md transition"
        >
          <ArrowLeft className="text-white" /> Go To Dashboard
        </Link>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-10 text-[15px] text-gray-500">
        &copy; 2025 Pivetra. All rights reserved
      </footer>
    </div>
  );
}
