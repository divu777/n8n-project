import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <section className="relative min-h-screen flex items-center">
        <div className="relative z-10 max-w-7xl px-12 py-40 flex flex-col justify-center ml-20">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full mb-10 shadow-sm">
              <Sparkles className="w-5 h-5 text-red-500" strokeWidth={1.5} />
              <span className="text-sm font-light text-gray-700 tracking-wide">
                AI-Powered Workflow Automation
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-8xl md:text-7xl font-extralight text-gray-900 mb-8 leading-[1.1] tracking-tight">
              Automate Everything.
              <br />
              <span className="font-light">Focus on What Matters.</span>
            </h1>

            {/* Subtext */}
            <p className="text-2xl md:text-xl text-gray-600 mb-16 font-light leading-relaxed max-w-3xl">
              Transform your business processes with intelligent automation.
              Deploy AI agents that work 24/7, eliminate repetitive tasks, and scale effortlessly.
            </p>

            {/* Buttons */}
            <div className="flex items-center space-x-6">
              <button className="group px-10 py-5 bg-red-500 text-white hover:bg-red-600 transition-all duration-300 flex items-center space-x-3 font-light rounded-sm shadow-lg hover:shadow-xl">
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
              </button>
              <button className="px-10 py-5 border border-gray-300 text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-light rounded-sm">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="mt-20 flex items-center space-x-16">
              <div className="border-l-2 border-gray-300 pl-6">
                <div className="text-4xl font-light text-gray-900">10M+</div>
                <div className="text-sm text-gray-500 font-light">Tasks Automated</div>
              </div>
              <div className="border-l-2 border-gray-300 pl-6">
                <div className="text-4xl font-light text-gray-900">99.9%</div>
                <div className="text-sm text-gray-500 font-light">Uptime</div>
              </div>
              <div className="border-l-2 border-gray-300 pl-6">
                <div className="text-4xl font-light text-gray-900">5000+</div>
                <div className="text-sm text-gray-500 font-light">Companies</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="relative max-w-7xl mx-auto px-8 pb-20">
        <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
          <img
            src="https://res.cloudinary.com/dwrqohfya/image/upload/v1760647760/Screenshot_2025-10-17_at_2.18.34_AM_zovc8n.png"
            alt="Workflow UI"
            className="w-full h-auto object-cover"
          />
        </div>
      </section>
    </div>
  );
};

export default Hero;
