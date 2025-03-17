import React, {useState} from "react";
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
      enabled: !!address,
    });

  const {data: nativeBalance} = useBalance({
    address,
    enabled: !!address,
  });

  const formattedContractBalance = contractBalance ? Number(formatEther(contractBalance as bigint)).toFixed(4) : '0';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={`bg-red-600 hover:bg-red-700 ${className}`}>
          Deposit ETH
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black border-2 border-red-600 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Deposit ETH</DialogTitle>
          <DialogDescription className="text-gray-400">
            Deposit ETH to participate in prediction markets
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {nativeBalance && (
            <p className="text-sm text-gray-400">
              Wallet Balance: {Number(nativeBalance.formatted).toFixed(4)} ETH
            </p>
          )}
          <p className="text-sm text-gray-400">
            Contract Balance: {formattedContractBalance} ETH
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Balance;
