"use client";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const Content = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    return (
        <div className="max-w-[1700px] mx-auto px-4 md:px-10 pt-2 md:pt-4">
            <AnimatePresence mode="wait">
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(10px)" }}
                    transition={{ duration: 0.4, ease: "circOut" }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default Content;