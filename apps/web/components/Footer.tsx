"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const letters = "DIVAKAR".split("");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const navItems = [
    { name: "HOME", path: "/" },
    { name: "DASHBOARD", path: "/dashboard" },
    { name: "ABOUT ME", path: "/" },
  ];
  const socialLinks = [
    { name: "GitHub", icon: Github, href: "https://github.com/divu777" },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://www.linkedin.com/in/divakar-jaiswal/",
    },
    { name: "Twitter", icon: Twitter, href: "https://x.com/_chota_don_" },
  ];

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">
          {/* Left: Contact & Nav */}
          <div className="space-y-8">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-gray-400 text-lg mb-2"
              >
                For general queries
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
              >
                contact@divakar.com
              </motion.h2>
            </div>

            <nav className="space-y-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Link
                    href={item.path}
                    className="block font-semibold text-lg sm:text-xl text-gray-300 hover:text-red-500 transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </div>

          {/* Right: Animated Letters + Social */}
          <div className="flex flex-col justify-between">
            <div ref={ref} className="text-right overflow-hidden mb-8">
              <div className="flex justify-end items-center">
                {letters.map((letter, index) => (
                  <motion.span
                    key={index}
                    initial={{ y: "110%" }}
                    animate={isInView ? { y: 0 } : { y: "100%" }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.5,
                      ease: [0.6, 0.01, -0.05, 0.9],
                    }}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold inline-block text-white"
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </div>

            <div className="flex-grow" />

            <div className="flex flex-wrap justify-end gap-4 mt-8">
              {socialLinks.map((social, index) => (
                <motion.div
                  key={social.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Link
                    href={social.href}
                    className="group flex items-center space-x-2 border border-red-500 rounded-full px-6 py-3 text-base sm:text-lg font-semibold hover:bg-red-500 hover:text-white transition-all duration-300"
                    aria-label={`Visit our ${social.name} page`}
                  >
                    <social.icon className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 group-hover:text-white transition-colors duration-300" />
                    <span>{social.name.toUpperCase()}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500"
        >
          © {new Date().getFullYear()} Divakar. All rights reserved.
        </motion.div>
      </div>
    </footer>
  );
}
