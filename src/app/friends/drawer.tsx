import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function DrawerExample() {
  const [isOpen, setIsOpen] = React.useState(false);

  function handleClick() {
    setIsOpen(false);
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="secondary" className="w-full">
          Open example Drawer
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Example title</DrawerTitle>
            <DrawerDescription>Example description</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">Hello there!</div>
          <DrawerFooter>
            <Button
              onClick={handleClick}
              variant="secondary"
              className="w-full"
            >
              PROGRAMM FORCE CLOSE
            </Button>
            <Button variant="secondary" className="w-full">
              Example submit
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Example close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
