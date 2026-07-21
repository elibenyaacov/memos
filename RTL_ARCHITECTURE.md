# RTL Support - Implementation Details

## Architecture Overview

The RTL support system consists of three main layers:

1. **Proto/API Layer** - Direction enum and field definition
2. **Storage Layer** - Database persistence
3. **UI Layer** - React components and styling

## Proto Definition

### `proto/api/v1/memo_service.proto`

```protobuf
enum Direction {
  DIRECTION_UNSPECIFIED = 0;  // Default, treated as LTR
  LTR = 1;                    // Left-to-Right
  RTL = 2;                    // Right-to-Left
}

message Memo {
  // ... existing fields ...
  Direction direction = 19;   // New field for text direction
}
```

**Field Number**: 19 (deliberately high to avoid conflicts)
**Default Behavior**: DIRECTION_UNSPECIFIED defaults to LTR for backward compatibility

### `proto/store/memo.proto`

Direction is also stored in the `MemoPayload` for internal use:

```protobuf
message MemoPayload {
  // ... existing fields ...
  int32 direction = 4;  // 0=UNSPECIFIED, 1=LTR, 2=RTL
}
```

## Storage Layer

### Database Schema

Direction is stored in the memo's JSON `payload` field:

```json
{
  "property": { ... },
  "location": { ... },
  "tags": [ ... ],
  "direction": 2  // RTL
}
```

**Benefits of storing in payload:**
- No schema migration needed for new databases
- Flexible for future direction-related metadata
- Existing queries continue to work
- Easy to add to old memos

### Go Store Model

```go
type Direction int32

const (
    DirectionUnspecified Direction = 0
    DirectionLTR         Direction = 1
    DirectionRTL         Direction = 2
)

func (d Direction) String() string { ... }
```

### SQLite Implementation

The `store/db/sqlite/memo.go` handles:

1. **Creating memos** - Direction from Payload is preserved
2. **Reading memos** - Payload is unmarshaled with direction
3. **Updating memos** - Payload can be updated with new direction
4. **Querying** - Direction can be added to filter expressions

```go
payload := &storepb.MemoPayload{}
if err := protojsonUnmarshaler.Unmarshal(payloadBytes, payload); err != nil {
    return nil, errors.Wrap(err, "failed to unmarshal payload")
}
memo.Payload = payload
```

## Frontend Layer

### Component Hierarchy

```
MemoEditorHeader (manages direction state)
├── DirectionToggle (LTR/RTL button toggle)
└── DirectionWrapper (applies dir attribute)
    └── Memo Content (displayed with proper alignment)
```

### DirectionToggle Component

**Props:**
- `value?: Direction` - Current direction ("LTR" | "RTL")
- `onChange?: (direction: Direction) => void` - Callback
- `variant?: "button" | "select"` - UI style
- `className?: string` - Additional CSS classes

**Features:**
- Two variants: button group or dropdown select
- Lucide icons (ArrowRightIcon, ArrowLeftIcon)
- Tooltips on hover
- Accessible (keyboard navigable)

### DirectionWrapper Component

**Props:**
- `direction?: "LTR" | "RTL"` - Text direction
- `children: ReactNode` - Content to wrap
- `className?: string` - Additional CSS classes

**Features:**
- Applies `dir` HTML attribute
- Sets `lang` attribute for RTL
- Applies text alignment
- Smooth transitions

### RTL Styling

#### LTR (Default)
```css
.ltr-content {
  direction: ltr;
  text-align: left;
}
.ltr-content ul {
  padding-left: 2rem;  /* Indent to the left */
}
.ltr-content blockquote {
  border-left: 4px solid;  /* Border on the left */
}
```

#### RTL
```css
.rtl-content {
  direction: rtl;
  text-align: right;
}
.rtl-content ul {
  padding-right: 2rem;  /* Indent to the right */
}
.rtl-content blockquote {
  border-right: 4px solid;  /* Border on the right */
}
```

#### Special Cases
```css
/* Code blocks stay LTR */
.rtl-content code {
  direction: ltr;
}
.rtl-content pre {
  direction: ltr;
  text-align: left;
}

/* Textareas respect direction */
.memo-container[dir="rtl"] textarea {
  direction: rtl;
  text-align: right;
}
```

## Data Flow

### Creating a Memo with Direction

```
User clicks RTL button
    ↓
DirectionToggle onChange fires
    ↓
MemoEditorHeader state updates
    ↓
MemoPayload direction field set
    ↓
API call CreateMemoRequest
    ↓
Server stores direction in payload
    ↓
Database persists memo with direction
```

### Reading a Memo with Direction

```
API GetMemoRequest
    ↓
Server reads memo from database
    ↓
Payload unmarshaled, direction extracted
    ↓
Direction enum returned in response
    ↓
DirectionWrapper applies dir attribute
    ↓
Content renders with correct alignment
```

## API Contract Examples

### Creating a Memo (RTL)
```json
POST /api/v1/memos
{
  "memo": {
    "content": "السلام عليكم ورحمة الله وبركاته",
    "visibility": "PRIVATE",
    "direction": "RTL"
  }
}
```

### Response
```json
{
  "name": "memos/1",
  "content": "السلام عليكم ورحمة الله وبركاته",
  "visibility": "PRIVATE",
  "direction": "RTL"
}
```

### Updating Direction Only
```json
PATCH /api/v1/memos/1
{
  "memo": {
    "name": "memos/1",
    "direction": "LTR"
  },
  "update_mask": ["direction"]
}
```

## Type Safety

### TypeScript Definitions

```typescript
type Direction = "LTR" | "RTL";

interface DirectionToggleProps {
  value?: Direction;
  onChange?: (direction: Direction) => void;
  variant?: "button" | "select";
}

interface DirectionWrapperProps {
  direction?: Direction;
  children: ReactNode;
}
```

### Proto Generated Types

After `buf generate`, the proto enums are available in:
- Go: `gen/api/v1.Direction`
- TypeScript: `@/types/proto/api/v1/memo_service_pb.Direction`

## Testing Considerations

### Unit Tests
- DirectionToggle state changes
- Direction utilities (getDirectionString, applyDirectionStyle)
- Direction wrapper rendering with correct attributes

### Integration Tests
- Creating memo with RTL direction
- Updating memo direction
- Direction persists across page reload
- Multiple memos with different directions

### E2E Tests
- User toggles direction in editor
- Content aligns correctly
- Direction saved to database
- Direction displayed on memo view

## Performance Considerations

1. **Minimal**: DirectionToggle is a simple component
2. **Rendering**: DirectionWrapper uses memo() to prevent rerenders
3. **Styling**: CSS classes are pre-compiled, no runtime calculations
4. **Storage**: Direction stored in existing payload field, no extra DB queries

## Browser Support

RTL is a standard HTML5 feature:
- `dir` attribute: Universal support
- CSS `direction` property: Universal support
- `text-align: right`: Universal support

No polyfills or fallbacks needed.

## Future Enhancements

### 1. Auto-Detection
```typescript
const detectDirection = (text: string): Direction => {
  const rtlRegex = /[\u0590-\u05FF\u0600-\u06FF]/;
  return rtlRegex.test(text) ? "RTL" : "LTR";
};
```

### 2. User Default
```typescript
// In user settings
defaultDirection: "RTL" // User preference
```

### 3. Locale-based
```typescript
const directionFromLocale = (locale: string): Direction => {
  const rtlLocales = ["ar", "he", "fa", "ur"];
  return rtlLocales.includes(locale.split("-")[0]) ? "RTL" : "LTR";
};
```

## Migration Path for Existing Deployments

1. Deploy backend changes (proto, database layer)
2. Deploy frontend changes (components, styling)
3. All existing memos default to LTR
4. Users can toggle any memo to RTL
5. No data migration required
6. Backward compatible with existing APIs

---

**Maintainer Notes:**
- Keep `Direction` enum values stable (never reuse or change existing values)
- Always add new fields with high numbers to avoid conflicts
- Test with actual RTL content before releases
- Monitor for browser compatibility issues
