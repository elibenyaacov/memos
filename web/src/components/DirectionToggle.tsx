import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/utils/i18n";

export type Direction = "LTR" | "RTL";

interface DirectionToggleProps {
  value?: Direction;
  onChange?: (direction: Direction) => void;
  className?: string;
  variant?: "button" | "select";
}

const DirectionToggle = ({
  value = "LTR",
  onChange,
  className,
  variant = "button",
}: DirectionToggleProps) => {
  const t = useTranslate();
  const [direction, setDirection] = useState<Direction>(value);

  useEffect(() => {
    setDirection(value);
  }, [value]);

  const handleChange = (newDirection: Direction) => {
    setDirection(newDirection);
    onChange?.(newDirection);
  };

  if (variant === "select") {
    return (
      <Select value={direction} onValueChange={handleChange as (value: string) => void}>
        <SelectTrigger className={cn("w-[120px]", className)}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="LTR">
            <span className="flex items-center gap-2">
              <ArrowRightIcon className="h-4 w-4" />
              LTR
            </span>
          </SelectItem>
          <SelectItem value="RTL">
            <span className="flex items-center gap-2">
              <ArrowLeftIcon className="h-4 w-4" />
              RTL
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className={cn("flex items-center gap-1 rounded-md border border-border bg-background p-1", className)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant={direction === "LTR" ? "default" : "ghost"}
            onClick={() => handleChange("LTR")}
            className="h-8 w-8"
          >
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Left to Right</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant={direction === "RTL" ? "default" : "ghost"}
            onClick={() => handleChange("RTL")}
            className="h-8 w-8"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Right to Left</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default DirectionToggle;
