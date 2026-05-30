# CSE445 Dashboard Design Guide

## Design Direction

The dashboard should feel like an academic course portal: structured, calm, credible, and easy to scan. It should look closer to a modern syllabus, course handbook, or university learning resource than a marketing landing page or generic SaaS dashboard.

Core qualities:

- Academic and institutional
- Quiet, readable, and content-first
- Structured around lectures, labs, outcomes, assessment, and references
- Restrained use of color
- Clear section hierarchy with strong alignment
- Useful on repeated visits, not just impressive on first view

## Visual Language

Use a paper-like page background with white content surfaces and soft borders.

Primary colors:

- Academic blue: `#16324f`
- Burgundy accent: `#8a1538`
- Canvas: `#f7f8fb`
- Surface: `#ffffff`
- Border: `#d7dde6`
- Ink: `#172033`
- Muted text: `#667085`

Course outcome colors should be muted and functional, not neon:

- CO1 teal: `#0f766e`
- CO2 blue: `#2563eb`
- CO3 violet: `#7c3aed`
- CO4 amber: `#b45309`
- Advanced orange: `#c2410c`

## Layout Rules

Use `max-w-7xl mx-auto px-4` for major content pages so the application has one consistent content width.

Prefer full-width sections and clean content bands over nested cards. Cards are appropriate for repeated items like modules, outcomes, lab previews, and reference panels.

Cards should usually use:

- `rounded-lg`
- `border border-[var(--border)]`
- `bg-[var(--surface)]`
- restrained hover states such as border color changes

Avoid overly rounded pills, bright gradients, decorative blobs, or large visual effects.

## Header

The header should feel like a university course system.

Current direction:

- Left identity uses a graduation icon and course code.
- Subtitle says `Computer Vision`.
- Navigation uses an underline-style active state with burgundy accent.
- Header height is slightly taller and more formal than a compact app toolbar.

Avoid turning the header into a marketing navbar.

## Hero

The homepage hero should read like a course brief.

It should include:

- Course code
- Course title
- Short academic description
- Instructor block
- Department and university under the instructor name
- Course information panel with term, credits, contact hours, and prerequisite
- Simple action buttons for Lectures, Lab Manual, Assessment, and Resources

Avoid decorative SVG backgrounds, large stats strips, gradient hero effects, or excessive badges.

## Section Style

Dashboard sections should use a consistent academic header pattern:

- Small uppercase label in burgundy accent
- Main section title
- Thin bottom border

Examples:

- `Theory sequence` / `Course Modules`
- `Practical sequence` / `Lab Manual`
- `Outcome mapping` / `Course Outcomes`
- `Assessment structure` / `Marks Distribution`
- `Reference desk` / `Teaching Materials & Tools`

## Module Cards

Module cards should feel like course outline entries.

Use:

- Flat white surface
- Top accent border for module color
- Module code badge
- Week range
- Lecture count
- Short description
- Course outcome chips
- Study progress line

The card should be useful and readable, not decorative.

## Outcome Cards

Outcome cards should feel like accreditation or syllabus blocks.

Use:

- Left accent border
- CO badge
- PO text
- Outcome title
- Description
- Domain chips and knowledge profile

Keep the outcome text readable and avoid over-coloring the entire card.

## Assessment

Assessment should feel like an academic marks breakdown.

Use institutional chart colors and simple rows with dividers. The chart should support the information, not dominate the section.

## Typography

Use `"Segoe UI", system-ui, sans-serif`.

Headings should be strong but not oversized except in the hero. Body text should remain comfortable and practical for course reading.

Do not use viewport-scaled font sizes.

## Interaction

Hover states should be quiet:

- Border color changes
- Text color changes
- Subtle background shifts

Avoid heavy shadows, animated motion, or playful interaction effects unless they directly improve usability.

## Design Test

When adding a new page or component, ask:

- Does it feel like part of a university course portal?
- Is the content easier to scan?
- Are colors used to organize information rather than decorate?
- Does it match the `max-w-7xl` content rhythm?
- Would this still feel appropriate after repeated use by students?
