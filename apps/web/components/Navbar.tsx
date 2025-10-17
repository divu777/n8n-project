"use client";

import React from "react";
import { motion } from "framer-motion";

const navLinks = ["Home", "About", "Dashboard", "Pricing"];

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -25, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full bg-white/70 backdrop-blur-sm border-b border-gray-200 shadow-sm fixed top-0 left-0 z-50"
    >
      <div className=" mx-auto  h-20 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="text-2xl font-bold tracking-tight text-gray-900 px-8">
          N9N
        </div>

        {/* Center: Links */}
        <ul className="hidden md:flex items-center gap-8 text-gray-600 font-medium h-full">
          {navLinks.map((link) => (
            <motion.li
              key={link}
              className="relative flex items-center justify-center h-full px-6 cursor-pointer overflow-hidden"
            >
              {/* Tile flip effect */}
              <motion.div
                className="absolute inset-0 bg-red-500/10"
                initial={{ rotateX: -90, opacity: 0 }}
                whileHover={{ rotateX: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ transformOrigin: "bottom" }}
              />
              <span className="relative z-10">{link}</span>
            </motion.li>
          ))}
        </ul>

        {/* Right: Get Started */}
        <div className="ml-8 h-full flex items-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="h-full px-8 bg-red-500 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center"
          >
            Get Started →
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
