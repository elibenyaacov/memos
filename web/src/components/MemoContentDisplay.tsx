import { cn } from "@/lib/utils";
import { CSSProperties, memo } from "react";

interface MemoContentProps {
  content: string;
  direction?: "LTR" | "RTL";
  className?: string;
}

const MemoContent = memo(({ content, direction = "LTR", className }: MemoContentProps) => {
  const isRTL = direction === "RTL";

  const contentStyle: CSSProperties = {
    direction: isRTL ? "rtl" : "ltr",
    textAlign: isRTL ? "right" : "left",
  };

  return (
    <div
      className={cn("prose prose-sm max-w-none dark:prose-invert", className)}
      style={contentStyle}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Content will be rendered by the markdown parser */}
      <div
        dangerouslySetInnerHTML={{
          __html: content,
        }}
        className={isRTL ? "rtl-content" : "ltr-content"}
      />
    </div>
  );
});

MemoContent.displayName = "MemoContent";

export default MemoContent;
