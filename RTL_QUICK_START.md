# RTL Support Quick Start Guide

## What's New

Memos now supports Right-to-Left (RTL) text direction for individual notes. Perfect for Arabic, Hebrew, Persian, and other RTL languages.

## Quick Start

### For Users

1. **Create or edit a memo**
2. **Look for the direction toggle** in the memo editor header
   - Shows two arrow buttons: → (LTR) and ← (RTL)
3. **Click the direction you want**
   - The memo will immediately adjust its text alignment and direction
4. **Save the memo** - your direction preference is saved

### For Developers

#### Using Direction Toggle Component

```typescript
import DirectionToggle from "@/components/DirectionToggle";
import { useState } from "react";

function MyComponent() {
  const [direction, setDirection] = useState<"LTR" | "RTL">("LTR");

  return (
    <DirectionToggle
      value={direction}
      onChange={setDirection}
      variant="button" // or "select"
    />
  );
}
```

#### Wrapping Content with Direction

```typescript
import DirectionWrapper from "@/components/DirectionWrapper";

function MemoDisplay({ content, direction }) {
  return (
    <DirectionWrapper direction={direction}>
      <div>{content}</div>
    </DirectionWrapper>
  );
}
```

#### Using Direction Utilities

```typescript
import { getDirectionString, applyDirectionStyle } from "@/utils/direction";
import { Direction } from "@/types/proto/api/v1/memo_service_pb";

// Convert proto enum to string
const dir = getDirectionString(Direction.RTL); // "RTL"

// Get CSS properties
const style = applyDirectionStyle("RTL");
// Returns: { direction: "rtl", textAlign: "right" }
```

## File Structure

```
├── web/src/components/
│   ├── DirectionToggle.tsx        # Toggle component (button or select)
│   ├── DirectionWrapper.tsx       # Wrapper for direction context
│   ├── MemoContentDisplay.tsx     # Memo content with direction
│   └── MemoEditorHeader.tsx       # Editor header with toggle
├── web/src/utils/
│   └── direction.ts               # Direction utilities
├── web/src/styles/
│   └── rtl.css                    # RTL/LTR specific styles
├── proto/
│   ├── api/v1/memo_service.proto  # Direction enum
│   └── store/memo.proto           # Direction in payload
└── store/
    ├── memo.go                    # Go store model
    └── db/sqlite/memo.go          # SQLite implementation
```

## Key Features

✅ **Per-Memo Direction**: Each note can have its own LTR/RTL setting
✅ **Persistent Storage**: Direction preference is saved with the memo
✅ **Auto-Detection Ready**: Infrastructure for language-based direction detection
✅ **Code Block Support**: Code remains LTR even in RTL memos
✅ **Backward Compatible**: Existing memos default to LTR
✅ **Accessible UI**: Keyboard navigable, tooltip support
✅ **TypeScript Support**: Full type safety

## Integration Points

### 1. In Memo Editor

Add to your memo editor header:

```tsx
import MemoEditorHeader from "@/components/MemoEditorHeader";

<MemoEditorHeader
  direction={memo.direction}
  onDirectionChange={handleDirectionChange}
  title="Edit Note"
/>
```

### 2. In Memo View

Wrap memo content:

```tsx
import DirectionWrapper from "@/components/DirectionWrapper";

<DirectionWrapper direction={memo.direction}>
  <div className="prose">{renderedContent}</div>
</DirectionWrapper>
```

### 3. In API Calls

When creating/updating memos:

```typescript
const createMemoRequest: CreateMemoRequest = {
  memo: {
    content: "مرحبا بالعالم", // Arabic text
    visibility: Visibility.PRIVATE,
    direction: Direction.RTL,
  },
};
```

## Styling

### Auto-Applied Classes

When using `DirectionWrapper`, these classes are automatically applied:
- `.ltr-content` - for LTR direction
- `.rtl-content` - for RTL direction

Custom styling in `web/src/styles/rtl.css`:

```css
.rtl-content {
  direction: rtl;
  text-align: right;
}

.rtl-content ul,
.rtl-content ol {
  padding-right: 2rem; /* Flipped from padding-left */
}
```

## Testing RTL

1. Create a new memo
2. Click the RTL button (← arrow)
3. Type or paste RTL text (Arabic, Hebrew, etc.)
4. Notice:
   - Text aligns to the right
   - Lists indent to the right
   - Blockquotes have border on right
5. Click LTR button to toggle back
6. Save and refresh - direction persists

## Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

RTL is a standard HTML feature supported by all modern browsers.

## Accessibility

- Proper `dir` attribute on elements
- `lang` attribute set to appropriate language
- ARIA labels on toggle buttons
- Keyboard accessible (Tab, Enter, Space)
- Screen reader friendly

## Next Steps

1. **Auto-Detection**: Add language detection to auto-set direction
2. **User Settings**: Add default direction preference to user settings
3. **Keyboard Shortcuts**: Add Ctrl+Alt+L/R for quick toggling
4. **Locale Support**: Read direction from user's locale settings
5. **Analytics**: Track RTL usage patterns

## Support

For issues or questions about RTL support:
- Check `RTL_IMPLEMENTATION.md` for technical details
- Review component examples above
- File an issue on GitHub

---

**Happy writing in any language! 🌍**
