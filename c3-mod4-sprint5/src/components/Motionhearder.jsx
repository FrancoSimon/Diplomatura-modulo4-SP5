import { motion } from "framer-motion";

export const Motionhearder = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{
        opacity: 1,
        y: [0, -15, 0], // rebote más marcado
      }}
      transition={{
        opacity: { duration: 4 }, // entrada más lenta
        y: {
          duration: 5, // 👈 más largo (rebote lento)
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
          delay: 2, // arranca después de entrar
        },
      }}
      className="relative z-10 text-center px-4"
    >
      {children}
    </motion.div>
  );
};
