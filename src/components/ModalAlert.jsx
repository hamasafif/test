import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function ModalAlert({ show, type = "success", message, onClose }) {
  const { theme } = useTheme();

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`p-6 rounded-2xl shadow-2xl w-[90%] max-w-sm text-center ${
              theme === "dark" ? "bg-darkCard text-neonGreen" : "bg-white text-gray-800"
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {/* ICON */}
            <div className="flex flex-col items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${colors[type]} text-white text-2xl`}
              >
                {type === "success" && "✅"}
                {type === "error" && "❌"}
                {type === "warning" && "⚠️"}
                {type === "info" && "ℹ️"}
              </div>

              {/* MESSAGE */}
              <p className="text-lg font-semibold mt-2">{message}</p>

              {/* BUTTON */}
              <button
                onClick={onClose}
                className={`mt-4 px-6 py-2 rounded-lg font-semibold transition ${
                  theme === "dark"
                    ? "bg-neonGreen/20 hover:bg-neonGreen/40 text-neonGreen"
                    : "bg-green-100 hover:bg-green-200 text-green-700"
                }`}
              >
                OK
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
