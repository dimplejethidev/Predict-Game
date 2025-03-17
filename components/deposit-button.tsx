import {PREDICTION_MARKET_ADDRESS} from "@/constants";
import React, {useEffect, useState} from "react";
import {parseEther} from "viem";
import {useWaitForTransactionReceipt, useWriteContract} from "wagmi";
import PREDICTION_MARKET_ABI from "../lib/abi.json";
import {sepolia} from "viem/chains";
import {Button} from "./ui/button";

const DepositButton = ({
  amount,
  onError,
  onSuccess,
}: {
  amount: string;
  onSuccess: (success: any) => void;
  onError: (error: any) => void;
}) => {
  const [hash, setHash] = useState<any>("");
  const {writeContractAsync} = useWriteContract();
  const {data, isSuccess, isLoading, isError} = useWaitForTransactionReceipt({
    hash,
  });

  const depositHandler = async () => {
    try {
      // Convert ETH amount to wei
      const parsedAmount = parseEther(amount);
      
      const hash = await writeContractAsync({
        abi: PREDICTION_MARKET_ABI,
        functionName: "deposit",
        value: parsedAmount, // Send ETH with the transaction
        address: PREDICTION_MARKET_ADDRESS,
        chain: sepolia,
      });

      setHash(hash);
    } catch (error) {
      onError(error);
    }
  };

  useEffect(() => {
    if (isError) {
      onError(data);
    }
    if (isSuccess) {
      onSuccess(data);
    }
  }, [data, isSuccess, isError, onSuccess, onError]);

  return (
    <div className="w-full">
      <Button
        onClick={depositHandler}
        disabled={isLoading}
        className="px-4 py-2 w-full rounded disabled:opacity-50"
      >
        {isLoading ? "Depositing..." : "Deposit"}
      </Button>
    </div>
  );
};

export default DepositButton;
