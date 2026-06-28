# Styling

## Tailwind Class Grouping

Group Tailwind classes inside `cn(...)` by styling concern. Use separate string arguments in this order, omitting groups that do not apply:

1. Layout
2. Sizing
3. Spacing
4. Typography
5. Visual
6. Motion
7. Responsive variants, from smallest breakpoint to largest

Do not add comments inside `cn(...)` to label the groups. Keep related utilities together in the same string, and put conditional classes in the group where they belong.

```tsx
className={cn(
  "flex flex-col",
  "w-full max-w-5xl",
  "gap-6 px-6 py-12",
  "text-base font-medium",
  "rounded-3xl border border-border bg-card",
  "transition-all duration-200",
  "md:flex-row md:gap-8 md:px-10",
  "lg:gap-12 lg:px-16",
)}
```

For short class lists, keep the same order without forcing unnecessary line breaks.
