import React from "react";
import {Button} from "./ui/button";
import {User} from "lucide-react";
import { House } from "lucide-react";
import  Profile  from "./profile";

const MenuBar = () => {
  return (
    <div className="absolute bottom-0 w-full flex flex-row justify-between gap-4 p-8 pt-4 bg-gray-100 border-t border-gray-300 rounded-t-lg shadow-md">
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="text-gray-800 "
    >
      <House className="w-8 h-8 text-gray-800" />
    </Button>
  
    <Button
      asChild
      variant="ghost"
      size="icon"
      className="text-gray-800 "
    >
      <Profile  />
    </Button>
  </div>
  
  );
};

export default MenuBar;
