import { Direction } from "@/types/proto/api/v1/memo_service_pb";

export const getDirectionString = (direction?: Direction | number): "LTR" | "RTL" => {
  if (direction === Direction.RTL) {
    return "RTL";
  }
  return "LTR";
};

export const getDirectionEnum = (direction: "LTR" | "RTL"): Direction => {
  if (direction === "RTL") {
    return Direction.RTL;
  }
  return Direction.LTR;
};

export const applyDirectionStyle = (
  direction: "LTR" | "RTL"
): React.CSSProperties => {
  return {
    direction: direction === "RTL" ? "rtl" : "ltr",
    textAlign: direction === "RTL" ? "right" : "left",
  };
};

export const getDirectionClass = (direction: "LTR" | "RTL"): string => {
  return direction === "RTL" ? "rtl-content" : "ltr-content";
};
