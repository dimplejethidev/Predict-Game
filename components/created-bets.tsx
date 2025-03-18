import { PREDICTION_MARKET_ADDRESS } from "@/constants";
import React, { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import PREDICTION_MARKET_ABI from "../lib/abi.json";
import Image from "next/image";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Clock, Trophy } from "lucide-react";
import { TimestampDisplay } from "./profile";

const CreatedBets = () => {
  const [userCreatedBets, setUserCreatedBets] = useState<any>();
  const { address } = useAccount();
  const { data: userBets, isError } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: "getUserCreatedPredictions",
    account: address,
    args: [address],
  });

  useEffect(() => {
    if (!isError) setUserCreatedBets(userBets);
  }, [userBets, isError]);

  return (
    <div className="grid grid-cols-2 gap-4">
      {userCreatedBets &&
        userCreatedBets?.map((bet: any) => (
          <CreatedBetCard key={bet.id} bet={bet} />
        ))}
    </div>
  );
};

const CreatedBetCard = ({ bet }: { bet: any }) => {
  return (
    <Card className="bg-white border border-[#2E6F40] shadow-sm rounded-lg overflow-hidden">
      <div className="relative w-full h-24">
        <Image
          src={bet.imageUri}
          alt={bet.name}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-[#2E6F40] bg-opacity-80 p-1">
          <CardTitle className="text-sm text-white truncate">
            {bet.question}
          </CardTitle>
        </div>
      </div>
      <CardContent className="p-2">
        <p className="text-xs text-gray-800 line-clamp-2">{bet.description}</p>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-1">
            <Trophy className="text-[#2E6F40]" size={14} />
            <span className="text-xs text-gray-700">
              Pool: ${" "}
              {(Number(bet.totalYesAmount.toString()) +
                Number(bet.totalNoAmount.toString())) /
                1e6}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-700 mt-1">
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <TimestampDisplay timestamp={bet.bettingEndTime.toString()} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatedBets;
