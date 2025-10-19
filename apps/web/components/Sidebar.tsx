"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Workflow, Settings, LogOut } from "lucide-react";
import { useSession } from "next-auth/react";

const Sidebar = () => {
  const {data} = useSession()

  const router = useRouter();
  const pathname = usePathname();
  if(!data || !data.user || !data.user.name){
    return
  }

  const menuItems = [
    { name: "Overview", path: "/dashboard", icon: Home },

  ];

  return (
    <motion.div
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-screen w-64 bg-gradient-to-b from-red-600 to-red-500 text-white flex flex-col justify-between p-6 shadow-lg"
    >
      {/* Top Section */}
      <div className="flex flex-col gap-8">
        {/* Logo */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-extrabold tracking-tight"
        >
          N9N
        </motion.h1>

        {/* Menu */}
        <nav className="flex flex-col gap-2 w-full">
          {menuItems.map(({ name, path, icon: Icon }, i) => {
            const active = pathname === path;
            return (
              <motion.button
                key={name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(path)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 ${
                  active
                    ? "bg-white/15 text-white font-medium"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {name}
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="border-t border-white/20 pt-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">
            D
          </div>
          <div>
            <p className="text-sm font-medium leading-tight">{(data.user.name).toUpperCase()}</p>
            <p className="text-xs text-white/70">Admin</p>
          </div>
        </div>
        <button className="text-white/70 hover:text-white">
          <LogOut size={18} />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;
