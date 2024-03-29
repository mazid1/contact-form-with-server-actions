import React from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographySmallVariants = cva("text-sm font-light leading-none", {
  variants: {
    variant: {
      default: "text-primary",
      destructive: "text-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface TypographySmallProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof typographySmallVariants> {}

export const TypographySmall = React.forwardRef<
  HTMLSpanElement,
  TypographySmallProps
>(function TypographySmall({ className, variant, ...props }, ref) {
  return (
    <small
      className={cn(typographySmallVariants({ variant, className }))}
      ref={ref}
      {...props}
    />
  );
});
