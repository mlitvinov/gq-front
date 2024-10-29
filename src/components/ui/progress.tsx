"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const themes = {
  light: {
    bg: "bg-white/15",
    indicator: "bg-white/50",
  },
  dark: {
    bg: "bg-[#F6F6F6]",
    indicator: "bg-[#ECC6CD]",
  },
};

type ProgressProps = React.ComponentPropsWithoutRef<
  typeof ProgressPrimitive.Root
> & {
  max?: number;
  theme?: "light" | "dark";
};

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, theme = "dark", max = 100, ...props }, ref) => {
  const percentage = ((value || 0) / max) * 100;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      max={max}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full",
        themes[theme].bg,
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "size-full flex-1 transition-all",
          themes[theme].indicator
        )}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
