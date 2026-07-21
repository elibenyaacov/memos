import { cn } from "@/lib/utils";
import { memo, ReactNode } from "react";

interface DirectionWrapperProps {
  direction?: "LTR" | "RTL";
  children: ReactNode;
  className?: string;
}

const DirectionWrapper = memo(({ direction = "LTR", children, className }: DirectionWrapperProps) => {
  const isRTL = direction === "RTL";

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={cn(
        "transition-all",
        isRTL ? "text-right" : "text-left",
        className
      )}
      lang={isRTL ? "ar" : undefined}
    >
      {children}
    </div>
  );
});

DirectionWrapper.displayName = "DirectionWrapper";

export default DirectionWrapper;
