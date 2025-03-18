import React from "react";
import { Sixtyfour } from "next/font/google";
import { PlusIcon, User } from "lucide-react";
import { Button } from "./button";
import { usePrivy } from "@privy-io/react-auth";
import NewBet from "../new-bet";

export const sixtyfour = Sixtyfour({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});
const Header = () => {
   const {user,logout , authenticated} = usePrivy();
  return (
    <div className="flex flex-row items-center justify-between w-full p-4 border-b border-primary">
      <h2 className={`text-primary text-xl font-bold`}>Predict Game</h2>

   
    

      {authenticated && (
        <div className="flex flex-row gap-2 items-center">
             
            <button className="bg-primary text-light p-2 rounded-lg" onClick={logout}>Logout</button>
     
          <Button
            asChild
            variant={"outline"}
            size={"icon"}
            className="text-white"
          >
            <NewBet />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Header;
