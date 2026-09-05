// Ambient module declaration for JSON imports.
// TypeScript's bundler moduleResolution requires this when resolveJsonModule is not set.
// Vite handles the actual JSON loading at runtime; this declaration satisfies the type checker.
declare module '*.json' {
  const value: unknown;
  export default value;
}
