import React from "react";
import {Button} from "./ui/button";
import {User} from "lucide-react";
import { House } from "lucide-react";
import  Profile  from "./profile";

const MenuBar = () => {
  return (
    <div className="absolute bottom-0 w-full flex flex-row justify-between gap-4 p-8 pt-4 bg-white  border-t rounded-t-lg border-primary border-opacity-20">
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="text-primary hover:bg-primary hover:text-white p-1"
      >
        <House className="w-8 h-8 text-primary" />
      </Button>
     
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="text-primary "
      >
       <Profile  />
      </Button>
    </div>
  );
};

export default MenuBar;
