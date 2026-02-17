/**
 * Legacy stub.
 *
 * Mermaid rendering is now handled client-side in `src/layouts/PostLayout.astro`
 * by converting <pre data-language="mermaid"> blocks into <div class="mermaid">.
 *
 * This file exists to avoid toolchain cache issues if an old build artifact
 * still tries to import it.
 */
export default function rehypeMermaidStub() {
  return function transformer(tree) {
    return tree;
  };
}
