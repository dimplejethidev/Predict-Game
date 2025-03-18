import React, { useEffect, useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { formatEther } from "viem";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Balance from "@/components/balance";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { LogOut, User } from "lucide-react";
import { PREDICTION_MARKET_ADDRESS } from "@/constants";
import PREDICTION_MARKET_ABI from "../lib/abi.json";

import CreatedBets from "./created-bets";
import AllPlacedBets from "./all-placed-bets";
import { usePrivy } from "@privy-io/react-auth";

export const TimestampDisplay = ({ timestamp }: { timestamp: string }) => {
  const date = new Date(parseInt(timestamp) * 1000);
  return (
    <span className="text-gray-700">
      {date.toLocaleDateString()} {date.toLocaleTimeString()}
    </span>
  );
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState("placed");
  const [userBalance, setUserBalance] = useState<any>();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const { address } = useAccount();
  const { user, logout, authenticated } = usePrivy();

  const { data: contractBalance } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS,
    abi: PREDICTION_MARKET_ABI,
    functionName: "getBalance",
    account: address,
  });

  useEffect(() => {
    setUserBalance(contractBalance);
  }, [contractBalance]);

  const displayAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : "Not connected";

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="text-primary hover:bg-primary hover:text-white p-1"
          >
            <User className="w-8 h-8 text-primary" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-full h-full sm:max-w-md p-0 bg-light"
        >
          <SheetHeader className="text-primary p-4 flex justify-between mr-10">
            <SheetTitle className="text-xl font-bold text-primary">
              Betting Profile
            </SheetTitle>
            {authenticated ? (
              <LogOut
                className="text-primary cursor-pointer"
                onClick={() => setShowLogoutPopup(true)}
              />
            ) : null}
          </SheetHeader>

          <div className="p-4 overflow-y-auto max-h-[calc(100vh-60px)]">
            <Card className="mb-6 bg-light text-primary border-2 border-primary">
              <CardHeader></CardHeader>
              <CardContent>
                <p className="text-sm mb-2 ">Wallet: {displayAddress}</p>
                <p className="text-lg font-bold mb-4 text-primary flex justify-between items-center">
                  Platform Balance: <br />
                  {(userBalance && `${Number(formatEther(userBalance)).toFixed(2)} ETH`) || "0.00 ETH"}
                  <Balance />
                </p>
              </CardContent>
            </Card>

            <Tabs
              defaultValue={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-light mb-4">
                <TabsTrigger
                  value="placed"
                  className="text-primary data-[state=active]:bg-primary bg-gray-200 data-[state=active]:text-white"
                >
                  Bets Placed
                </TabsTrigger>
                <TabsTrigger
                  value="created"
                  className="text-primary data-[state=active]:bg-primary bg-gray-100 data-[state=active]:text-white"
                >
                  Bets Created
                </TabsTrigger>
              </TabsList>
              <TabsContent value="placed" className="h-auto max-h-[calc(100vh-400px)] overflow-y-auto">
                <AllPlacedBets />
              </TabsContent>
              <TabsContent value="created" className="h-auto max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
                <CreatedBets />
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>

      {/* Logout Confirmation Popup */}
      <Dialog open={showLogoutPopup} onOpenChange={setShowLogoutPopup}>
        <DialogContent className="p-6 text-center">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-primary">
              Confirm Logout
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-700">Are you sure you want to disconnect?</p>
          <DialogFooter className=" flex gap-2 justify-center">
            <Button
              className="bg-primary text-white hover:bg-gray-200"
              onClick={() => setShowLogoutPopup(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => {
                logout();
                setShowLogoutPopup(false);
              }}
            >
              Disconnect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Profile;
