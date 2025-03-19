import React from "react";
import MenuBar from "./menu-bar";
import Bets from "./bets";
import {CreatePrediction} from "./create-prediction";
import { usePrivy } from "@privy-io/react-auth";

const MainApp = () => {

  const {user,logout} = usePrivy();
  console.log(user);
  return (
    <div className="relative flex flex-col-1 flex-1 w-full h-full overflow-hidden">
      <div className="flex flex-1 w-full h-full">
        <Bets />
      </div>
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold my-6 text-primary w-[90%] m-auto">
          Markets
        </h1>
        {/* <button onClick={logout}>Logout</button> */}
        <Bets />
      </div>
      <MenuBar />
    </div>
  );
};

export default MainApp;
