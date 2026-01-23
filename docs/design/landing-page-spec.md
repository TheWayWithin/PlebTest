# PlebTest Landing Page Design Specification

**Version**: 1.0
**Created**: 2026-01-22
**Designer**: @designer
**Status**: Ready for Implementation

---

## Design Overview

### Design Philosophy
The landing page embodies PlebTest's anti-sycophancy positioning: direct, honest, and confrontational (in a good way). The design should feel like a reality check, not a sales pitch. We're speaking to founders who are tired of sugar-coated feedback and want the truth.

### Key Design Principles
1. **Clarity over cleverness** - Every word earns its place
2. **Contrast creates hierarchy** - Bold hero, calm explanations
3. **Action-oriented** - Multiple CTAs, always visible path forward
4. **Trust through honesty** - No fake testimonials, no inflated promises

---

## Section 1: Hero

### Layout
- Full viewport height on desktop (100vh)
- Centered content with max-width 1200px
- Background: Subtle gradient from `#F9FAFB` to `#EEF2FF` (Gray-50 to Indigo-50)
- Optional: Abstract geometric shapes or grid pattern at 5% opacity for depth

### Content

**Badge** (above headline):
```
For founders who hate cold calls
```
- Style: Inline-flex, bg `#EEF2FF`, text `#6366F1`, 12px font, 600 weight, 6px radius, px-3 py-1
- Component: Custom badge or `shadcn/ui Badge` variant

**Headline**:
```
Stop building what nobody wants.
```
- Font: Inter, 48px desktop / 36px mobile, weight 700
- Color: `#111827` (Gray-900)
- Max-width: 720px
- Line-height: 1.1

**Subheadline**:
```
PlebTest uses AI personas built to challenge your assumptions—not confirm them. Get honest feedback in minutes, not months of wasted building.
```
- Font: Inter, 20px desktop / 18px mobile, weight 400
- Color: `#4B5563` (Gray-600)
- Max-width: 600px
- Line-height: 1.6
- Margin-top: 24px

**Primary CTA**:
```
Join the Waitlist →
```
- Component: `shadcn/ui Button` (default variant)
- Style: bg `#6366F1`, text white, hover bg `#4F46E5`
- Size: 14px font, weight 600, px-8 py-4, 8px radius
- Margin-top: 32px

**Secondary Element** (below CTA):
```
🎯 No credit card required • Get early access + founding member pricing
```
- Font: 14px, weight 400
- Color: `#6B7280` (Gray-500)
- Margin-top: 16px

**Hero Visual** (optional enhancement):
- Right side on desktop (50/50 split) or below content on mobile
- Illustration of: Kill/Pivot/Build verdict cards, or abstract representation of AI feedback
- If no illustration ready: Use a mockup of the app interface (can be placeholder)

### Responsive Behavior
- Desktop (1024px+): Side-by-side layout, headline 48px
- Tablet (768-1023px): Stacked layout, headline 40px
- Mobile (<768px): Stacked layout, headline 36px, full-width CTA

### Accessibility
- Headline: `<h1>` element
- CTA: Clear focus ring (`ring-2 ring-offset-2 ring-indigo-500`)
- Color contrast: All text meets WCAG AA (4.5:1 minimum)

---

## Section 2: Problem Statement

### Layout
- Background: White (`#FFFFFF`)
- Padding: py-24 desktop, py-16 mobile
- Content: Centered, max-width 1000px

### Content

**Section Label**:
```
THE PROBLEM
```
- Font: 12px, weight 600, letter-spacing 0.1em
- Color: `#F43F5E` (Rose-500, the "Kill" color)
- Margin-bottom: 16px

**Headline**:
```
42% of startups fail because nobody wanted what they built.
```
- Font: Inter, 36px desktop / 28px mobile, weight 700
- Color: `#111827`
- Max-width: 800px

**Pain Points Grid**:
Three cards in a row (stacked on mobile)

**Card 1: Phone Anxiety**
```
Icon: 📞 (or PhoneOff icon from Lucide)
Title: "Talking to strangers is painful"
Description: "You know you should validate, but cold calling potential customers feels impossible. So you skip it."
```

**Card 2: Wasted Time**
```
Icon: ⏰ (or Clock icon from Lucide)
Title: "Months of building blind"
Description: "You build features nobody asked for, pivot too late, and run out of runway before finding product-market fit."
```

**Card 3: Sycophantic Feedback**
```
Icon: 🤖 (or Bot icon from Lucide)
Title: "ChatGPT just tells you what you want to hear"
Description: "Friends and AI assistants want to be nice. They confirm your assumptions instead of challenging them."
```

**Card Styling**:
- Component: `shadcn/ui Card`
- Background: `#F9FAFB` (Gray-50)
- Border: 1px `#E5E7EB` (Gray-200)
- Radius: 12px
- Padding: 24px
- Icon: 32px, color matches card theme or `#6366F1`
- Title: 18px, weight 600, color `#111827`
- Description: 14px, weight 400, color `#6B7280`

### Responsive Behavior
- Desktop: 3-column grid, gap-8
- Tablet: 3-column grid, gap-6
- Mobile: Single column stack, gap-4

---

## Section 3: Solution

### Layout
- Background: `#111827` (Gray-900, dark section for contrast)
- Padding: py-24 desktop, py-16 mobile
- Content: Centered, max-width 1000px

### Content

**Section Label**:
```
THE SOLUTION
```
- Font: 12px, weight 600, letter-spacing 0.1em
- Color: `#10B981` (Emerald-500, the "Build" color)
- Margin-bottom: 16px

**Headline**:
```
AI personas that push back, not flatter.
```
- Font: Inter, 36px desktop / 28px mobile, weight 700
- Color: `#FFFFFF`
- Max-width: 700px

**Description**:
```
PlebTest simulates real customer conversations with AI personas designed to challenge your assumptions. No sycophancy. No sugar-coating. Just the honest feedback you need to make the right call.
```
- Font: 18px, weight 400
- Color: `#D1D5DB` (Gray-300)
- Max-width: 650px
- Margin-top: 20px

**Verdict Cards** (inline row on desktop, stacked on mobile):

**Kill Card**:
```
Icon: ❌ or X icon
Label: "KILL"
Description: "Stop now. Save your time."
```
- Background: `#FEF2F2` (Rose-50)
- Border: 2px `#F43F5E` (Rose-500)
- Icon/Label color: `#F43F5E`

**Pivot Card**:
```
Icon: 🔄 or RefreshCw icon
Label: "PIVOT"
Description: "Good bones, wrong angle."
```
- Background: `#FFFBEB` (Amber-50)
- Border: 2px `#F59E0B` (Amber-500)
- Icon/Label color: `#F59E0B`

**Build Card**:
```
Icon: ✅ or Check icon
Label: "BUILD"
Description: "Green light. Ship it."
```
- Background: `#ECFDF5` (Emerald-50)
- Border: 2px `#10B981` (Emerald-500)
- Icon/Label color: `#10B981`

**Card Styling**:
- Width: 180px each
- Radius: 12px
- Padding: 20px
- Text-align: center
- Label: 16px, weight 700
- Description: 12px, weight 400, color `#4B5563`

**Differentiator Callout** (below verdict cards):
```
"Unlike ChatGPT, our personas are built to find holes in your idea—not pat you on the back."
```
- Font: 16px, weight 500, italic
- Color: `#9CA3AF` (Gray-400)
- Margin-top: 40px
- Border-left: 4px `#6366F1`, padding-left 20px

### Responsive Behavior
- Desktop: Verdict cards in row, gap-6
- Mobile: Verdict cards stacked vertically, gap-4

---

## Section 4: How It Works

### Layout
- Background: White (`#FFFFFF`)
- Padding: py-24 desktop, py-16 mobile
- Content: Centered, max-width 1100px

### Content

**Section Label**:
```
HOW IT WORKS
```
- Font: 12px, weight 600, letter-spacing 0.1em
- Color: `#6366F1` (Indigo-500)
- Margin-bottom: 16px

**Headline**:
```
From idea to verdict in minutes.
```
- Font: Inter, 36px desktop / 28px mobile, weight 700
- Color: `#111827`

**Process Steps** (horizontal timeline on desktop, vertical on mobile):

**Step 1**:
```
Number: 01
Title: "Describe your idea"
Description: "Tell us about your product, target market, and what problem you're solving. No jargon required."
Time: "2 minutes"
```

**Step 2**:
```
Number: 02
Title: "Choose your validation mode"
Description: "Quick Fire for fast gut checks, or Full Validation for deep-dive customer conversations."
Time: "30 seconds"
```

**Step 3**:
```
Number: 03
Title: "Face the personas"
Description: "AI personas challenge your assumptions with real objections, skeptical questions, and honest reactions."
Time: "5-15 minutes"
```

**Step 4**:
```
Number: 04
Title: "Get your verdict"
Description: "Kill, Pivot, or Build—with specific reasoning and actionable next steps."
Time: "Instant"
```

**Step Styling**:
- Number: 48px, weight 700, color `#6366F1` with 10% opacity background circle
- Title: 20px, weight 600, color `#111827`
- Description: 14px, weight 400, color `#6B7280`
- Time badge: Inline, bg `#EEF2FF`, text `#6366F1`, 12px, px-2 py-1
- Connector line between steps: 2px dashed `#E5E7EB`

### Responsive Behavior
- Desktop: Horizontal 4-column layout with connecting lines
- Tablet: 2x2 grid
- Mobile: Vertical stack with left-aligned numbers

---

## Section 5: Pricing Preview

### Layout
- Background: `#F9FAFB` (Gray-50)
- Padding: py-24 desktop, py-16 mobile
- Content: Centered, max-width 900px

### Content

**Section Label**:
```
PRICING
```
- Font: 12px, weight 600, letter-spacing 0.1em
- Color: `#6366F1`
- Margin-bottom: 16px

**Headline**:
```
Simple pricing. No surprises.
```
- Font: Inter, 36px desktop / 28px mobile, weight 700
- Color: `#111827`

**Subheadline**:
```
Launching soon with founding member pricing.
```
- Font: 18px, weight 400
- Color: `#6B7280`
- Margin-top: 12px

**Pricing Tiers Preview** (4 cards, slightly faded to indicate "coming soon"):

**Solo Tier**:
```
Name: "Solo"
Price: "$9.95/mo"
Description: "For side-hustle builders testing their first ideas"
Highlight: "1 idea • 10 tests/month"
```

**Growth Tier**:
```
Name: "Growth"
Price: "$19.95/mo"
Description: "For founders getting serious about validation"
Highlight: "3 ideas • 30 tests/month"
Badge: "POPULAR" (if highlighting)
```

**Scale Tier**:
```
Name: "Scale"
Price: "$29.95/mo"
Description: "For teams validating multiple ideas"
Highlight: "10 ideas • 100 tests/month"
```

**Pro Tier**:
```
Name: "Pro"
Price: "$49.95/mo"
Description: "For agencies and serial entrepreneurs"
Highlight: "20 ideas • 200 tests/month"
```

**Card Styling**:
- Component: `shadcn/ui Card`
- Background: White
- Border: 1px `#E5E7EB`
- Radius: 12px
- Padding: 24px
- Name: 18px, weight 600
- Price: 32px, weight 700, color `#111827`
- Description: 14px, color `#6B7280`
- Overlay: Semi-transparent white with "Coming Soon" badge

**Coming Soon Overlay**:
- Position: absolute, inset-0
- Background: rgba(255,255,255,0.7)
- Display: flex, center
- Badge: "Coming Soon", bg `#6366F1`, text white, px-4 py-2, rounded-full

**CTA below pricing**:
```
Join the waitlist for early access and founding member discounts.
```
- Font: 16px, weight 500
- Color: `#4B5563`
- Followed by secondary button: "Get Early Access"

### Responsive Behavior
- Desktop: 4-column grid
- Tablet: 2x2 grid
- Mobile: Horizontal scroll or single column

---

## Section 6: Waitlist CTA

### Layout
- Background: Gradient from `#6366F1` to `#8B5CF6` (Indigo to Electric Violet)
- Padding: py-20 desktop, py-16 mobile
- Content: Centered, max-width 600px

### Content

**Headline**:
```
Be first in line.
```
- Font: Inter, 36px desktop / 28px mobile, weight 700
- Color: White

**Subheadline**:
```
Join founders who want honest feedback, not flattery. Early access members get founding pricing locked in forever.
```
- Font: 18px, weight 400
- Color: rgba(255,255,255,0.9)
- Max-width: 500px
- Margin-top: 16px

**Email Form**:
- Component: `shadcn/ui Input` + `shadcn/ui Button`
- Layout: Inline on desktop (input + button side by side), stacked on mobile
- Input: bg white, placeholder "Enter your email", 16px, rounded-l-lg (or full on mobile)
- Button: bg `#111827`, text white, "Join Waitlist", rounded-r-lg (or full on mobile)
- Width: max 480px combined

**Privacy Note**:
```
No spam. Unsubscribe anytime. Read our privacy policy.
```
- Font: 12px, weight 400
- Color: rgba(255,255,255,0.7)
- Link "privacy policy": underline, same color
- Margin-top: 12px

### Form Behavior
- Email validation on submit
- Success state: Replace form with "You're on the list! Check your email."
- Error state: Red border on input, error message below

### Accessibility
- Input: Proper label (can be visually hidden), `type="email"`, `required`
- Button: Clear focus state
- Form: `role="form"`, `aria-label="Waitlist signup"`

---

## Section 7: Footer

### Layout
- Background: `#111827` (Gray-900)
- Padding: py-12 desktop, py-8 mobile
- Content: Centered, max-width 1200px

### Content

**Logo/Brand**:
```
PlebTest
```
- Font: 24px, weight 700
- Color: White
- Optional: Logo icon if available

**Tagline**:
```
Kill duds. Find winners.
```
- Font: 14px, weight 400
- Color: `#9CA3AF` (Gray-400)
- Margin-top: 8px

**Links Row**:
```
Privacy Policy | Terms of Service | Contact
```
- Font: 14px, weight 400
- Color: `#9CA3AF`
- Hover: `#FFFFFF`
- Links to: /privacy, /terms, mailto:hello@plebtest.com

**Copyright**:
```
© 2026 PlebTest. All rights reserved.
```
- Font: 12px, weight 400
- Color: `#6B7280` (Gray-500)
- Margin-top: 24px

### Layout Structure
- Desktop: Logo left, links center, copyright right (flex row)
- Mobile: Stacked center-aligned

---

## Component Specifications

### shadcn/ui Components to Use

| Component | Usage | Customization |
|-----------|-------|---------------|
| `Button` | CTAs, form submit | Primary variant with brand colors |
| `Card` | Problem cards, pricing cards | Custom padding, border radius |
| `Input` | Email capture | White bg, proper sizing |
| `Badge` | Labels, coming soon | Custom color variants |

### Custom Components Needed

1. **VerdictCard** - Kill/Pivot/Build display cards
   - Props: type (kill|pivot|build), title, description
   - Auto-applies correct colors based on type

2. **ProcessStep** - How it works step
   - Props: number, title, description, time
   - Handles connector line logic

3. **WaitlistForm** - Email capture with states
   - Props: onSubmit, loading, success, error
   - Handles validation and API call

4. **SectionLabel** - Consistent section labeling
   - Props: text, color (or auto from theme)

---

## Typography Scale

| Element | Desktop | Mobile | Weight | Line Height |
|---------|---------|--------|--------|-------------|
| Hero H1 | 48px | 36px | 700 | 1.1 |
| Section H2 | 36px | 28px | 700 | 1.2 |
| Card Title | 18-20px | 16-18px | 600 | 1.3 |
| Body Large | 18-20px | 16-18px | 400 | 1.6 |
| Body | 16px | 16px | 400 | 1.6 |
| Body Small | 14px | 14px | 400 | 1.5 |
| Caption | 12px | 12px | 400 | 1.4 |
| Label | 12px | 12px | 600 | 1.2 |

---

## Color Usage Guide

| Usage | Color | Hex |
|-------|-------|-----|
| Primary CTAs | Indigo-500 | #6366F1 |
| Primary Hover | Indigo-600 | #4F46E5 |
| Secondary CTAs | Violet-500 | #8B5CF6 |
| Success/Build | Emerald-500 | #10B981 |
| Warning/Pivot | Amber-500 | #F59E0B |
| Error/Kill | Rose-500 | #F43F5E |
| Headings | Gray-900 | #111827 |
| Body Text | Gray-600 | #4B5563 |
| Muted Text | Gray-500 | #6B7280 |
| Light Text | Gray-400 | #9CA3AF |
| Backgrounds Light | Gray-50 | #F9FAFB |
| Backgrounds Dark | Gray-900 | #111827 |
| Borders | Gray-200 | #E5E7EB |

---

## Spacing System

Use Tailwind's default spacing scale:
- Section padding: py-24 (96px) desktop, py-16 (64px) mobile
- Content max-width: 1200px (container), 600-1000px for text
- Component gaps: gap-4 (16px), gap-6 (24px), gap-8 (32px)
- Inner padding: p-4 (16px), p-6 (24px)

---

## Animation & Interaction Notes

### Recommended Animations

1. **Hero entrance**: Fade up with stagger (headline, then subheadline, then CTA)
   - Use Framer Motion or CSS animations
   - Duration: 0.6s, ease-out
   - Stagger: 0.1s between elements

2. **Scroll reveals**: Fade up as sections enter viewport
   - Trigger at 20% visibility
   - Duration: 0.5s

3. **Verdict cards**: Subtle hover lift
   - Transform: translateY(-4px)
   - Shadow increase
   - Duration: 0.2s

4. **CTA buttons**: Scale on hover
   - Transform: scale(1.02)
   - Duration: 0.15s

5. **Form success**: Checkmark animation
   - SVG path animation
   - Duration: 0.4s

### Performance Considerations
- Use CSS transforms over layout-triggering properties
- Prefer `will-change` hints sparingly
- Consider reduced motion preferences: `prefers-reduced-motion`

---

## Accessibility Checklist

- [ ] All images have alt text
- [ ] Form inputs have associated labels
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Focus states visible on all interactive elements
- [ ] Keyboard navigation works throughout page
- [ ] Skip link to main content
- [ ] Proper heading hierarchy (h1 > h2 > h3)
- [ ] ARIA labels on icon-only buttons
- [ ] Reduced motion alternative for animations
- [ ] Language attribute on html element

---

## Responsive Breakpoints

Using Tailwind defaults:
- `sm`: 640px
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px
- `2xl`: 1536px

### Key Breakpoint Behaviors

| Element | Mobile (<768px) | Tablet (768-1023px) | Desktop (1024px+) |
|---------|-----------------|---------------------|-------------------|
| Hero headline | 36px | 40px | 48px |
| Hero layout | Stacked | Stacked | Side-by-side |
| Problem cards | 1 column | 3 columns | 3 columns |
| Verdict cards | Stacked | Row | Row |
| Process steps | Vertical | 2x2 grid | Horizontal |
| Pricing cards | 1 column | 2x2 grid | 4 columns |
| Waitlist form | Stacked | Inline | Inline |
| Footer | Stacked center | Row | Row |

---

## SEO & Meta Considerations

### Page Title
```
PlebTest - AI-Powered Idea Validation | Kill Duds. Find Winners.
```

### Meta Description
```
Stop building what nobody wants. PlebTest uses AI personas to challenge your startup assumptions with honest feedback—no cold calls required. Get your Kill, Pivot, or Build verdict in minutes.
```

### Open Graph
```
og:title: PlebTest - Kill Duds. Find Winners.
og:description: AI personas that challenge your assumptions, not confirm them.
og:image: /og-image.png (1200x630px)
og:type: website
```

### Structured Data
- Organization schema
- SoftwareApplication schema (when product launches)

---

## Implementation Priority

### Phase 1: Core Structure
1. Hero section (highest impact)
2. Waitlist CTA section (conversion critical)
3. Footer

### Phase 2: Value Proposition
4. Problem section
5. Solution section

### Phase 3: Details
6. How it works
7. Pricing preview

### Phase 4: Polish
8. Animations
9. SEO optimization
10. Performance tuning

---

## Files to Create/Modify

```
src/
  app/
    page.tsx                    # Main landing page
  components/
    landing/
      hero.tsx                  # Hero section
      problem-section.tsx       # Problem cards
      solution-section.tsx      # Solution + verdict cards
      how-it-works.tsx          # Process steps
      pricing-preview.tsx       # Pricing cards (coming soon)
      waitlist-cta.tsx          # Email capture form
      footer.tsx                # Footer
    ui/
      verdict-card.tsx          # Custom verdict display
      process-step.tsx          # How it works step
      section-label.tsx         # Section labeling
      waitlist-form.tsx         # Form component
```

---

## Copy Summary (All Text in One Place)

### Hero
- Badge: "For founders who hate cold calls"
- Headline: "Stop building what nobody wants."
- Subheadline: "PlebTest uses AI personas built to challenge your assumptions—not confirm them. Get honest feedback in minutes, not months of wasted building."
- CTA: "Join the Waitlist →"
- Note: "No credit card required • Get early access + founding member pricing"

### Problem
- Label: "THE PROBLEM"
- Headline: "42% of startups fail because nobody wanted what they built."
- Card 1: "Talking to strangers is painful" / "You know you should validate, but cold calling potential customers feels impossible. So you skip it."
- Card 2: "Months of building blind" / "You build features nobody asked for, pivot too late, and run out of runway before finding product-market fit."
- Card 3: "ChatGPT just tells you what you want to hear" / "Friends and AI assistants want to be nice. They confirm your assumptions instead of challenging them."

### Solution
- Label: "THE SOLUTION"
- Headline: "AI personas that push back, not flatter."
- Description: "PlebTest simulates real customer conversations with AI personas designed to challenge your assumptions. No sycophancy. No sugar-coating. Just the honest feedback you need to make the right call."
- Kill: "KILL" / "Stop now. Save your time."
- Pivot: "PIVOT" / "Good bones, wrong angle."
- Build: "BUILD" / "Green light. Ship it."
- Quote: "Unlike ChatGPT, our personas are built to find holes in your idea—not pat you on the back."

### How It Works
- Label: "HOW IT WORKS"
- Headline: "From idea to verdict in minutes."
- Step 1: "01" / "Describe your idea" / "Tell us about your product, target market, and what problem you're solving. No jargon required." / "2 minutes"
- Step 2: "02" / "Choose your validation mode" / "Quick Fire for fast gut checks, or Full Validation for deep-dive customer conversations." / "30 seconds"
- Step 3: "03" / "Face the personas" / "AI personas challenge your assumptions with real objections, skeptical questions, and honest reactions." / "5-15 minutes"
- Step 4: "04" / "Get your verdict" / "Kill, Pivot, or Build—with specific reasoning and actionable next steps." / "Instant"

### Pricing
- Label: "PRICING"
- Headline: "Simple pricing. No surprises."
- Subheadline: "Launching soon with founding member pricing."
- Note: "Join the waitlist for early access and founding member discounts."

### Waitlist CTA
- Headline: "Be first in line."
- Subheadline: "Join founders who want honest feedback, not flattery. Early access members get founding pricing locked in forever."
- Input placeholder: "Enter your email"
- Button: "Join Waitlist"
- Privacy: "No spam. Unsubscribe anytime. Read our privacy policy."

### Footer
- Brand: "PlebTest"
- Tagline: "Kill duds. Find winners."
- Links: "Privacy Policy | Terms of Service | Contact"
- Copyright: "© 2026 PlebTest. All rights reserved."

---

## Designer Notes

### Design Decisions Made

1. **Dark solution section**: Creates visual break, emphasizes the "answer" after presenting the problem
2. **Verdict card colors from brand**: Kill=Rose, Pivot=Amber, Build=Emerald - consistent with product UI
3. **Gradient CTA section**: Uses brand indigo-to-violet, creates urgency without being aggressive
4. **Coming soon overlay on pricing**: Honest about launch status, maintains trust
5. **Anti-sycophancy quote**: Directly addresses ChatGPT comparison, key differentiator
6. **Time badges on steps**: Addresses "how long does this take?" immediately
7. **No fake testimonials**: Brand voice demands honesty - will add real testimonials post-launch

### Trade-offs Considered

1. **Hero illustration vs. text-only**: Opted for text-first with optional illustration - copy does the heavy lifting, image enhances
2. **Pricing visible vs. hidden**: Showing prices builds trust, "coming soon" overlay manages expectations
3. **4 steps vs. 3**: Chose 4 for completeness - each step is distinct and valuable
4. **Single CTA vs. multiple**: Two CTAs (hero + bottom) - not too aggressive, but captures users at different scroll points

### For Developer

- All colors are from existing Tailwind/brand palette - no custom colors needed
- shadcn/ui components can be customized with Tailwind classes
- Form submission should integrate with Supabase waitlist table (per architecture.md)
- Consider using Framer Motion for scroll animations (already in Next.js ecosystem)
- Images can be placeholder until design assets are created
- Mobile-first implementation recommended
