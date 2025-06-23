// components/PopupLayout.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../style.css";

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const popupVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: "-10%",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: "0%",
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: "-10%",
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const PopupLayout = ({ show, onClose, children }) => {
  return (
    <AnimatePresence>
    {show && (
      <motion.div
        className="popup-backdrop"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <motion.div
          className="popup-content"
          variants={popupVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="popup-close-btn" onClick={onClose}>
            &times;
          </button>

          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
  );
};

export default PopupLayout;
