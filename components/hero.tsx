import React from "react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { usePrivy } from "@privy-io/react-auth";

const Hero = () => {
  const { login } = usePrivy();

  return (
    <div
      className="flex flex-1 w-screen items-center justify-center relative overflow-hidden bg-white"
      style={{
        background:
          "radial-gradient(circle, rgba(46,111,64,0.2) 0%, rgba(255,255,255,1) 100%)", // Light green to white gradient
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-44 h-44 bg-green-300 rounded-full opacity-30 filter blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-gray-900 w-[94%] m-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Swipe like Tinder, but make money. 💸💰
        </h1>
        <p className="text-lg text-center mb-8">
          Bet with your degen crypto friends & cash in on your predictions.
        </p>
        <Button className="bg-green-700 hover:bg-green-800 text-white" onClick={login}>
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Hero;
