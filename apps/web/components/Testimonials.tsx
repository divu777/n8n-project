'use client'
import React, { useState, useEffect } from 'react';
import { Zap, Shield, Clock, TrendingUp, Users, Workflow } from 'lucide-react';

const AnimatedNumber = ({ targetNumber }: { targetNumber: number }) => {
  const [number, setNumber] = useState(targetNumber);

  useEffect(() => {
    const interval = setInterval(() => {
      setNumber(prev => {
        const change = Math.floor(Math.random() * 1000) - 500;
        const newValue = prev + change;
        return Math.max(targetNumber - 50000, Math.min(targetNumber + 50000, newValue));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [targetNumber]);

  return (
    <span className="tabular-nums transition-all duration-500">
      {number.toLocaleString()}
    </span>
  );
};

const ActivityGraph = () => {
  const [activeBar, setActiveBar] = useState(0);
  const bars = [65, 45, 78, 90, 55, 70, 85, 60, 95, 80, 70, 88];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBar(prev => (prev + 1) % bars.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-end justify-between h-64 w-full gap-2">
      {bars.map((height, index) => (
        <div
          key={index}
          className="flex-1 bg-gradient-to-t from-red-500 to-red-400 rounded-t transition-all duration-700"
          style={{
            height: `${height}%`,
            opacity: index === activeBar ? 1 : 0.4,
            transform: index === activeBar ? 'scaleY(1.05)' : 'scaleY(1)',
          }}
        />
      ))}
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast Automation',
      description: 'Deploy workflows in seconds. Our intelligent engine processes tasks 10x faster than traditional solutions.'
    },
    {
      icon: Shield,
      title: 'Enterprise-Grade Security',
      description: 'Bank-level encryption and compliance. Your data is protected with SOC 2 Type II certification and end-to-end security.'
    },
    {
      icon: Clock,
      title: '24/7 Autonomous Operation',
      description: 'Never miss a beat. AI agents work around the clock, handling tasks while you sleep and scaling on demand.'
    },
    {
      icon: Users,
      title: 'Seamless Team Collaboration',
      description: 'Built for teams of all sizes. Real-time sync, role-based access, and unified workflows across departments.'
    }
  ];

  return (
    <div className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-black w-full min-h-screen flex items-center px-8 flex-col text-white py-20">
      <div className="flex items-end w-full max-w-7xl h-96 justify-start p-12 mb-8 border-l-2 border-red-500">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full">
            <TrendingUp className="w-4 h-4 text-red-400" strokeWidth={1.5} />
            <span className="text-sm font-light text-red-400 tracking-wide">Trusted by Industry Leaders</span>
          </div>
          <h2 className="text-6xl font-extralight leading-tight">
            Built for Scale.
            <br />
            <span className="text-gray-400">Designed for Speed.</span>
          </h2>
          <p className="text-lg text-gray-400 font-light max-w-2xl">
            Experience automation that adapts to your business. From startups to enterprises, our platform grows with you.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-start w-full max-w-7xl h-96 justify-center p-12 mb-8 bg-gradient-to-br from-red-500/5 to-transparent border border-gray-800 rounded-xl">
        <h1 className="text-8xl font-light mb-4">
          <AnimatedNumber targetNumber={8346223472374} /> hrs
        </h1>
        <h3 className="text-2xl text-gray-400 font-light">
          Saved across all workflows. No compromise.
        </h3>
        <p className="text-gray-500 font-light mt-4 max-w-2xl">
          Every second counts. Our automation has reclaimed millions of hours for teams worldwide, letting them focus on what truly matters.
        </p>
      </div>

      <div className="w-full max-w-7xl mb-8 p-12 bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800 rounded-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-3xl font-light mb-2">Real-Time Activity</h3>
            <p className="text-gray-400 font-light">Live workflow execution across all instances</p>
          </div>
          <div className="flex items-center space-x-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-light text-green-400">All Systems Operational</span>
          </div>
        </div>
        <ActivityGraph />
      </div>

      <div className="grid grid-cols-2 w-full max-w-7xl border border-gray-800 rounded-xl overflow-hidden">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className={`h-96 flex flex-col items-start justify-start p-12 bg-gradient-to-br from-gray-900/50 to-gray-800/30 hover:from-red-500/5 hover:to-red-500/0 transition-all duration-500 group
                ${index === 0 ? 'border-r border-b border-gray-800' : ''}
                ${index === 1 ? 'border-b border-gray-800' : ''}
                ${index === 2 ? 'border-r border-gray-800' : ''}
              `}
            >
              <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-all duration-300">
                <Icon className="w-6 h-6 text-red-400" strokeWidth={1.5} />
              </div>
              <h4 className="text-2xl font-light mb-4 group-hover:text-red-400 transition-colors duration-300">
                {feature.title}
              </h4>
              <p className="text-gray-400 font-light leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Features;
