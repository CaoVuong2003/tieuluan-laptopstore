import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function showCustomToast(message, type = "info") {
  toast.custom((t) => <CustomToast t={t} message={message} type={type} />, {
    duration: 5000,
  });
}

function CustomToast({ t, message, type }) {
  const [progress, setProgress] = useState(100);

  // mapping type -> color
  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-yellow-500",
    info: "bg-blue-500",
  };

  const barColor = colors[type] || colors.info;

  useEffect(() => {
    let start = Date.now();
    let timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const percentage = Math.max(100 - (elapsed / 5000) * 100, 0);
      setProgress(percentage);
      if (percentage <= 0) {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {t.visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow-lg rounded-xl p-4 w-80 relative"
        >
          <p className="text-gray-800">{message}</p>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 rounded-b-xl overflow-hidden">
            <motion.div
              className={`h-full ${barColor}`}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 0.1 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
