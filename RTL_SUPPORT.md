# RTL (Right-to-Left) Support for Memos

> Add RTL text direction support to your notes. Perfect for Arabic, Hebrew, Persian, and other RTL languages.

## 🎯 Overview

This feature adds per-note text direction support (LTR/RTL) to Memos. Each note can now have its own direction setting, with automatic text alignment, padding adjustments, and proper HTML direction attributes.

## ✨ Features

✅ **Per-Note Direction** - Set LTR or RTL for each memo independently  
✅ **Persistent Storage** - Direction preference is saved with the memo  
✅ **Auto-Alignment** - Text, lists, and blockquotes align automatically  
✅ **Easy Toggle** - Simple button UI or dropdown to switch direction  
✅ **Code Support** - Code blocks stay LTR even in RTL memos  
✅ **Type Safe** - Full TypeScript support  
✅ **Accessible** - Keyboard navigable, ARIA labels, screen reader friendly  
✅ **Backward Compatible** - Existing memos default to LTR  
✅ **Browser Support** - Works on all modern browsers  

## 📦 What's Included

### Backend
- **Proto Definitions**: `Direction` enum in `proto/api/v1/memo_service.proto`
- **Go Models**: Direction type in `store/memo.go`
- **Database Layer**: SQLite implementation in `store/db/sqlite/memo.go`
- **Storage**: Direction stored in memo's JSON payload

### Frontend
- **Components**:
  - `DirectionToggle` - Button group or select dropdown
  - `DirectionWrapper` - Wraps content with direction context
  - `MemoContentDisplay` - Renders memo with direction
  - `MemoEditorHeader` - Editor header with direction toggle
  
- **Utilities**:
  - Direction conversion functions
  - Style helpers
  - CSS classes
  
- **Styling**:
  - RTL-specific CSS
  - LTR-specific CSS
  - Code block exceptions

### Documentation
- `RTL_QUICK_START.md` - Quick start guide for users and developers
- `RTL_IMPLEMENTATION.md` - Feature overview and usage
- `RTL_ARCHITECTURE.md` - Deep technical documentation
- `RTL_EXAMPLE.md` - Example component showing all features

## 🚀 Quick Start

### For Users

1. Create or edit a memo
2. Look for the direction toggle (arrows: → ←) in the editor header
3. Click to switch between LTR and RTL
4. Save the memo - direction is preserved

### For Developers

#### Using the Direction Toggle

```tsx
import DirectionToggle from "@/components/DirectionToggle";
import { useState } from "react";

function MyEditor() {
  const [direction, setDirection] = useState<"LTR" | "RTL">("LTR");

  return (
    <DirectionToggle
      value={direction}
      onChange={setDirection}
      variant="button"
    />
  );
}
```

#### Wrapping Content

```tsx
import DirectionWrapper from "@/components/DirectionWrapper";

function MemoView({ memo }) {
  return (
    <DirectionWrapper direction={memo.direction || "LTR"}>
      <div className="prose">{memo.content}</div>
    </DirectionWrapper>
  );
}
```

#### In Your Editor

```tsx
import MemoEditorHeader from "@/components/MemoEditorHeader";

function MemoEditor({ memo, onUpdate }) {
  return (
    <>
      <MemoEditorHeader
        direction={memo.direction}
        onDirectionChange={(direction) => 
          onUpdate({ ...memo, direction })
        }
        title="Edit Note"
      />
      {/* Your editor content */}
    </>
  );
}
```

## 📁 File Structure

```
project-root/
├── proto/
│   ├── api/v1/
│   │   └── memo_service.proto        # Direction enum + field
│   └── store/
│       └── memo.proto                 # Direction in payload
├── store/
│   ├── memo.go                        # Go model with Direction type
│   └── db/sqlite/
│       ├── memo.go                    # SQLite implementation
│       └── schema.sql                 # Database schema
├── web/src/
│   ├── components/
│   │   ├── DirectionToggle.tsx        # Toggle UI component
│   │   ├── DirectionWrapper.tsx       # Direction context wrapper
│   │   ├── MemoContentDisplay.tsx     # Content display
│   │   ├── MemoEditorHeader.tsx       # Editor header
│   │   └── RTLExample.tsx             # Example component
│   ├── utils/
│   │   └── direction.ts               # Helper functions
│   └── styles/
│       └── rtl.css                    # RTL/LTR specific styles
├── RTL_QUICK_START.md                 # User/dev quick start
├── RTL_IMPLEMENTATION.md              # Feature overview
├── RTL_ARCHITECTURE.md                # Technical details
└── RTL_SUPPORT.md                     # This file
```

## 🔧 Integration Guide

### Step 1: Add to Your Imports

```typescript
import DirectionToggle from "@/components/DirectionToggle";
import DirectionWrapper from "@/components/DirectionWrapper";
import { applyDirectionStyle } from "@/utils/direction";
```

### Step 2: Add to Your Memo State

```typescript
interface Memo {
  id: string;
  content: string;
  direction?: "LTR" | "RTL"; // Add this
  // ... other fields
}
```

### Step 3: Update API Calls

```typescript
const updateMemo = async (memo: Memo) => {
  const response = await apiClient.updateMemo({
    name: memo.id,
    content: memo.content,
    direction: memo.direction || "LTR", // Include this
    updateMask: ["content", "direction"],
  });
  return response;
};
```

### Step 4: Update Your UI

```tsx
function MemoComponent({ memo, onUpdate }) {
  return (
    <DirectionWrapper direction={memo.direction}>
      <div>
        <MemoEditorHeader
          direction={memo.direction}
          onDirectionChange={(dir) => onUpdate({ direction: dir })}
        />
        <div>{memo.content}</div>
      </div>
    </DirectionWrapper>
  );
}
```

## 🎨 Styling

### Default Behavior

The `DirectionWrapper` component automatically:
- Sets the HTML `dir` attribute
- Applies `text-align` (left/right)
- Sets language attribute for RTL

### Custom Styling

```css
/* Your custom RTL styles */
.my-custom-component[dir="rtl"] {
  border-right: 2px solid blue;
  padding-right: 1rem;
}

.my-custom-component[dir="ltr"] {
  border-left: 2px solid blue;
  padding-left: 1rem;
}
```

### Responsive Direction

```tsx
const getStyle = (direction: Direction) => ({
  marginLeft: direction === "RTL" ? "auto" : 0,
  marginRight: direction === "RTL" ? 0 : "auto",
});
```

## 🧪 Testing RTL

### Manual Testing

1. Create a new memo
2. Paste this Arabic text:
   ```
   السلام عليكم ورحمة الله وبركاته
   ```
3. Click the RTL button (← arrow)
4. Notice the text aligns to the right
5. Click LTR button to toggle back

### Test Cases

- [ ] Create memo with LTR direction
- [ ] Create memo with RTL direction
- [ ] Toggle direction in editor
- [ ] Direction persists after save
- [ ] Direction persists after refresh
- [ ] Lists align correctly for each direction
- [ ] Blockquotes have correct border placement
- [ ] Code blocks stay LTR
- [ ] Multiple memos can have different directions

## 📱 Browser Compatibility

| Browser | Version | Support |
|---------|---------|----------|
| Chrome  | 90+     | ✅ Yes   |
| Firefox | 88+     | ✅ Yes   |
| Safari  | 14+     | ✅ Yes   |
| Edge    | 90+     | ✅ Yes   |
| Mobile  | Modern  | ✅ Yes   |

RTL is a standard HTML5 feature with universal support.

## ♿ Accessibility

- ✅ Proper `dir` attributes for screen readers
- ✅ `lang` attribute set appropriately
- ✅ ARIA labels on toggle buttons
- ✅ Keyboard navigation support (Tab, Enter, Space)
- ✅ Tooltip hints on hover
- ✅ Semantic HTML structure

## 🔌 API Reference

### Proto Changes

```protobuf
enum Direction {
  DIRECTION_UNSPECIFIED = 0;  // Default (LTR)
  LTR = 1;                    // Left-to-Right
  RTL = 2;                    // Right-to-Left
}

message Memo {
  // ... existing fields ...
  Direction direction = 19;   // New field
}
```

### Component Props

#### DirectionToggle

```typescript
interface DirectionToggleProps {
  value?: "LTR" | "RTL";
  onChange?: (direction: "LTR" | "RTL") => void;
  className?: string;
  variant?: "button" | "select";
}
```

#### DirectionWrapper

```typescript
interface DirectionWrapperProps {
  direction?: "LTR" | "RTL";
  children: ReactNode;
  className?: string;
}
```

### Utility Functions

```typescript
// Convert proto enum to string
getDirectionString(direction?: Direction): "LTR" | "RTL"

// Convert string to proto enum
getDirectionEnum(direction: "LTR" | "RTL"): Direction

// Get CSS properties
applyDirectionStyle(direction: "LTR" | "RTL"): CSSProperties

// Get CSS class name
getDirectionClass(direction: "LTR" | "RTL"): string
```

## 📚 Documentation

- **[Quick Start](./RTL_QUICK_START.md)** - Get started in 5 minutes
- **[Implementation](./RTL_IMPLEMENTATION.md)** - Feature overview
- **[Architecture](./RTL_ARCHITECTURE.md)** - Technical deep dive
- **[Example Component](./web/src/components/RTLExample.tsx)** - Working examples

## 🐛 Troubleshooting

### Text doesn't align right for RTL

**Solution**: Ensure `DirectionWrapper` is applied:

```tsx
// ❌ Wrong
<div>{content}</div>

// ✅ Correct
<DirectionWrapper direction={memo.direction}>
  <div>{content}</div>
</DirectionWrapper>
```

### Direction not persisting

**Solution**: Make sure direction is included in API update:

```typescript
// ❌ Wrong
const response = await updateMemo({ content: "..." });

// ✅ Correct
const response = await updateMemo({ 
  content: "...",
  direction: "RTL"
});
```

### Code blocks showing RTL

**Solution**: This is handled automatically by `MemoContentDisplay` component. If custom code block styling needed:

```css
.my-code-block {
  direction: ltr;
  text-align: left;
}
```

## 🔮 Future Enhancements

1. **Auto-Detection** - Automatically detect language and set direction
2. **User Default** - Default direction preference in user settings
3. **Locale-based** - Read direction from user's locale
4. **Keyboard Shortcuts** - Ctrl+Alt+L/R for quick toggling
5. **Analytics** - Track RTL usage patterns
6. **Batch Operations** - Set direction for multiple memos
7. **Search/Filter** - Filter by direction (find all RTL memos)

## 📝 Changelog

### v1.0.0 (Initial Release)

- ✨ Per-note direction toggle (LTR/RTL)
- ✨ Auto-alignment and text direction
- ✨ Persistent storage in memo payload
- ✨ React components and utilities
- ✨ Comprehensive documentation
- ✨ Backward compatibility with existing memos

## 🤝 Contributing

To improve RTL support:

1. Test with actual RTL content (Arabic, Hebrew, Persian)
2. Check browser compatibility
3. Verify accessibility with screen readers
4. Test mobile devices
5. File issues or PRs on GitHub

## 📄 License

Same as Memos project (MIT License)

## 🙏 Thanks

RTL support enables Memos to be truly global. Thanks to everyone using Memos with RTL languages!

---

## 🎓 Learning Resources

- [HTML dir Attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir)
- [CSS Direction Property](https://developer.mozilla.org/en-US/docs/Web/CSS/direction)
- [ARIA: Directionality](https://www.w3.org/WAI/tutorials/bidi/)
- [RTL Considerations for Web](https://www.smashingmagazine.com/2015/09/css-for-rtl-websites-right-to-left-styling/)

---

**Happy writing in any language! 🌍**

For questions, issues, or feedback, please open an issue on GitHub or check the documentation links above.
