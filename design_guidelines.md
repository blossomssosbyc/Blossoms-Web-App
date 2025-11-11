# Blossoms Event Platform - Design Guidelines

## Design Approach

**Selected Approach:** Hybrid - Modern Tech Platform with Academic Excellence
- Primary inspiration: Linear's precision + Notion's interactivity + Vercel Analytics' data visualization
- Balance: Professional academic credibility with vibrant event energy
- Key principle: "Science meets celebration" - clean, modern, data-driven with moments of delight

## Typography System

**Font Stack:**
- Headings: Inter (700, 600) - clean, modern, professional
- Body: Inter (400, 500) - excellent readability for data-heavy content
- Data/Numbers: JetBrains Mono (500) - for statistics, metrics, and technical displays

**Hierarchy:**
- Hero headlines: text-5xl md:text-7xl font-bold
- Section headings: text-3xl md:text-4xl font-semibold
- Card titles: text-xl font-semibold
- Body text: text-base leading-relaxed
- Captions/labels: text-sm

## Layout System

**Spacing Units:** Tailwind 4, 6, 8, 12, 16, 24
- Component padding: p-6 to p-8
- Section spacing: py-16 md:py-24
- Card gaps: gap-6 to gap-8
- Container max-width: max-w-7xl

**Grid Strategy:**
- Dashboard: 2-column on tablet (md:grid-cols-2), 3-column on desktop (lg:grid-cols-3) for stat cards
- Gallery: Masonry-style grid with varying heights (grid-cols-2 md:grid-cols-3 lg:grid-cols-4)
- Events Timeline: Single column with alternating left/right layout on desktop
- Report Builder: 2-column split (tools sidebar + preview canvas)

## Component Library

### Navigation
Top navbar with glassmorphism effect (backdrop-blur-lg bg-white/80), sticky positioning, includes university logo, "Blossoms 2024", navigation links, and CTA for report generation

### Home Page
- Hero: Full-width with large background image of campus/science event, overlay gradient, centered content with event title "Blossoms 2024", tagline, date/location, dual CTAs (primary: "View Events", secondary: "Generate Report")
- Stats section: 4-column grid showcasing total participants, events, departments, days with animated counters
- Quick links: Card grid to major sections with hover lift effects
- Upcoming highlights: Horizontal scroll cards with event previews

### Report Generation
- Sidebar: Fixed width (w-80) with sections for data selection (checkboxes), chart types (radio buttons), layout options (toggle switches)
- Canvas area: Live preview with draggable/droppable components showing real-time updates
- Top toolbar: Export options, save template, reset buttons
- Component cards: Bordered cards (border-2) with grab handles, preview thumbnails

### Gallery
- Masonry grid with images of varying aspect ratios
- Lightbox overlay: Full-screen modal with blur backdrop, navigation arrows, image caption, close button
- Filter bar: Pill-style buttons for categories (All, Competitions, Workshops, Cultural, Sports)
- Each image card: Hover overlay with event name and date

### Points Dashboard
- Header: Class selector (tabs or segmented control) to switch between BCA, BSc CM, M.DS, MS AI&CS, B.EMS
- Stat cards: Large metric displays with icon, number, label, and trend indicator (up/down arrow with percentage)
- Chart section: Mix of bar charts (class comparison), line charts (points over time), pie charts (category breakdown)
- Leaderboard table: Alternating row colors, sortable columns, highlight top 3 with badges

### Events Timeline
- Vertical timeline with center line
- Event cards alternating left/right from center axis
- Cards include: Date badge, event title, description, location, participant count
- Past events: Reduced opacity, checkmark indicator
- Current event: Highlighted with glow effect
- Upcoming: Normal state with countdown timer

### Interactive Elements
- Hover states: Subtle scale (scale-105), shadow elevation (shadow-lg to shadow-xl)
- Active states: Scale down slightly (scale-98)
- Loading: Skeleton screens with shimmer animation
- Transitions: transition-all duration-300 ease-in-out
- Micro-interactions: Number count-up animations, progress bars with gradients, tooltip pop-ins

### Cards & Containers
- Primary cards: Rounded borders (rounded-xl), subtle shadow (shadow-md), padding p-6
- Glassmorphism effects for overlays: backdrop-blur-lg bg-white/90
- Stat cards: Larger padding (p-8), border accent on hover (border-l-4)

### Buttons
- Primary: Larger size (px-8 py-3), rounded-lg, font-semibold
- Secondary: Outlined variant with border-2
- Icon buttons: Square (w-10 h-10), rounded-lg, centered icon
- Buttons on images: Backdrop blur (backdrop-blur-md bg-white/20), border (border-2 border-white/40)

## Images

**Hero Image:** Large, high-quality image of Christ University campus or science event (students in lab coats, colorful experiments, campus architecture). Should convey energy and academic excellence. Positioned as background with gradient overlay (from-black/60 to-transparent).

**Gallery Images:** Event photography including competitions, workshops, cultural performances, award ceremonies. Mix of candid and staged shots. Minimum 20-30 placeholder images across categories.

**Supporting Imagery:** Icons for department logos (BCA, BSc CM, etc.), event category icons, achievement badges for leaderboard.

## Animations

Use sparingly and purposefully:
- Page transitions: Fade-in on mount
- Number animations: Count-up for statistics
- Chart animations: Staggered entry (bars appearing sequentially)
- Scroll reveals: Fade-up for timeline events
- NO complex scroll-triggered animations or parallax effects

## Accessibility

- Keyboard navigation for all interactive elements
- Focus indicators (ring-2 ring-offset-2)
- Proper heading hierarchy (h1 → h6)
- ARIA labels for icon buttons and data visualizations
- Color contrast ratio minimum 4.5:1 for text
- Alt text for all images

---

**Design Philosophy:** Create a modern, data-rich platform that celebrates academic achievement while maintaining the energy and excitement of a university event. Every interaction should feel responsive and intentional, with data visualization that's both informative and visually compelling.