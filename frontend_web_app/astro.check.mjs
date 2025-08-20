export default {
  // Keep checker focused on Astro config and basic template issues.
  // Type checking for TS is already enforced by tsconfig and eslint rules.
  settings: {
    // Skip type-checking inline scripts in .astro files to reduce noise from DOM overloads in islands.
    tsConfig: {
      include: ["./**/*.ts", "./**/*.tsx"],
      exclude: ["./node_modules", "./dist"],
      compilerOptions: {
        // In Astro islands, DOM event typing often conflicts with inline scripts.
        // We'll rely on eslint for correctness of those.
        skipLibCheck: true,
        strict: true
      }
    }
  }
};
