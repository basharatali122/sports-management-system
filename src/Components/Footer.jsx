import React from "react";
import { Facebook, Instagram, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t bg-gradient-to-b from-gray-50 to-white dark:from-gray-900/90 dark:to-gray-950 
                 py-10 text-gray-700 dark:text-gray-300 transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* --- Top Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          {/* --- Brand --- */}
          <div>
            <h2 className="text-3xl font-bold text-green-600 dark:text-green-500">
              VU-Sports-Society
            </h2>
            <p className="mt-3 text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-sm mx-auto md:mx-0">
              Elevating university sports.
            </p>
          </div>

          {/* --- Social Icons --- */}
          <div className="flex justify-center md:justify-center space-x-6">
            <a
              href="https://www.facebook.com/USTSportsSupportSociety"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-green-100 dark:bg-green-800/20 text-green-600 dark:text-green-400 
                         hover:bg-green-600 hover:text-white dark:hover:bg-green-500 transition-all duration-300"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://www.instagram.com/ust_sportssupportsociety/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-pink-100 dark:bg-pink-800/20 text-pink-500 dark:text-pink-400 
                         hover:bg-pink-500 hover:text-white dark:hover:bg-pink-500 transition-all duration-300"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://twitter.com/UST_SSS"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-sky-100 dark:bg-sky-800/20 text-sky-500 dark:text-sky-400 
                         hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 transition-all duration-300"
            >
              <Twitter size={20} />
            </a>
            <a
              href="mailto:support@ustsports.edu"
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800/30 text-gray-600 dark:text-gray-400 
                         hover:bg-gray-700 hover:text-white transition-all duration-300"
            >
              <Mail size={20} />
            </a>
          </div>

          {/* --- Credits --- */}
          <div className="text-center md:text-right space-y-2">
            <p className="text-sm">
              © {currentYear}{" "}
              <span className="font-semibold text-green-600 dark:text-green-400">
                UST Sports Support Society
              </span>
              . All rights reserved.
            </p>
            <p className="text-xs md:text-sm">
              Designed & Developed by{" "}
              <span className="text-green-500 dark:text-green-400 font-medium hover:underline cursor-pointer">
                UST Sports IT Team
              </span>
            </p>
          </div>
        </div>

        {/* --- Divider --- */}
        <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-6 text-center text-xs text-gray-500 dark:text-gray-500">
          <p>Made with ❤️ by <span className="text-teal-200/90 transform capitalize font-serif">UST Sports IT Team</span> </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
