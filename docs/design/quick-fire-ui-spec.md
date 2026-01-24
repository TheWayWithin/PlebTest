# Quick Fire UI Design Specification

## Overview

Quick Fire is PlebTest's **primary entry hook** - a free, instant validation tool that hooks users before they sign up. It appears prominently on the landing page and provides immediate value: enter an idea, get a Risk Score and key objection within seconds.

**User Flow:**
1. User sees Quick Fire section on landing page
2. Types their idea in one sentence (no login required)
3. Gets instant Risk Score (1-100) + one key objection
4. "Go Deeper" CTA prompts signup for full validation

---

## Component States

### 1. Input State (Default)

The initial state when users first encounter Quick Fire.

#### Elements
- **Section heading**: "Test Your Idea in 30 Seconds"
- **Subheading**: "No signup required. Get your Risk Score instantly."
- **Input field**: Single line text input with placeholder
- **Character counter**: Shows current/required range
- **Submit button**: Primary CTA

#### Copy
```
Heading: "Test Your Idea in 30 Seconds"
Subheading: "No signup required. Get your Risk Score instantly."
Placeholder: "e.g., Uber for dog walking"
Character counter: "0/200" (updates as user types)
Help text: "Describe your idea in 10-200 characters"
Submit button: "Get Risk Score"
```

#### Visual Styling

**Container:**
- Background: `bg-zinc-900/50` with `border border-zinc-800`
- Border radius: `rounded-2xl`
- Padding: `p-8` (desktop), `p-6` (mobile)
- Max width: `max-w-xl` centered

**Heading:**
- Font: Inter, `text-2xl` (desktop), `text-xl` (mobile)
- Weight: `font-bold`
- Color: `text-white`
- Margin bottom: `mb-2`

**Subheading:**
- Font: Inter, `text-base`
- Weight: `font-normal`
- Color: `text-zinc-400`
- Margin bottom: `mb-6`

**Input Field:**
- Background: `bg-zinc-950`
- Border: `border border-zinc-700` (default), `border-indigo-500` (focus)
- Border radius: `rounded-lg`
- Padding: `px-4 py-3`
- Font: `text-base text-white`
- Placeholder: `placeholder:text-zinc-500`
- Width: `w-full`
- Focus ring: `focus:ring-2 focus:ring-indigo-500/50`

**Character Counter:**
- Position: Below input, right-aligned
- Font: `text-sm`
- Color: `text-zinc-500` (valid), `text-rose-400` (invalid)
- Format: `{current}/{max}`

**Help Text:**
- Font: `text-sm`
- Color: `text-zinc-500`
- Position: Below input, left-aligned

**Submit Button:**
- Background: `bg-indigo-600` (default), `bg-indigo-500` (hover)
- Text: `text-white font-semibold`
- Padding: `px-6 py-3`
- Border radius: `rounded-lg`
- Width: `w-full` (mobile), `w-auto` (desktop)
- Margin top: `mt-4`
- Disabled state: `opacity-50 cursor-not-allowed` (when < 10 chars)
- Transition: `transition-colors duration-150`

---

### 2. Loading State

Shown while the API processes the idea.

#### Elements
- **Loading indicator**: Animated spinner or pulse
- **Loading text**: Progress message
- **Input field**: Disabled, shows submitted text

#### Copy
```
Loading text (cycles every 1.5s):
1. "Analyzing market viability..."
2. "Checking competition landscape..."
3. "Evaluating risk factors..."
```

#### Visual Styling

**Input Field (Disabled):**
- Background: `bg-zinc-900`
- Text: `text-zinc-400`
- Cursor: `cursor-not-allowed`

**Loading Indicator:**
- Type: Pulsing dots or spinning ring
- Color: `text-indigo-500`
- Size: `w-6 h-6`
- Position: Centered, above loading text

**Loading Text:**
- Font: `text-sm`
- Color: `text-zinc-400`
- Animation: Fade transition between messages
- Position: Centered below spinner

**Container:**
- Same as input state
- Add subtle pulse animation on border: `animate-pulse` on `border-indigo-500/30`

---

### 3. Result State

Displays the Risk Score and key objection after analysis.

#### Elements
- **Risk Score gauge**: Visual semi-circular gauge (0-100)
- **Risk level badge**: HIGH / MEDIUM / LOW
- **Key objection**: Styled quote box
- **Go Deeper CTA**: Primary action button
- **Try Another link**: Secondary action

#### Copy
```
Result heading: "Your Risk Score"
Risk levels:
  - HIGH (71-100): "High Risk - Major obstacles ahead"
  - MEDIUM (31-70): "Medium Risk - Proceed with caution"
  - LOW (0-30): "Low Risk - Strong potential"

Objection heading: "Key Challenge"
Objection placeholder: "{AI-generated objection}"

Primary CTA: "Go Deeper - Get Full Analysis"
Secondary link: "Try another idea"
```

#### Visual Styling

**Result Container:**
- Same container as input state
- Transition: Fade in with slight scale (`animate-in fade-in-0 zoom-in-95`)

**Risk Score Gauge:**
```
     ___________
    /           \
   /             \
  |               |
   \     73      /
    \___________/
```
- Type: Semi-circular arc gauge
- Size: `w-48 h-24` (desktop), `w-40 h-20` (mobile)
- Track color: `stroke-zinc-800`
- Fill color: Gradient based on score
  - 0-30: `stroke-emerald-500` (green)
  - 31-70: `stroke-amber-500` (yellow/orange)
  - 71-100: `stroke-rose-500` (red)
- Score number: `text-4xl font-bold text-white` centered
- Animation: Arc fills from 0 to score over 1s with easing

**Risk Level Badge:**
- Position: Below gauge, centered
- Padding: `px-4 py-1`
- Border radius: `rounded-full`
- Font: `text-sm font-semibold uppercase tracking-wide`
- Colors by level:
  - HIGH: `bg-rose-500/20 text-rose-400 border border-rose-500/30`
  - MEDIUM: `bg-amber-500/20 text-amber-400 border border-amber-500/30`
  - LOW: `bg-emerald-500/20 text-emerald-400 border border-emerald-500/30`

**Key Objection Box:**
- Background: `bg-zinc-950`
- Border: `border-l-4` with color matching risk level
- Padding: `p-4`
- Border radius: `rounded-r-lg`
- Margin: `mt-6`

**Objection Heading:**
- Font: `text-xs font-semibold uppercase tracking-wide`
- Color: `text-zinc-500`
- Margin bottom: `mb-2`

**Objection Text:**
- Font: `text-base italic`
- Color: `text-zinc-300`
- Leading: `leading-relaxed`

**Go Deeper CTA:**
- Background: `bg-indigo-600` (default), `bg-indigo-500` (hover)
- Text: `text-white font-semibold`
- Padding: `px-8 py-3`
- Border radius: `rounded-lg`
- Width: `w-full`
- Margin top: `mt-6`
- Icon: Arrow right (`->`) after text

**Try Another Link:**
- Font: `text-sm`
- Color: `text-zinc-500` (default), `text-zinc-300` (hover)
- Position: Centered below CTA
- Margin top: `mt-3`
- Underline on hover

---

### 4. Error States

#### Validation Error (Character Count)

**When:** Input < 10 or > 200 characters on submit attempt

**Visual:**
- Input border: `border-rose-500`
- Error message below input: `text-rose-400 text-sm`
- Character counter: `text-rose-400`

**Copy:**
```
Too short: "Please describe your idea in at least 10 characters"
Too long: "Please keep your idea under 200 characters"
```

#### Rate Limit Error

**When:** User exceeds 10 requests per hour

**Visual:**
- Replace input area with error state
- Icon: Clock or warning icon
- Background: `bg-amber-500/10`
- Border: `border border-amber-500/30`

**Copy:**
```
Heading: "Slow down there, speed racer"
Message: "You've hit the limit of 10 free analyses per hour.
Sign up for unlimited access or try again in {time remaining}."
CTA: "Sign up for unlimited"
Secondary: "Try again in {X} minutes"
```

#### API Error

**When:** Server error or timeout

**Visual:**
- Error icon: Warning triangle
- Background: Same container

**Copy:**
```
Heading: "Analysis failed"
Message: "Something went wrong on our end. Please try again."
CTA: "Try Again"
```

---

## Responsive Behavior

### Desktop (>= 768px)

```
+------------------------------------------+
|     Test Your Idea in 30 Seconds         |
|  No signup required. Get Risk Score...   |
|                                          |
| +--------------------------------------+ |
| | e.g., Uber for dog walking           | |
| +--------------------------------------+ |
| Describe your idea...            0/200   |
|                                          |
|              [Get Risk Score]            |
+------------------------------------------+
```

- Container: `max-w-xl` centered
- Input and button on separate lines
- Padding: `p-8`

### Mobile (< 768px)

```
+--------------------------------+
| Test Your Idea in 30 Seconds   |
| No signup required...          |
|                                |
| +----------------------------+ |
| | e.g., Uber for dog...      | |
| +----------------------------+ |
| Describe...             0/200  |
|                                |
| [      Get Risk Score       ]  |
+--------------------------------+
```

- Container: Full width with `mx-4` margin
- Input: Full width
- Button: Full width
- Padding: `p-6`
- Heading: `text-xl` instead of `text-2xl`

### Result State (Mobile)

```
+--------------------------------+
|       Your Risk Score          |
|                                |
|          ___________           |
|         /     73    \          |
|         \___________/          |
|                                |
|      [ MEDIUM RISK ]           |
|   Proceed with caution         |
|                                |
| +----------------------------+ |
| | KEY CHALLENGE              | |
| | "The dog walking market... | |
| +----------------------------+ |
|                                |
| [  Go Deeper - Full Analysis ] |
|       Try another idea         |
+--------------------------------+
```

---

## Animation Specifications

### Input to Loading Transition
- Duration: 200ms
- Easing: `ease-out`
- Effect: Button transforms to loading state

### Loading to Result Transition
- Duration: 400ms
- Easing: `ease-out`
- Effect: Fade in + slight scale up

### Risk Score Gauge Animation
- Duration: 1000ms
- Easing: `ease-out` (slow at end)
- Effect: Arc fills from 0 to final score
- Start: 200ms after result appears

### Badge Appearance
- Duration: 300ms
- Delay: 800ms (after gauge mostly filled)
- Effect: Fade in + slight bounce

### Objection Box Appearance
- Duration: 300ms
- Delay: 1100ms
- Effect: Slide up + fade in

### CTA Button Appearance
- Duration: 300ms
- Delay: 1400ms
- Effect: Fade in + scale up

---

## Component Structure

```
QuickFire/
├── QuickFire.tsx              # Main component with state management
├── QuickFireInput.tsx         # Input state UI
├── QuickFireLoading.tsx       # Loading state UI
├── QuickFireResult.tsx        # Result state UI
├── QuickFireError.tsx         # Error state UI
├── RiskScoreGauge.tsx         # Animated gauge component
├── RiskLevelBadge.tsx         # Risk level indicator
└── ObjectionBox.tsx           # Styled objection display
```

### State Management

```typescript
type QuickFireState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; result: QuickFireResult }
  | { status: 'error'; error: QuickFireError };

interface QuickFireResult {
  riskScore: number;        // 0-100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  keyObjection: string;
}

interface QuickFireError {
  type: 'validation' | 'rate_limit' | 'api_error';
  message: string;
  retryAfter?: number;      // seconds until retry allowed
}
```

---

## Accessibility Requirements

### Keyboard Navigation
- Tab order: Input -> Submit button -> Try Another (in result state)
- Enter key submits form
- Escape key clears input and resets to idle state

### Screen Reader Support
- Input has `aria-label="Describe your business idea"`
- Character counter has `aria-live="polite"`
- Loading state announces "Analyzing your idea"
- Result announces "Risk score is {X} out of 100, {level} risk"
- Error states announce error message

### Focus Management
- Focus moves to result heading when result appears
- Focus moves to error message when error occurs
- "Try another" returns focus to input field

### Color Contrast
- All text meets WCAG AA standards (4.5:1 ratio)
- Risk colors are supplemented with text labels (not color-only)
- Focus states are clearly visible

---

## Landing Page Integration

### Placement Options

**Option A: Hero Section (Recommended)**
Place Quick Fire directly in the hero, making it the first interactive element users see.

```
+--------------------------------------------------+
| PLEBTEST                           Sign In       |
|--------------------------------------------------|
|                                                  |
|   Will your idea make money?                     |
|   Stop guessing. Start knowing.                  |
|                                                  |
|   +------------------------------------------+   |
|   |     Test Your Idea in 30 Seconds         |   |
|   |     [Quick Fire Component]               |   |
|   +------------------------------------------+   |
|                                                  |
|   Trusted by 10,000+ founders                    |
|                                                  |
+--------------------------------------------------+
```

**Option B: Below Hero**
Keep hero text-focused, place Quick Fire as a dedicated section below.

### Section Background
- Option: Add subtle gradient glow behind Quick Fire
- Color: `radial-gradient(ellipse at center, rgba(99, 102, 241, 0.1), transparent 70%)`
- Effect: Draws attention without overwhelming

---

## Design Rationale

### Why This Design Works

1. **Instant Value**: No barriers to trying - users can validate an idea in seconds without signing up.

2. **Visual Feedback**: The animated gauge provides satisfying, understandable feedback that feels substantive.

3. **Conversion Hook**: The result state naturally leads to "Go Deeper" - users who've invested time want to see more.

4. **Trust Building**: Showing a real analysis (even limited) proves the product works before asking for signup.

5. **Brand Consistency**: Dark theme with indigo accents matches the existing landing page.

6. **Mobile-First**: Full-width inputs and buttons work naturally on touch devices.

### Risk Score Color Psychology

- **Rose/Red (High Risk)**: Creates urgency but doesn't discourage - "Go Deeper to understand why"
- **Amber (Medium Risk)**: Neutral, invites curiosity - "What's causing this score?"
- **Emerald/Green (Low Risk)**: Validates but teases - "Is this too good to be true?"

All three scenarios drive the user to want more information, which is the conversion goal.

---

## Implementation Notes for Developer

### Key Technical Considerations

1. **Rate Limiting**: Implement IP-based rate limiting (10/hour) on the API route. Use `x-forwarded-for` header with Railway.

2. **Input Debounce**: Validate character count on change, but only show errors on blur or submit.

3. **Gauge Animation**: Use SVG path with `stroke-dasharray` and `stroke-dashoffset` for smooth arc animation. CSS transitions work better than JS for this.

4. **Loading Messages**: Use `useEffect` with `setInterval` to cycle messages. Clear interval on unmount.

5. **Error Recovery**: Store last submitted idea in state so users can retry without retyping.

6. **Analytics Events**: Track: form_view, form_submit, result_view, cta_click, try_another_click.

### Suggested Tech Stack
- React component with `useState` for state management
- Tailwind CSS for styling (matches existing codebase)
- Framer Motion for animations (if already installed) or CSS transitions
- SVG for gauge (no library needed)

### API Contract (Reference)

```typescript
// POST /api/quick-fire
// Request
{ idea: string }  // 10-200 chars

// Response (success)
{
  riskScore: number,       // 0-100
  riskLevel: string,       // 'LOW' | 'MEDIUM' | 'HIGH'
  keyObjection: string     // AI-generated objection
}

// Response (rate limit)
{
  error: 'rate_limit',
  retryAfter: number       // seconds
}
```

---

## Appendix: Color Reference

| Element | Default | Hover | Active | Disabled |
|---------|---------|-------|--------|----------|
| Input border | `zinc-700` | - | `indigo-500` | `zinc-800` |
| Submit button | `indigo-600` | `indigo-500` | `indigo-700` | `indigo-600/50` |
| High risk | `rose-500` | - | - | - |
| Medium risk | `amber-500` | - | - | - |
| Low risk | `emerald-500` | - | - | - |
| Text primary | `white` | - | - | `zinc-400` |
| Text secondary | `zinc-400` | `zinc-300` | - | `zinc-500` |
| Background | `zinc-900/50` | - | - | - |
| Input bg | `zinc-950` | - | - | `zinc-900` |
