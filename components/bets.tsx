import React, {useEffect, useMemo, useState} from "react";
import TinderCard from "react-tinder-card";
import BetCard from "./bet-card";
import {useAccount, useReadContract, useWriteContract} from "wagmi";
import PREDICTION_MARKET_ABI from "../lib/abi.json";
import {PREDICTION_MARKET_ADDRESS} from "@/constants";
import {parseEther} from "viem";
import Balance from "./balance";

interface Market {
  id: string;
  creator: string;
  totalYesAmount: string | number;
  totalNoAmount: string | number;
  isResolved: boolean;
  bettingEndTime: any;
  resolutionTime: any;
  imageUri: string;
  question: string;
  outcome: string;
}

function CardBets() {
  const [lastLocation, setLastLocation] = useState("");
  const [betAmount, setBetAmount] = useState(0.1);
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showLastLocation, setShowLastLocation] = useState(false);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [error, setError] = useState<string | null>(null);

  const {address} = useAccount();
  const {writeContractAsync} = useWriteContract();

  const {data: contractBalance} = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: "getBalance",
    account: address,
    query: {
      enabled: !!address
    }
  });

  const {data: rawActivePredictions, refetch: refetchActive} = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: "getActivePredictions",
    query: {
      enabled: true
    }
  });

  useEffect(() => {
    if (rawActivePredictions) {
      setMarkets(rawActivePredictions as Market[]);
    }
  }, [rawActivePredictions]);

  const childRefs = useMemo<any>(
    () =>
      Array(markets.length)
        .fill(0)
        .map((i) => React.createRef()),
    [markets.length]
  );

  const calculatePercentages = (totalYesAmount: any, totalNoAmount: any) => {
    const yesAmount = Number(totalYesAmount.toString());
    const noAmount = Number(totalNoAmount.toString());
    const totalAmount = yesAmount + noAmount;

    if (totalAmount === 0) {
      return {
        yesPercentage: 50,
        noPercentage: 50,
      };
    }

    const yesPercentage = (yesAmount / totalAmount) * 100;
    const noPercentage = (noAmount / totalAmount) * 100;

    return {
      yesPercentage,
      noPercentage,
    };
  };

  const placeBet = async (side: boolean, market: Market) => {
    if (!market) return;

    try {
      const betAmountInWei = parseEther(betAmount.toString());
      if (!contractBalance || betAmountInWei > (contractBalance as bigint)) {
        setError("Insufficient platform balance");
        setShowDepositDialog(true);
        return;
      }

      setError(null);
      await writeContractAsync({
        abi: PREDICTION_MARKET_ABI,
        functionName: "placeBet",
        args: [market.id, side, betAmountInWei, address],
        address: PREDICTION_MARKET_ADDRESS,
      });
      
      await refetchActive();
    } catch (e: any) {
      setError(e.message || "Failed to place bet");
    }
  };

  const swiped = async (direction: string, market: Market) => {
    setLastLocation(direction);
    setShowLastLocation(true);

    if (direction === "left" || direction === "right") {
      try {
        const betAmountInWei = parseEther(betAmount.toString());
        console.log('Contract Balance:', contractBalance);
        console.log('Bet Amount in Wei:', betAmountInWei);
        
        if (!contractBalance || betAmountInWei > (contractBalance as bigint)) {
          console.log('Setting insufficient balance error');
          setError("Insufficient platform balance");
          setShowDepositDialog(true);
          return;
        }

        setError(null);
        await writeContractAsync({
          abi: PREDICTION_MARKET_ABI,
          functionName: "placeBet",
          args: [market.id, direction === "right", betAmountInWei, address],
          address: PREDICTION_MARKET_ADDRESS,
        });
        
        await refetchActive();
        
        // Only show success message and move to next card if bet was successful
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          setCurrentIndex(prevIndex => prevIndex + 1);
          setBetAmount(0.1);
          setShowLastLocation(false);
        }, 1500);
      } catch (error) {
        console.log('Error caught:', error);
        setError(error instanceof Error ? error.message : "Failed to place bet");
      }
    } else {
      // For "up" swipe (pass), just move to next card
      setCurrentIndex(prevIndex => prevIndex + 1);
      setBetAmount(0.1);
      setShowLastLocation(false);
    }

    // Hide the lastLocation message after 5 seconds if not moving to next card
    setTimeout(() => {
      setShowLastLocation(false);
    }, 5000);
  };

  return (
    <div className="flex flex-wrap relative w-[90%] h-full m-auto">
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-lg z-50 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <p>{error}</p>
            <button 
              onClick={() => setError(null)}
              className="ml-2 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          {error === "Insufficient platform balance" && (
            <Balance 
              className="bg-white text-primary hover:bg-gray-100 text-sm py-1"
              onSuccess={() => {
                setError(null);
                setShowDepositDialog(false);
                refetchActive();
              }}
            />
          )}
        </div>
      )}

      {showSuccessMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg z-50">
          Bet placed successfully!
        </div>
      )}

      {markets.slice(currentIndex).map((market, index) => {
        const {yesPercentage, noPercentage} = calculatePercentages(
          market.totalYesAmount,
          market.totalNoAmount
        );

        return (
          <TinderCard
            ref={childRefs[index]}
            className="absolute top-0 left-0 w-full"
            key={market.id}
            onSwipe={(dir) => swiped(dir, market)}
          >
            <BetCard
              betAmountInput={betAmount}
              setBetAmountInput={setBetAmount}
              id={Number(market.id)}
              description={market.question}
              winPercentage={yesPercentage}
              losePercentage={noPercentage}
              imageUrl={market.imageUri}
              betTime={market.bettingEndTime}
              yesTotalAmount={Number(market.totalYesAmount.toString()) / 1e18}
              noTotalAmount={Number(market.totalNoAmount.toString()) / 1e18}
              onYesClick={async () => {
                if (childRefs[index]?.current) {
                  await childRefs[index].current.swipe("right");
                }
              }}
              onNoClick={async () => {
                if (childRefs[index]?.current) {
                  await childRefs[index].current.swipe("left");
                }
              }}
              onPassClick={async () => {
                if (childRefs[index]?.current) {
                  await childRefs[index].current.swipe("up");
                }
              }}
            />
          </TinderCard>
        );
      })}

      {lastLocation && !showSuccessMessage && showLastLocation && (
        <div className="absolute bottom-40 bg-slate-200 rounded-full px-4 py-2 text-black left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <h2 className="text-black">
            You bet {lastLocation === "right" ? "yes" : "no"}
          </h2>
        </div>
      )}

      {markets.length === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
          <h2 className="text-2xl">No active predictions available</h2>
          <p className="text-gray-400">Check back later for new predictions</p>
        </div>
      )}
    </div>
  );
}

export default CardBets;
