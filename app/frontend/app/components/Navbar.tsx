'use client';

import { useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 w-full fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            LOGO
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden sm:flex flex-1 justify-center px-8">
            <div className="relative w-full max-w-md">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>

              <input
                type="text"
                placeholder="Search content..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 
                rounded-lg bg-gray-50 placeholder-gray-500 
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600">
              Contact
            </Link>
            <Link href="/content" className="text-gray-700 hover:text-blue-600">
              Content
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-100">
          <div className="px-4 py-3">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
          </div>

          <div className="space-y-1 pb-3">
            <Link href="/" className="block px-4 py-2 hover:bg-blue-50">
              Home
            </Link>
            <Link href="/contact" className="block px-4 py-2 hover:bg-blue-50">
              Contact
            </Link>
            <Link href="/content" className="block px-4 py-2 hover:bg-blue-50">
              Content
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
