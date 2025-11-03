"use client";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/utils/functions/cn";
import { Framer } from "lucide-react";
import { useState } from "react";

export const FramerButton = () => {
  const [clicked, setClicked] = useState(false);

  return (
    <Button
      text="Login with Framer"
      variant="secondary"
      onClick={() => {
        setClicked(true);
        // signIn("framer", {
        //   callbackUrl: "/programs/framer",
        // });
      }}
      icon={<Framer className="size-4 fill-white text-white" />}
      className={cn(!clicked && "bg-blue-600 text-white hover:bg-blue-700")}
      loading={clicked}
    />
  );
};
