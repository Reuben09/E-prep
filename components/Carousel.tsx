"use client";

import { motion } from "framer-motion";

const images = [
    "/img1.jpg",
    "/img2.jpg",
    "/img3.jpg",
    "/img4.jpg",
    "/img5.jpg"
];

const InfiniteCarousel = () => {
    return (
        <div className="relative w-full overflow-hidden">
            <motion.div
                className="flex space-x-4"
                initial={{ x: 0 }}
                animate={{ x: "-100%" }}
                transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 20, // Adjust for speed
                    ease: "linear",
                }}
            >
                {[...images, ...images].map((src, index) => (
                    <div key={index} className="w-fit h-fit flex-shrink-0 overflow-hidden relative py-2 ">
                        <img
                            src={src}
                            alt={`carousel-image-${index}`}
                            width={500}
                            height={300}
                            className="w-[500px] h-auto mb-2 object-cover border border-[#EEAD0E] shadow-lg rounded-2xl mx-[3px]"
                        />
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default InfiniteCarousel;
