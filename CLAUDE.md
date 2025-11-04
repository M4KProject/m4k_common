# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the `@common` shared library for the M4K project - a Git submodule providing reusable UI components, hooks, utilities, and device integration APIs. It contains **5,741 lines** of TypeScript/TSX across 35 files.

**Repository**: https://github.com/M4KProject/m4k_common.git

## Library Structure

### Core Directories

- `hooks/` - Custom Preact/React hooks for reactive state and async operations
- `components/` - Complete UI component library (18 production-ready components)
- `ui/` - UI utilities (theme system, responsive design, DOM helpers)
- `m4k/` - Android kiosk device integration (M4K Bridge, Fully Kiosk Browser APIs)
- `box/` - Declarative layout engine (legacy/work-in-progress, mostly commented)

## Key Architectural Patterns

### 1. Reactive State Management with Fluxio

All state management uses the **Fluxio** library's reactive message system:

```typescript
import { fluxStored, useFlux } from 'fluxio';

// Create reactive state with localStorage persistence
export const theme$ = fluxStored<Theme>('theme', defaultTheme);

// Subscribe in components (auto-reactive)
const theme = useFlux(theme$);

// Update from anywhere
theme$.set(newTheme);
```

**Key Hooks** (`hooks/`):
- `useFlux()` - Subscribe to Fluxio messages with automatic re-rendering
- `useFluxState()` - Get state and setter like useState
- `useFluxItem()` - Work with array items in flux messages
- `useAsync()` - Handle async data with optional localStorage persistence
- `usePromise()` - Generic promise handler with loading/error states

### 2. CSS-in-JS System

Custom Fluxio `Css` utility with powerful layout shortcuts:

```typescript
import { Css, useCss } from 'fluxio';

const css = Css('ComponentName', {
  '': {
    fCol: 1,                           // flex column
    p: 2,                              // padding: 2em
    bg: 'primary'                      // background: var(--primary-color)
  },
  'Header': {
    fRow: ['center', 'space-between'], // flex row with alignment
    w: 20,                             // width: 20em
    elevation: 2                       // box-shadow with depth
  }
});

export const Component = (props: Props) => {
  const c = useCss('ComponentName', css);
  return (
    <div {...props} {...c()}>
      <div {...c('Header')}>Content</div>
    </div>
  );
};
```

**CSS Utility Shortcuts:**

**Layout & Dimensions:**
- `x`, `y`, `xy` - positioning (em units)
- `w`, `h`, `wh` - width/height (em units)
- `wMin`, `hMin`, `wMax`, `hMax` - min/max dimensions
- `inset` - all sides positioning

**Flexbox:**
- `fRow: [align?, justify?]` - flex-direction: row with optional alignment
- `fCol: [align?, justify?]` - flex-direction: column with optional alignment
- `fCenter: [direction?]` - centered flex container

**Spacing:**
- `m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my` - margins (em units)
- `p`, `pt`, `pb`, `pl`, `pr`, `px`, `py` - padding (em units)

**Visual:**
- `bg: 'colorKey'` - background color from theme
- `fg: 'colorKey'` - text color from theme
- `elevation: 0-10` - box-shadow depth
- `rounded: number` - border-radius (× 0.2em)
- `fontSize`, `bold`, `opacity`

**Transform & Animation:**
- `scale`, `rotate`, `translate` - CSS transforms
- `transition: number | string` - CSS transitions
- `anim: AnimValue` - CSS animations with keyframes

**Background & Images:**
- `bgUrl: 'url'` - background-image
- `bgMode: 'contain' | 'cover' | 'fill'` - background-size
- `itemFit` - object-fit for media elements

### 3. Component Library Pattern

All components follow this structure:

```typescript
import { Css } from 'fluxio';
import { ComponentChildren } from 'preact';

const css = Css('ComponentName', { /* styles */ });

export interface ComponentProps extends DivProps {
  variant?: 'primary' | 'secondary';
  // component-specific props
}

export const Component = (props: ComponentProps) => {
  const { variant, children, ...rest } = props;
  const c = useCss('ComponentName', css);

  return (
    <div {...rest} {...c('', variant, props)}>
      {children}
    </div>
  );
};
```

**Pattern Notes:**
- Extend `DivProps` for HTML attributes
- Use `{...props}` first, then `{...c()}` to allow prop overrides
- Pass `props` to `c()` for conditional styling based on props
- Use Preact's `class` prop (not `className`)

## Component Library (`components/`)

### Form Components

**Field.tsx** - Multi-purpose form field with 13+ field types:
```typescript
<Field
  type="text" | "email" | "password" | "number" | "select" | "picker" |
       "switch" | "check" | "image" | "doc" | "date" | "datetime" | "seconds"
  label="Field Label"
  value={value}
  onChange={setValue}
  error={errorMessage}
  required={true}
  options={['Option 1', 'Option 2']} // for select/picker
/>
```

**Select.tsx** - Dropdown with search and keyboard navigation:
```typescript
<Select
  value={selected}
  onChange={setSelected}
  options={items}
  render={(item) => item.name}
/>
```

**Form.tsx** - Form wrapper component for grouping fields

### UI Components

**Button.tsx** - Flexible button with variants and states:
```typescript
<Button
  variant="primary" | "secondary" | "success" | "warn" | "error" | "upload"
  icon={LucideIcon}
  disabled={loading}
  onClick={handleClick}
>
  Button Text
</Button>
```

**Dialog.tsx** - Modal dialog system:
```typescript
import { showDialog } from '@common/components';

const result = await showDialog({
  title: 'Confirmation',
  message: 'Are you sure?',
  variant: 'confirm'
});
```

**Table.tsx** - Data table with row variants:
```typescript
<Table>
  <tr variant="success" | "error" | "selected">
    <td>Cell content</td>
  </tr>
</Table>
```

### Layout Components

**Page.tsx** - Page layout structure:
```typescript
<Page>
  <PageContainer>
    <PageSection>Section content</PageSection>
    <PageBody>Main content</PageBody>
  </PageContainer>
</Page>
```

**Grid.tsx** - Responsive grid layout
**Toolbar.tsx** - Action toolbar container
**Side.tsx** - Collapsible sidebar

### Utility Components

**Loading.tsx** - Loading spinner
**Progress.tsx** - Progress bar
**Tooltip.tsx** - Contextual tooltips
**Portal.tsx** - Render outside DOM hierarchy
**Iframe.tsx** - Iframe wrapper
**BackButton.tsx** - Navigation back button

### Other Components

**Picker.tsx** - Date/time picker modal
**Flag.tsx** - Country/language flag display
**Tr.tsx** - Translation/localization component

## UI Utilities (`ui/`)

### Theme System (`theme.ts`)

Dynamic color system with light/dark mode support:

```typescript
import { theme$ } from '@common/ui';

// Get current theme
const theme = useFlux(theme$);

// Toggle dark mode
theme$.set({ ...theme, dark: !theme.dark });
```

**Color Palette:**
- Base: `w0-w3` (white), `g0-g3` (grey), `b0-b3` (background), `t0-t3` (text)
- Primary: `p0-p9` (primary scale)
- Secondary: `s0-s9` (secondary scale)
- Semantic: `success`, `error`, `warn`

**Theme Storage:** Persisted to localStorage via `theme$` flux message

### Responsive Design (`responsive.ts`)

Breakpoint system and dynamic font sizing:

```typescript
import { responsive$ } from '@common/ui';

const { breakpoint, fontSize } = useFlux(responsive$);
// breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
```

### Font Loading (`addFont.ts`)

Load custom fonts from M4K font server:

```typescript
import { addFont } from '@common/ui';

addFont('FontName'); // Loads from https://fonts.m4k.fr/
```

### Other Utilities

- `clipboard.ts` - Copy/paste operations
- `imgResize.ts` - Image resizing utilities
- `toImg.ts` - Convert content to image
- `startDownload.ts` - Trigger file downloads
- `swClear.ts` - Clear service worker cache
- `autoHide.ts` - Auto-hide UI after inactivity

## M4K Kiosk Integration (`m4k/`)

Bridge to Android kiosk device APIs with progressive fallback:

```typescript
import { m4k } from '@common/m4k';

// Logging
m4k.d('Debug message');
m4k.i('Info message');
m4k.w('Warning message');
m4k.e('Error message');

// Event subscription
m4k.subscribe((event) => {
  console.log('Device event:', event);
});

// Signal events
m4k.signal({ type: 'custom', data: {} });

// Device control (if supported)
m4k.exec('command'); // Execute shell command
m4k.readFile('path'); // Read file
m4k.writeFile('path', 'content'); // Write file
```

**Supported Platforms:**
1. **M4K Bridge** - Native Android bridge via `window._m4k`
2. **Fully Kiosk Browser** - Full API integration via `window.fully`
3. **Base** - Fallback implementation for web browsers

**Key Files:**
- `m4k.ts` - Main entry point with auto-detection
- `m4kBridge.ts` - Native M4K bridge integration
- `m4kFully.ts` - Fully Kiosk Browser integration
- `m4kBase.ts` - Fallback for non-kiosk environments
- `fullyInterfaces.ts` - Complete Fully API type definitions (39KB)

## Custom Hooks (`hooks/`)

### State Management Hooks

**useFlux()** - Subscribe to Fluxio messages:
```typescript
const value = useFlux(message$);
// Auto re-renders when message$ changes
```

**useFluxState()** - State and setter like useState:
```typescript
const [value, setValue] = useFluxState(message$);
```

**useFluxItem()** - Work with array items:
```typescript
const [item, setItem] = useFluxItem(arrayMessage$, index);
```

### Async Data Hooks

**useAsync()** - Async data loading with localStorage:
```typescript
const [data, reload, message$] = useAsync(
  'storageKey',
  async () => fetchData(),
  dependencies
);
```

**usePromise()** - Generic promise handler:
```typescript
const [value, error, isLoading, refresh] = usePromise(
  async () => fetchData(),
  dependencies
);
```

**useAsyncEffect()** - Async useEffect with cleanup:
```typescript
useAsyncEffect(async () => {
  await fetchData();
}, dependencies);
```

### Utility Hooks

**useAnimState()** - Animation state management
**useInterval()** - Recurring intervals with cleanup
**useTimeout()** - Timeouts with cleanup
**useConstant()** - Create render-persistent constants
**useTr()** - Translation/localization

## Development Guidelines

### Code Patterns

**Component Creation:**
- Always use `Css()` for styling with the custom utility system
- Extend `DivProps` for HTML attribute support
- Use `class` prop (not `className`) for Preact compatibility
- Import from `preact/hooks`, not React

**State Management:**
- Use Fluxio messages for all shared state
- Prefer `useFlux()` over direct `.get()` calls
- Store persistent state with `fluxStored(key, defaultValue)`

**Type Safety:**
- Use TypeScript for all files
- Define proper interfaces for component props
- Leverage `ComponentChildren` from Preact for children props

### Import Patterns

```typescript
// Hooks (use Preact, not React)
import { useState, useEffect } from 'preact/hooks';
import { useFlux, useCss } from 'fluxio';

// Components
import { Button, Field, Dialog } from '@common/components';

// UI utilities
import { theme$, addFont } from '@common/ui';

// M4K integration
import { m4k } from '@common/m4k';
```

### Styling Best Practices

**Prefer CSS utilities over raw CSS:**
```typescript
// Good
const css = Css('Component', {
  '': { fCol: 1, p: 2, bg: 'primary' }
});

// Avoid
const css = Css('Component', {
  '': {
    display: 'flex',
    flexDirection: 'column',
    padding: '2em',
    backgroundColor: 'var(--primary-color)'
  }
});
```

**Use theme colors:**
```typescript
// Good - uses theme system
{ bg: 'primary', fg: 'text' }

// Avoid - hardcoded colors
{ backgroundColor: '#3498db', color: '#000' }
```

**Responsive values:**
```typescript
// Arrays for responsive values
{
  w: [20, 30, 40],     // xs, sm, md+
  p: [1, 2],           // xs-sm, md+
}
```

## Git Submodule Management

This library is included as a Git submodule in parent projects:

**Update submodule:**
```bash
cd common
git pull origin main
cd ..
git add common
git commit -m "Update common submodule"
```

**Clone parent project with submodules:**
```bash
git clone --recurse-submodules <parent-repo-url>
```

**Initialize submodules in existing clone:**
```bash
git submodule update --init --recursive
```

## Usage in Parent Projects

**Path Alias Configuration** (in parent's `vite.config.ts` or `tsconfig.json`):
```typescript
resolve: {
  alias: {
    '@common': path.resolve(__dirname, './common'),
  }
}
```

**Import Pattern:**
```typescript
import { Button, Field } from '@common/components';
import { useFlux, useAsync } from '@common/hooks';
import { theme$, addFont } from '@common/ui';
import { m4k } from '@common/m4k';
```

## External Dependencies

**Required peer dependencies:**
- `fluxio` - Reactive state management and CSS-in-JS utilities
- `preact` - UI framework (with React compatibility)
- `preact/hooks` - Hooks API
- `lucide-react` - Icon library

**Note:** Parent projects must install these dependencies. The common library itself has no `package.json` as it's consumed directly via path imports.
