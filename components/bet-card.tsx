import React, {useState} from "react";
import {motion} from "framer-motion";
import {Plus, Minus, TrendingUp, TrendingDown, Check, X} from "lucide-react";
import {Button} from "./ui/button";

interface BetCardProps {
  id: number;

  description: string;
  winPercentage: number;
  losePercentage: number;
  imageUrl: string;
  betTime: string;
  yesTotalAmount: number;
  noTotalAmount: number;
  onYesClick: () => void;
  onNoClick: () => void;
  onPassClick: () => void;
  betAmountInput: number;
  setBetAmountInput: (value: number) => void;
}

const BetCard: React.FC<BetCardProps> = ({
  description,
  winPercentage,
  losePercentage,
  imageUrl,
  betTime,
  yesTotalAmount,
  noTotalAmount,
  onYesClick,
  onNoClick,
  onPassClick,
  betAmountInput,
  setBetAmountInput,
}) => {
  const handleIncreaseBet = () => setBetAmountInput(betAmountInput + 1);
  const handleDecreaseBet = () => setBetAmountInput(betAmountInput - 1);

  return (
    <div className="w-full max-w-sm mx-auto h-[calc(100vh-10rem)] bg-white text-black rounded-xl shadow-lg overflow-hidden">
  <div className="relative h-1/2 w-full">
    <img src={imageUrl} className="w-full h-full object-cover" />
    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white to-transparent" />
    <div className="absolute bottom-4 left-4 flex items-center">
      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
        <TimestampDisplay timestamp={betTime.toString()} />
      </span>
    </div>
  </div>
  <div className="p-6 space-y-4">
    <p className="text-gray-600">{description}</p>
    <div className="flex justify-between">
      <div className="flex flex-col justify-center items-center">
        <div className="flex items-center">
          <TrendingDown className="text-red-500 mr-2" size={20} />
          <p className="text-red-500 text-center font-semibold">
            {losePercentage}%
          </p>
        </div>
        <span className="text-red-500">${noTotalAmount}</span>
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="flex items-center">
          <TrendingUp className="text-green-500 mr-2" size={20} />
          <p className="text-green-500 text-center font-semibold">
            {winPercentage}%
          </p>
        </div>
        <span className="text-green-500 text-center">
          ${yesTotalAmount}
        </span>
      </div>
    </div>
    <div className="flex items-center justify-between mt-4 bg-gray-200 rounded-lg overflow-hidden p-2">
      <button
        onClick={handleDecreaseBet}
        className="bg-red-500 p-2 text-white rounded-lg"
      >
        <Minus size={20} color="white" />
      </button>
      <div className="flex flex-row gap-0 bg-gray-200 rounded-lg overflow-hidden">
        <span className="text-black">$</span>
        <input
          type="number"
          value={betAmountInput}
          onChange={(e) =>
            setBetAmountInput(Math.max(1, parseInt(e.target.value) || 1))
          }
          className="w-16 text-center bg-gray-200 text-black"
        />
      </div>
      <button
        onClick={handleIncreaseBet}
        className="bg-blue-500 p-2 text-white rounded-lg"
      >
        <Plus size={20} color="white" />
      </button>
    </div>
    {/* <div className="flex justify-around mt-4">
      <Button
        variant={"outline"}
        className="rounded-full bg-red-500 text-white flex flex-row gap-1 hover:bg-red-400"
        onClick={onNoClick}
      >
        <X />
      </Button>
      <Button
        variant={"outline"}
        onClick={onPassClick}
        className="rounded-full bg-yellow-300  text-yellow-600 hover:bg-yellow-400 "
      >
        Pass
      </Button>
      <Button
        variant={"outline"}
        onClick={onYesClick}
        className="rounded-full bg-green-500 text-white flex flex-row gap-1 hover:bg-green-400"
      >
        <Check size={24} />
      </Button>
    </div> */}
  </div>
</div>
  );
};
const TimestampDisplay = ({timestamp}: {timestamp: string}) => {
  const date = new Date(parseInt(timestamp) * 1000);
  return (
    <span className="text-gray-700">
      {date.toLocaleDateString()} {date.toLocaleTimeString()}
    </span>
  );
};
export default BetCard;
