# Hydration Error Prevention Guide

## What are Hydration Errors?

Hydration errors occur when the HTML generated on the server doesn't match what React renders on the client. This commonly happens with:

1. **Time-based calculations** - Server renders at time T1, client hydrates at time T2
2. **Browser-only APIs** - Using `window`, `document`, `localStorage` during SSR
3. **Random values** - `Math.random()`, `Date.now()` called during render
4. **Third-party libraries** - Libraries that assume browser environment

## Fixes Applied

### 1. Time Display Components

**Problem**: Components calculating elapsed time show different values on server vs client.

**Solution**: 
- Added `mounted` state to defer time calculations until after hydration
- Added `suppressHydrationWarning` to time display elements
- Time updates only start after component is mounted on client

**Files Modified**:
- `src/components/timer/time-display.tsx`
- `src/components/timer/global-timer-bar.tsx`
- `src/components/projects/project-card.tsx`
- `src/components/features/feature-row.tsx`

### 2. Implementation Pattern

```tsx
// ✓ CORRECT - Defer client-only calculations
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

useEffect(() => {
  if (!mounted) return; // Skip until hydrated
  
  // Client-only logic here
  const interval = setInterval(() => {
    // Update time
  }, 1000);
  
  return () => clearInterval(interval);
}, [mounted, ...deps]);

// Suppress warnings on elements with dynamic content
<span suppressHydrationWarning>{timeValue}</span>
```

```tsx
// ✗ INCORRECT - Immediate calculation causes mismatch
useEffect(() => {
  // This runs on both server and client at different times
  setTime(Date.now());
}, []);
```

## Best Practices to Prevent Future Errors

### 1. Always Use `mounted` State for Client-Only Logic

```tsx
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

// Use mounted as guard in other effects
useEffect(() => {
  if (!mounted) return;
  // client-only code
}, [mounted]);
```

### 2. Suppress Hydration Warnings on Dynamic Content

For elements displaying time, dates, or other dynamic values:

```tsx
<div suppressHydrationWarning>
  {formatTime(currentTime)}
</div>
```

### 3. Check for Browser APIs

Before using browser-only APIs:

```tsx
if (typeof window !== 'undefined') {
  // Safe to use window, localStorage, etc.
}
```

### 4. Use Server Components When Possible

Server components don't hydrate, so they can't have hydration errors:

```tsx
// app/page.tsx (Server Component by default)
export default async function Page() {
  const data = await getData();
  return <div>{data.time}</div>; // ✓ No hydration issues
}
```

### 5. Defer Non-Critical Renders

For animations, live updates, or interactive features:

```tsx
const [show, setShow] = useState(false);

useEffect(() => {
  setShow(true);
}, []);

if (!show) return <StaticFallback />;
return <InteractiveComponent />;
```

## Common Pitfalls

### ❌ DON'T

```tsx
// Direct calculation in component body
const now = new Date().getTime();

// Browser API in render
const stored = localStorage.getItem('key');

// Random values
const id = Math.random();
```

### ✅ DO

```tsx
// Calculate in useEffect after mounting
const [now, setNow] = useState<number | null>(null);
useEffect(() => { setNow(Date.now()); }, []);

// Check for browser environment
const [stored, setStored] = useState(null);
useEffect(() => {
  if (typeof window !== 'undefined') {
    setStored(localStorage.getItem('key'));
  }
}, []);

// Generate stable IDs server-side
const id = useId(); // React's useId hook
```

## Testing for Hydration Errors

1. **Check browser console** - Hydration errors are logged
2. **Look for flashing content** - Indicates re-render after hydration
3. **Test with slow network** - Makes timing mismatches more obvious
4. **Disable JavaScript** - Server HTML should look correct

## Debugging Checklist

When you see hydration errors:

- [ ] Is component using `Date.now()`, `Math.random()`, or time calculations?
- [ ] Is component using `window`, `document`, or other browser APIs?
- [ ] Is component using `localStorage`, `sessionStorage`, or cookies?
- [ ] Is third-party library assuming browser environment?
- [ ] Are conditional renders based on client-only state?
- [ ] Are CSS classes or styles calculated client-side?

## Resources

- [React Hydration Docs](https://react.dev/reference/react-dom/client/hydrateRoot)
- [Next.js Hydration Guide](https://nextjs.org/docs/messages/react-hydration-error)
