import { defineEcConfig } from 'astro-expressive-code'
import { pluginFrames } from '@expressive-code/plugin-frames'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'
import { pluginTextMarkers } from '@expressive-code/plugin-text-markers'

export default defineEcConfig({
  // Use bundled Shiki themes (Astro's `css-variables` theme is not available here).
  themes: ['catppuccin-latte', 'catppuccin-mocha'],

  plugins: [
    pluginFrames({
      showCopyToClipboardButton: true,
      extractFileNameFromCode: true,
    }),
    pluginLineNumbers(),
    pluginTextMarkers(),
  ],
})
