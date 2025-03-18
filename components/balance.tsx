import React, {useState, useEffect} from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance,
  useReadContract,
} from "wagmi";
import {parseEther, formatEther} from "viem";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Alert, AlertDescription} from "@/components/ui/alert";
import {
  Loader2,
  ArrowRight,
  Check,
  AlertCircle,
} from "lucide-react";
import {PREDICTION_MARKET_ADDRESS} from "../constants/index";
import PREDICTION_MARKET_ABI from "../lib/abi.json";
import DepositButton from "./deposit-button";

interface DepositProps {
  className?: string;
  onSuccess?: () => void;
}

interface TransactionStatus {
  isSuccess: boolean;
  isError: boolean;
  error?: Error;
  message?: string;
}

const PRESET_AMOUNTS = [0.1, 0.5, 1];

export const Balance: React.FC<DepositProps> = ({className, onSuccess}) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [txStatus, setTxStatus] = useState<TransactionStatus>({
    isSuccess: false,
    isError: false,
  });

  const {address} = useAccount();

  const {data: contractBalance, refetch: refetchContractBalance} =
    useReadContract({
      address: PREDICTION_MARKET_ADDRESS,
      abi: PREDICTION_MARKET_ABI,
      functionName: "getBalance",
      account: address,
      query: {
        enabled: !!address
      }
    });

  const {data: nativeBalance} = useBalance({
    address,
    query: {
      enabled: !!address
    }
  });

  const {writeContract: withdraw} = useWriteContract();

  const {data: withdrawReceipt} = useWaitForTransactionReceipt({
    query: {
      enabled: !!withdraw,
    }
  });

  useEffect(() => {
    if (withdrawReceipt?.status === 'success') {
      setOpen(false);
      refetchContractBalance();
      setTxStatus({
        isError: false,
        isSuccess: true,
        message: "Withdrawal successful!"
      });
    }
  }, [withdrawReceipt?.status]);

  const formattedContractBalance = contractBalance ? Number(formatEther(contractBalance as bigint)).toFixed(4) : '0';

  const handleWithdraw = async () => {
    if (!amount || !contractBalance) return;
    
    try {
      const withdrawAmount = parseEther(amount);
      await withdraw({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: "withdraw",
        args: [withdrawAmount],
      });
    } catch (e: any) {
      setTxStatus({
        isError: true,
        isSuccess: false,
        message: e.message || "Withdrawal failed"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={`bg-primary hover:bg-primary/60 ${className}`}>
          Manage Balance
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black border-2 border-red-600 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Deposit/Withdraw ETH</DialogTitle>
          <DialogDescription className="text-gray-400">
            Manage your ETH balance for prediction markets
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {nativeBalance && (
            <p className="text-sm text-gray-400">
              Wallet Balance: {Number(nativeBalance.formatted).toFixed(4)} ETH
            </p>
          )}
          <p className="text-sm text-gray-400">
            Platform Balance: {formattedContractBalance} ETH
          </p>
          <div className="flex gap-2">
            {PRESET_AMOUNTS.map((presetAmount) => (
              <Button
                key={presetAmount}
                variant="outline"
                className={`flex-1 ${
                  selectedPreset === presetAmount
                    ? "bg-red-600 text-white"
                    : "text-white"
                }`}
                onClick={() => {
                  setAmount(presetAmount.toString());
                  setSelectedPreset(presetAmount);
                }}
              >
                {presetAmount} ETH
              </Button>
            ))}
          </div>

          <div className="relative">
            <Input
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setSelectedPreset(null);
              }}
              className="pl-3 bg-transparent text-white"
              placeholder="Enter ETH amount"
              step="0.1"
              min="0.1"
            />
          </div>

          {txStatus.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {txStatus.message || "Transaction failed"}
              </AlertDescription>
            </Alert>
          )}

          {txStatus.isSuccess && (
            <Alert className="bg-green-600">
              <Check className="h-4 w-4" />
              <AlertDescription>{txStatus.message}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <DepositButton
              amount={amount}
              onError={(e) => {
                console.log(e);
                setTxStatus({
                  isError: true,
                  isSuccess: false,
                  message: e.message || "Transaction failed"
                });
              }}
              onSuccess={(e) => {
                setOpen(false);
                refetchContractBalance();
                setTxStatus({
                  isError: false,
                  isSuccess: true,
                  message: "Deposit successful!"
                });
              }}
            />
            <Button 
              onClick={handleWithdraw}
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={!amount || Number(amount) > Number(formattedContractBalance)}
            >
              Withdraw
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Balance;
