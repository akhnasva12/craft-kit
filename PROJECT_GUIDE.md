# Craft Kit - Complete Project Guide

## Overview
**Craft Kit** is a premium frontend toolkit showcasing design primitives like icons, grids, colors, shadows, and motion. It's built with React 19, Vite, Framer Motion for animations, and uses React Router for navigation.

---

## 📌 User Journey: From Landing to Interaction

### Step 1: User Lands on Your Site
```
Browser loads: http://localhost:5173 (or production URL)
         ↓
   index.html loads (HTML entry point)
         ↓
   Browser finds <div id="root"></div>
         ↓
   React app mounts via src/main.jsx
```

### Step 2: React App Initialization (main.jsx)
The app boots up in this order:

1. **React Root Created**: `createRoot(document.getElementById('root'))`
2. **Providers Wrap the App**:
   - `<StrictMode>` - Development mode checks for bugs
   - `<BrowserRouter>` - Enables URL routing (React Router)
   - `<ThemeProvider>` - Manages dark/light theme globally
3. **Fonts Load** - Self-hosted fonts (Bebas, DM Mono, Inter, Fraunces)
4. **Styles Load** - Global SCSS from `src/scss/main.scss`
5. **App Component Renders**

---

## 🏗️ Architecture Layers

### Layer 1: Global Setup (Context)
**File**: `src/context/ThemeContext.jsx`

```javascript
// Stores theme state globally (dark/light)
const { theme, toggleTheme } = useTheme();

// Persists to localStorage
localStorage.getItem('craft-theme') // stored value

// Updates DOM attribute
document.documentElement.setAttribute('data-theme', theme)
```

**When user clicks theme toggle button:**
```
Navbar Theme Button Click
         ↓
toggleTheme() called
         ↓
theme state changes
         ↓
useEffect runs → localStorage updated
         ↓
DOM gets data-theme attribute
         ↓
CSS variables adjust (dark/light colors)
```

### Layer 2: Routing (App.jsx)
**File**: `src/App.jsx`

The main app handles routing and page animations:

```
App Structure:
├── grain (background effect, hidden)
├── ScrollProgress (top progress bar)
├── Navbar (header + theme toggle + mobile menu)
├── ScrollToTop (utility component - scrolls to top on page change)
├── AnimatePresence (Framer Motion - enables exit animations)
│   └── Routes (React Router - renders page based on URL)
│       ├── Route "/" → Home page
│       ├── Route "/icons" → Icons page
│       ├── Route "/grids" → Grids page
│       ├── Route "/colors" → Colors page
│       ├── Route "/shadows" → Shadows page
│       ├── Route "/motion" → Motion page
│       └── Route "*" → 404 Not Found page
├── Footer
└── BackToTop (button to scroll to top)
```

**Key Flow - Navigation**:
```
User clicks "Icons" link in Navbar
         ↓
React Router detects URL change (/icons)
         ↓
AnimatePresence triggers EXIT animation (old page)
         ↓
New Route renders with PageTransition wrapper
         ↓
PageTransition ENTER animation plays
         ↓
Icons page displays
```

### Layer 3: Layout Components
**Files**: `src/components/layout/`

#### Navbar.jsx
- **Top bar** with logo, navigation links, theme toggle
- **Mobile menu** (hamburkger) for smaller screens
- Prevents body scroll when menu is open
- Uses NavLink with active states

#### PageTransition.jsx
```javascript
// Wraps each page with Framer Motion animation
initial={{ opacity: 0, y: 18 }}      // Page enters from below, invisible
animate={{ opacity: 1, y: 0 }}       // Fades in, slides up
exit={{ opacity: 0, y: -12 }}        // Fades out, slides up when leaving
```

#### Footer.jsx
- Bottom navigation/info section
- Consistent across all pages

#### ScrollProgress.jsx
- Horizontal progress bar showing scroll position
- Updates as user scrolls down page

#### BackToTop.jsx
- Floating button
- Smooth scroll to top when clicked

### Layer 4: Pages
**Files**: `src/pages/`

Each page is a full-screen section showcasing different design primitives:

#### Home.jsx
```javascript
SECTIONS:
1. Hero Section
   - Title animation: "Build.", "Craft it.", "Ship fast."
   - Two animated orbs (background)
   - Features showcase

2. Modules Grid
   - 5 cards linking to: Icons, Grids, Colors, Shadows, Motion
   - Hover effects
   - Click → navigate to page

3. Features Section
   - Copy-paste ready
   - Themeable by default
   - Accessible foundations

4. Marquee (scrolling text animation)
   - Keywords: Icons, Grids, Colors, etc.
```

#### Icons.jsx (Example of Complex Page)
```javascript
FLOW:
1. Load icon libraries from Iconify API
2. Display dropdown to select library (Lucide by default)
3. Search bar filters icons in real-time
4. Category filter (All, Shapes, Navigation, etc.)
5. Show icons in grid (120 per page, lazy load more)
6. Click icon → Copy SVG code → Toast notification
```

**Key Hook Used**: `useClipboard()`
```javascript
const { copy, copiedValue } = useClipboard();

// When user clicks an icon:
copy(svgCode, 'Icon copied!')
         ↓
Toast shows "Icon copied!"
         ↓
After 1.6 seconds → Toast disappears
```

#### Colors.jsx, Grids.jsx, Shadows.jsx, Motion.jsx
- Similar pattern: showcase design tokens
- Copy-to-clipboard functionality
- Visual previews

#### NotFound.jsx (404)
- Displays when user goes to invalid route

---

## 🎨 Styling System

**File Structure**: `src/scss/`

```
main.scss (imports all)
├── base/
│   ├── _reset.scss (browser resets)
│   ├── _utilities.scss (global utility classes)
│   └── _variables.scss (CSS custom properties)
├── mixins/
│   └── _mixins.scss (reusable SCSS mixins)
└── themes/
    └── _themes.scss (dark/light theme definitions)
```

**CSS Variables (Theme Tokens)**:
```css
/* Set on <html> element */
[data-theme="dark"] {
  --bg: #0a0a0a;
  --fg: #ffffff;
  --accent: #61a8db;
}

[data-theme="light"] {
  --bg: #ffffff;
  --fg: #0a0a0a;
  --accent: #2563eb;
}
```

**Component Styles**: Each component has `.module.scss`
```javascript
// Navbar.module.scss scoped to Navbar component only
import styles from './Navbar.module.scss';
<header className={styles.nav}>  // Unique class name, no conflicts
```

---

## ⚙️ Utilities & Hooks

### Custom Hooks

#### useClipboard.js
```javascript
const { copy, copiedValue } = useClipboard(timeout = 1600);

copy(text, label)  // Copies text to clipboard
// Returns: { copy: function, copiedValue: current copied text or null }
```

#### useLocalArray.js
- Manages array state in localStorage
- Persist data across page reloads

### Utility Libraries

#### icons.js
- Fetches icons from Iconify API
- Searches and filters icons
- Categorizes icons

#### gridBuilder.js
- Generates grid/layout tokens

#### color.js
- Color manipulation utilities

#### motionPresets.js
- Framer Motion animation presets

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| **react** | UI framework |
| **react-router-dom** | Client-side routing |
| **framer-motion** | Smooth animations & transitions |
| **@iconify/react** | Icon library |
| **react-icons** | Alternative icon set (lucide-react) |
| **sass** | CSS preprocessing |
| **react-intersection-observer** | Detect when elements enter viewport (reveal animations) |
| **@fontsource-variable/*** | Self-hosted fonts (no CDN) |

---

## 🎬 Animation System

### Framer Motion Usage

**1. Page Transitions**
```javascript
<AnimatePresence mode="wait">  // Wait for exit before enter
  <PageTransition>
    <Page />
  </PageTransition>
</AnimatePresence>
```

**2. Component Reveal (Intersection Observer)**
```javascript
<Reveal>
  Content animates in when visible
</Reveal>
```

**3. Counter Animation**
```javascript
<Counter to={100} />  // Animated number counter
```

---

## 🔄 Complete User Flow Example: Copying an Icon

```
1. User lands on Home page
   App renders with PageTransition animation

2. User clicks "Icons" in navbar
   ScrollToTop fires
   PageTransition exit animation
   Icons page loads with enter animation
   Icon libraries load from Iconify API

3. User types in search box
   Icons list updates in real-time
   Category filters also work

4. User clicks on an icon
   useClipboard hook runs:
     → copy(svgCode, 'Icon copied!')
     → copiedValue state updates
     → Toast component shows
   Toast auto-dismisses after 1.6 seconds

5. User clicks theme toggle
   toggleTheme() fires
   Theme state updates in Context
   useEffect runs:
     → localStorage updates
     → document.documentElement.setAttribute('data-theme', newTheme)
   All CSS variables switch colors instantly
   No page reload needed

6. User navigates back to Home
   Same transition flow happens again
```

---

## 📁 File Structure Summary

```
craft-kit/
├── index.html                    # Entry HTML
├── vite.config.js               # Vite build config
├── package.json                 # Dependencies
│
├── public/                       # Static assets
│
└── src/
    ├── main.jsx                  # React boot (providers, fonts, styles)
    ├── App.jsx                   # Main routes & layout
    │
    ├── context/
    │   └── ThemeContext.jsx      # Global theme state
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.jsx        # Header + navigation
    │   │   ├── Footer.jsx        # Footer
    │   │   └── PageTransition.jsx # Page animation wrapper
    │   │
    │   └── ui/                   # Reusable UI components
    │       ├── ScrollProgress.jsx
    │       ├── BackToTop.jsx
    │       ├── Reveal.jsx        # Intersection observer animation
    │       ├── Counter.jsx       # Animated number
    │       ├── PageHero.jsx      # Hero section template
    │       ├── BlockPreview.jsx  # Preview card
    │       ├── Toast.jsx         # Toast notifications
    │       └── ...
    │
    ├── pages/
    │   ├── Home.jsx              # Landing page
    │   ├── Icons.jsx             # Icon library showcase
    │   ├── Grids.jsx             # Grid system showcase
    │   ├── Colors.jsx            # Color tokens
    │   ├── Shadows.jsx           # Shadow tokens
    │   ├── Motion.jsx            # Animation presets
    │   └── NotFound.jsx          # 404 page
    │
    ├── hooks/
    │   ├── useClipboard.js       # Copy to clipboard
    │   └── useLocalArray.js      # localStorage array state
    │
    ├── lib/
    │   ├── icons.js              # Icon fetching logic
    │   ├── gridBuilder.js        # Grid utilities
    │   ├── color.js              # Color utilities
    │   └── motionPresets.js      # Animation presets
    │
    └── scss/
        ├── main.scss             # Global import
        ├── base/                 # Resets, utilities, variables
        ├── mixins/               # SCSS mixins
        └── themes/               # Dark/light theme definitions
```

---

## 🚀 Development Workflow

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Hot Module Replacement (HMR)
- Edit any `.jsx` or `.scss` file
- Changes appear instantly in browser
- State preserved if possible

---

## 🎯 Key Concepts to Master

1. **Context API** - Global state (theme) without prop drilling
2. **React Router** - Client-side navigation without page reloads
3. **Framer Motion** - Smooth page transitions and animations
4. **SCSS Modules** - Scoped styling prevents name conflicts
5. **Custom Hooks** - Reusable logic (clipboard, localStorage)
6. **Intersection Observer** - Trigger animations when elements enter viewport
7. **CSS Variables** - Dynamic theming system

---

## 🔍 Tracing a Feature: How Theme Toggle Works

```
Navbar.jsx (component)
   ↓
<button onClick={toggleTheme}>
   ↓
ThemeContext.jsx (toggleTheme function)
   ↓
setTheme(t => t === 'dark' ? 'light' : 'dark')
   ↓
useEffect runs [theme dependency]
   ↓
document.documentElement.setAttribute('data-theme', theme)
localStorage.setItem('craft-theme', theme)
   ↓
CSS in _themes.scss reads [data-theme] attribute
   ↓
Colors change instantly via CSS variables
   ↓
All components using CSS variables update automatically
```

---

## 💡 Pro Tips

1. **Add a new page?** Create in `src/pages/`, import in `App.jsx`, add route
2. **Create new component?** Put in `src/components/`, use SCSS modules for styles
3. **Add global animation?** Edit `motionPresets.js`, import where needed
4. **Change colors?** Edit `src/scss/themes/_themes.scss`
5. **Add localStorage data?** Use `useLocalArray()` hook
6. **Copy functionality?** Use `useClipboard()` hook

---

## 🧪 Testing the Flow

1. **Theme Toggle**: Click sun/moon icon → Colors change instantly
2. **Navigation**: Click page links → Smooth page transition animation
3. **Mobile**: Resize browser → Navbar menu appears
4. **Copy**: Click icon on Icons page → Toast appears
5. **Scroll**: Scroll down → Top bar shows progress → Click up arrow to jump to top

---

This is your complete mental model. Every user interaction flows through these layers! 🎉
