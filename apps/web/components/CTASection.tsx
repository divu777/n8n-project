
import React from "react";

export default function CTASection() {
  return (
     <div className="w-full bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center py-20 px-8 gap-12">
      {/* Text Content */}
      <div className="max-w-6xl text-start">
        <h2 className="text-5xl md:text-7xl font-extralight leading-tight mb-4">
          Ready to transform how your enterprise uses{" "}
          <span className="font-light text-red-500">AI?</span>
        </h2>
        <p className="text-lg text-neutral-600 font-light mt-4 max-w-2xl">
          Join forward-thinking enterprises that trust{" "}
          <span className="font-semibold text-neutral-800">Zapier</span> for
          mission-critical workflows.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row w-full max-w-6xl gap-4">
        <button className="flex-1 bg-gradient-to-r from-[#ff4b2b] to-[#ff6200] text-white text-lg font-semibold py-5 h-48 rounded-md shadow-lg hover:opacity-90 transition-all duration-300">
          Start free with email →
        </button>
        <button className="flex-1 bg-gradient-to-r from-[#ff6200] to-[#ff4500] text-white text-lg font-semibold py-5 h-48 rounded-md shadow-lg hover:opacity-90 transition-all duration-300">
          Contact Sales →
        </button>
      </div>
    </div>
  );
}
