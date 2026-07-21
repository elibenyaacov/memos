import { useEffect, useState } from "react";
import DirectionToggle from "@/components/DirectionToggle";
import DirectionWrapper from "@/components/DirectionWrapper";
import MemoEditorHeader from "@/components/MemoEditorHeader";
import MemoContentDisplay from "@/components/MemoContentDisplay";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Example component showing RTL support in action
 * This demonstrates how to integrate direction support into your memo components
 */
export const RTLExample = () => {
  const [direction, setDirection] = useState<"LTR" | "RTL">("LTR");
  const [content, setContent] = useState(
    "Click the direction toggle above to see RTL in action. Try pasting Arabic or Hebrew text here."
  );
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      {/* Example 1: Direction Toggle */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Direction Toggle Examples</h3>
        <div className="flex gap-2">
          <DirectionToggle
            value={direction}
            onChange={setDirection}
            variant="button"
          />
          <DirectionToggle
            value={direction}
            onChange={setDirection}
            variant="select"
          />
        </div>
        <p className="text-xs text-muted-foreground">Current: {direction}</p>
      </div>

      {/* Example 2: Memo Editor Header */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Editor Header</h3>
        <MemoEditorHeader
          direction={direction}
          onDirectionChange={setDirection}
          title="Edit Note"
          className="rounded border"
        />
      </div>

      {/* Example 3: Direction Wrapper */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Direction Wrapper</h3>
        <DirectionWrapper
          direction={direction}
          className="rounded border border-border bg-muted p-3"
        >
          <p>This text automatically aligns based on direction:</p>
          <ul className="list-inside list-disc space-y-1 py-2">
            <li>Lists automatically indent</li>
            <li>Text alignment changes</li>
            <li>All children inherit direction</li>
          </ul>
        </DirectionWrapper>
      </div>

      {/* Example 4: Memo Content Display */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Memo Content Display</h3>
        <div className="rounded border border-border bg-muted p-3">
          <MemoContentDisplay
            content={`
              <h4>${direction} Content</h4>
              <p>${content}</p>
              <blockquote>This is a quote that respects the ${direction} direction</blockquote>
            `}
            direction={direction}
          />
        </div>
      </div>

      {/* Example 5: Editor Mode */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Editable Content</h3>
        <DirectionWrapper direction={direction} className="rounded border">
          {isEditing ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              dir={direction === "RTL" ? "rtl" : "ltr"}
              className={cn(
                "w-full rounded border border-border bg-background p-2 font-mono text-sm",
                direction === "RTL" ? "text-right" : "text-left"
              )}
              rows={4}
            />
          ) : (
            <p className="p-2">{content}</p>
          )}
        </DirectionWrapper>
        <Button
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          variant="outline"
        >
          {isEditing ? "Done" : "Edit"}
        </Button>
      </div>

      {/* Example 6: Real-world scenario */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Real-world Memo</h3>
        <div className="rounded border border-border p-3">
          <MemoEditorHeader
            direction={direction}
            onDirectionChange={setDirection}
            title="My Note"
          />
          <DirectionWrapper direction={direction} className="p-3">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p>Your memo content goes here with proper {direction} formatting.</p>
              <blockquote>
                Even blockquotes respect the direction setting.
              </blockquote>
              <code>Code remains LTR regardless of memo direction.</code>
            </div>
          </DirectionWrapper>
        </div>
      </div>

      {/* Info box */}
      <div className="rounded border border-amber-500/50 bg-amber-50 p-3 text-sm dark:bg-amber-950/20">
        <p className="font-semibold">Try this:</p>
        <ol className="list-inside list-decimal space-y-1 py-2 text-xs">
          <li>Paste Arabic, Hebrew, or Persian text in the editor</li>
          <li>Click the RTL toggle button</li>
          <li>Watch the text alignment change automatically</li>
          <li>Toggle back to LTR to see the difference</li>
        </ol>
      </div>
    </div>
  );
};

export default RTLExample;
