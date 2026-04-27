"use client";
import React from "react";
import { motion } from "motion/react";

export interface TestimonialItem {
  text: string;
  image: string;
  name: string;
  role: string;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: TestimonialItem[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div
                  className="p-8 lg:p-10 rounded-none border border-noir-mid/60 hover:border-gold/30 transition-colors duration-700 max-w-xs w-full bg-noir-light/80 backdrop-blur-sm group"
                  key={`${index}-${i}`}
                >
                  {/* Gold quote mark */}
                  <div className="font-serif text-6xl text-gold/10 leading-none mb-4 select-none group-hover:text-gold/20 transition-colors duration-500">
                    &ldquo;
                  </div>

                  {/* Testimonial text */}
                  <p className="font-sans text-sm text-warm-gray/70 leading-relaxed mb-8">
                    {text}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 border-t border-noir-mid/40 pt-5">
                    <div className="h-10 w-10 rounded-full border border-gold/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img
                        width={40}
                        height={40}
                        src={image}
                        alt={name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="font-serif text-sm font-bold text-cream tracking-tight leading-5">
                        {name}
                      </div>
                      <div className="font-sans text-[10px] tracking-[0.15em] uppercase text-gold/50 leading-5">
                        {role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
