"use client";

import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";

const buttonVariants = cva("focus-visible:ring-ring ring-offset-background inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-[#F6F6F6] text-black",
      outline: "border-input hover:bg-accent hover:text-accent-foreground border",
      secondary: "bg-[#FEEF9E] text-black hover:bg-[#FEEF9E]/60 font-light",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-lg px-3",
      lg: "h-11 rounded-lg px-8",
      icon: "size-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} disabled={props.isLoading || props.disabled} {...props}>
      {props.isLoading ? (
        <div className="animate-spin">
          <LoaderCircle className="size-4 text-black/25" />
        </div>
      ) : (
        props.children
      )}
    </Comp>
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
