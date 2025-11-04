import { useState } from "react";
import { motion } from "framer-motion"; 

export function MonkeyPasswordToggle() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder=""
        className="w-full px-4 py-3 sm:py-4 pr-14 rounded-xl border-0 focus:outline-none focus:ring-4 focus:ring-yellow-400 text-3xl font-semibold bg-gray-100"
        style={{
          fontFamily: "Kavoon, cursive",
          color: "#262A51",
        }}
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        <motion.div
          animate={{
            scale: showPassword ? 1.1 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          {showPassword ? <MonkeyEyesOpen /> : <MonkeyEyesClosed />}
        </motion.div>
      </button>
    </div>
  );
}