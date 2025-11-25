import { motion } from 'framer-motion';

export default function PageTransition({ children }) {
  return (
    // JANGAN pakai <div> biasa, tapi pakai <motion.div>
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      {children}
    </motion.div> // <--- Tutup juga dengan motion.div
  );
}