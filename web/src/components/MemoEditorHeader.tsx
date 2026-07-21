import { useCallback, useMemo } from "react";
import DirectionToggle, { type Direction } from "@/components/DirectionToggle";
import DirectionWrapper from "@/components/DirectionWrapper";
import { cn } from "@/lib/utils";

interface MemoEditorHeaderProps {
  direction?: Direction;
  onDirectionChange?: (direction: Direction) => void;
  className?: string;
  title?: string;
}

const MemoEditorHeader = ({
  direction = "LTR",
  onDirectionChange,
  className,
  title,
}: MemoEditorHeaderProps) => {
  const handleDirectionChange = useCallback(
    (newDirection: Direction) => {
      onDirectionChange?.(newDirection);
    },
    [onDirectionChange]
  );

  const isRTL = useMemo(() => direction === "RTL", [direction]);

  return (
    <DirectionWrapper direction={direction}>
      <div
        className={cn(
          "flex items-center justify-between gap-4 border-b border-border px-4 py-3",
          className
        )}
      >
        {title && (
          <h3
            className={cn(
              "text-lg font-semibold",
              isRTL ? "text-right" : "text-left"
            )}
          >
            {title}
          </h3>
        )}
        <div className={cn("flex items-center gap-2", !title && "ml-auto")}>
          <DirectionToggle
            value={direction}
            onChange={handleDirectionChange}
            variant="button"
          />
        </div>
      </div>
    </DirectionWrapper>
  );
};

export default MemoEditorHeader;
