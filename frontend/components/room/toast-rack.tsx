"use client";

import { AnimatePresence, motion } from "framer-motion";

type ToastItem = {
  id: number;
  message: string;
};

type ToastRackProps = {
  items: ToastItem[];
};

export function ToastRack({ items }: ToastRackProps) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[70] flex max-w-sm flex-col gap-3">
      <AnimatePresence>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            className="glass-panel rounded-2xl px-4 py-3 text-sm shadow-panel"
          >
            {item.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
