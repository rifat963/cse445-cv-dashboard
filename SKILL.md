---
name: academic-course-portal-design
description: Recreate the calm academic course portal design language from the CSE445 Computer Vision dashboard in another website or app. Use when Codex needs to design or restyle a syllabus, course dashboard, university resource portal, lab manual, lecture site, assessment page, instructor profile, or structured educational website with institutional colors, readable cards, course navigation, dark mode tokens, and Tailwind-style implementation patterns.
---

# Academic Course Portal Design

## Goal

Build a structured, credible, content-first academic portal. The result should feel like a modern university course handbook or learning resource, not a marketing landing page or generic SaaS dashboard.

Prioritize:

- Clear hierarchy for lectures, labs, tutorials, outcomes, assessments, and resources
- Repeated-use readability over visual spectacle
- Institutional colors used for structure, not decoration
- Calm surfaces, soft borders, restrained hover states
- Dense but comfortable academic information layouts

## Design Tokens

Use CSS variables so the design ports cleanly across frameworks.

```css
:root {
  --canvas: #f7f8fb;
  --surface: #ffffff;
  --surface-2: #eef2f6;
  --border: #d7dde6;
  --ink: #172033;
  --muted: #667085;
  --academic: #16324f;
  --accent: #8a1538;
  --co1: #0f766e;
  --co2: #2563eb;
  --co3: #7c3aed;
  --co4: #b45309;
  --advanced: #c2410c;
}

.dark {
  --canvas: #0f141b;
  --surface: #161c25;
  --surface-2: #202936;
  --border: #303947;
  --ink: #edf2f7;
  --muted: #a7b0bf;
  --academic: #9fc5e8;
  --accent: #f0a6bd;
}
```

Use `"Segoe UI", system-ui, sans-serif`. Do not use viewport-scaled font sizes or negative letter spacing.

## Page Layout

Use one consistent content rhythm:

```tsx
<main className="bg-[var(--canvas)] text-[var(--ink)]">
  <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
    ...
  </div>
</main>
```

Use `max-w-7xl mx-auto px-4` for major pages. Prefer full-width sections and clean content bands over nested cards. Cards are for repeated items, side panels, modals, or clearly framed tools.

## Header Pattern

Create a sticky institutional header:

- Height about `h-16`
- `border-b border-[var(--border)]`
- `bg-[var(--surface)]/95 backdrop-blur-sm`
- Left identity: square academic-blue icon block, course/site code, small muted subtitle
- Desktop nav: horizontal links with `border-b-2`; active state uses `border-[var(--accent)]`
- Dropdowns for grouped content such as Lectures, Lab Manual, Tutorials
- Mobile nav: stacked links, nested grouped links with left border

Use lucide icons when available, especially `GraduationCap`, `BookOpen`, `FlaskConical`, `Award`, `Library`, `ChevronDown`, `Menu`, and `X`.

## Hero Pattern

For a course or resource homepage, make the hero a course brief:

- White/surface band with bottom border
- Two-column desktop grid: main text plus information panel
- Small academic label, large but restrained title, muted description
- Instructor/context blocks with left borders
- Action buttons for primary course areas
- Side panel with definition-list facts such as term, credits, contact hours, prerequisite

Use:

```tsx
<section className="border-b border-[var(--border)] bg-[var(--surface)]">
  <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
      ...
    </div>
  </div>
</section>
```

Avoid decorative SVG backgrounds, gradient heroes, floating blobs, oversized stats strips, or marketing-style split hero cards.

## Section Headers

Use a consistent academic section header:

```tsx
<div className="mb-4 border-b border-[var(--border)] pb-3">
  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
    Theory sequence
  </p>
  <h2 className="text-xl font-bold text-[var(--ink)]">Course Modules</h2>
</div>
```

Good eyebrow/title pairs:

- `Theory sequence` / `Course Modules`
- `Practical sequence` / `Lab Manual`
- `Outcome mapping` / `Course Outcomes`
- `Assessment structure` / `Marks Distribution`
- `Reference desk` / `Teaching Materials & Tools`

## Card System

Base card:

```tsx
className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5"
```

Use `rounded-lg`, not oversized rounded corners. Use soft borders more often than shadows. Hover states should be quiet:

```tsx
className="transition-colors hover:border-[var(--academic)] hover:text-[var(--academic)]"
```

Module cards:

- `border-t-4` accent color by category
- Small monospaced code badge
- Title, concise description, count/sidebar stat
- Outcome chips
- Progress row with thin progress bar

Outcome cards:

- `border-l-4` accent color
- CO badge and PO text in the header row
- Readable title and description
- Bottom metadata row with small chips

Resource/reference cards:

- Use plain white surfaces, small icons, clear labels, muted descriptions
- Do not over-color full cards

## Color Usage

Use `--academic` for primary identity and main actions. Use `--accent` for active nav underline and section eyebrows. Use outcome colors only to categorize learning outcomes, modules, tutorials, or assessment groups.

Outcome badge pattern:

```tsx
const badge = "rounded border px-2 py-0.5 text-xs font-bold";
const co1 = "text-co1 border-co1/30 bg-co1/5";
```

Avoid one-note palettes, bright neon colors, heavy gradients, and decorative color fields.

## Buttons And Links

Primary button:

```tsx
className="inline-flex items-center gap-2 rounded-md bg-[var(--academic)] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
```

Secondary button:

```tsx
className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--surface-2)]"
```

Use icon plus text for clear navigation actions. Keep labels short and practical.

## Data-Dense Panels

For course facts and academic metadata, use definition lists or divided rows:

```tsx
<dl className="divide-y divide-[var(--border)]">
  <div className="grid grid-cols-[92px_1fr] gap-3 py-3 text-sm">
    <dt className="text-[var(--muted)]">Credits</dt>
    <dd className="font-medium text-[var(--ink)]">4 (3T + 1L)</dd>
  </div>
</dl>
```

For assessment breakdowns, pair a simple chart with rows, dividers, small color squares, and thin progress bars. The chart supports the information; it should not dominate the page.

## Responsive Behavior

- Collapse content grids to one column on mobile
- Keep cards readable with stable padding and line height
- Turn desktop nav into a stacked mobile drawer/list
- Avoid text overlap by using `min-w-0`, `flex-wrap`, and concise labels
- Use `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` for repeated course items

## Interaction Rules

Use:

- Border color changes
- Text color changes
- Subtle background shifts
- Dropdown opacity/translate transitions

Avoid:

- Heavy shadows
- Large animation
- Decorative motion
- Playful effects that reduce academic credibility

## Implementation Checklist

Before finishing a page or component, verify:

- The page feels like a university course portal or academic resource
- Main content uses `max-w-7xl mx-auto px-4`
- Section headers use eyebrow, title, and bottom border
- Cards use surface, border, restrained radius, and useful metadata
- Colors organize content rather than decorate it
- Dark mode works through variables
- Mobile layout is readable and has no overlapping text
- Repeated users can scan the page quickly
