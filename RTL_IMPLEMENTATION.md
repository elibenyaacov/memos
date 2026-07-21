# RTL Support Implementation

This document describes the RTL (Right-to-Left) text direction support added to Memos.

## Overview

RTL support allows users to set text direction (LTR/RTL) for each note individually. This is useful for notes written in Arabic, Hebrew, Persian, and other RTL languages.

## Features

### Backend (Proto & Database)

1. **Proto Changes** (`proto/api/v1/memo_service.proto`)
   - Added `Direction` enum with values: `DIRECTION_UNSPECIFIED` (0), `LTR` (1), `RTL` (2)
   - Added `direction` field (field 19) to the `Memo` message

2. **Store Model** (`store/memo.go`)
   - Added `Direction` type with constants: `DirectionUnspecified`, `DirectionLTR`, `DirectionRTL`
   - Direction is stored in the memo's `Payload` as JSON

3. **Database**
   - Direction is persisted in the `memo.payload` JSON field
   - Default direction is LTR for backward compatibility

### Frontend (React Components)

1. **DirectionToggle Component** (`web/src/components/DirectionToggle.tsx`)
   - Button-based or select-based UI for toggling direction
   - Shows LTR (→) and RTL (←) icons
   - Emits `onChange` event when direction changes

2. **DirectionWrapper Component** (`web/src/components/DirectionWrapper.tsx`)
   - Wraps memo content with proper `dir` attribute
   - Automatically applies correct text alignment

3. **MemoContentDisplay Component** (`web/src/components/MemoContentDisplay.tsx`)
   - Renders memo content with direction-aware styling
   - Supports code blocks in LTR regardless of memo direction

4. **MemoEditorHeader Component** (`web/src/components/MemoEditorHeader.tsx`)
   - Displays direction toggle in memo editor header
   - Integrates with the editor UI

5. **Direction Utils** (`web/src/utils/direction.ts`)
   - Helper functions for direction conversion and styling
   - `getDirectionString()`: Convert proto enum to "LTR"/"RTL"
   - `getDirectionEnum()`: Convert "LTR"/"RTL" to proto enum
   - `applyDirectionStyle()`: Get CSS properties for direction
   - `getDirectionClass()`: Get CSS class for direction

### Styling (`web/src/styles/rtl.css`)

- LTR-specific styles: padding-left, text-align: left, border-left
- RTL-specific styles: padding-right, text-align: right, border-right
- Code blocks stay LTR even in RTL memos
- Pre-formatted text stays LTR for better readability

## Usage

### Creating/Editing a Memo with Direction

```typescript
import DirectionToggle from "@/components/DirectionToggle";
import DirectionWrapper from "@/components/DirectionWrapper";

// In your memo editor
const [direction, setDirection] = useState<Direction>("LTR");

return (
  <DirectionWrapper direction={direction}>
    <div>
      <DirectionToggle 
        value={direction} 
        onChange={setDirection}
      />
      {/* Memo content */}
    </div>
  </DirectionWrapper>
);
```

### API Usage

When creating or updating a memo:

```protobuf
message Memo {
  // ... other fields ...
  Direction direction = 19;
}

enum Direction {
  DIRECTION_UNSPECIFIED = 0;
  LTR = 1;
  RTL = 2;
}
```

## Migration Notes

- Existing memos default to LTR direction
- Direction is optional and can be omitted (defaults to DIRECTION_UNSPECIFIED = LTR)
- The direction field is stored in the memo payload JSON
- No breaking changes to existing API

## Future Enhancements

1. Auto-detect language and set direction automatically
2. User preference for default direction
3. Direction inheritance from user locale
4. Keyboard shortcuts for direction toggle (e.g., Ctrl+Alt+L/R)
5. Direction preference in user settings
