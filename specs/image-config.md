# Spec: image config

Covers the `imageConfig` export in `src/utils/image-config.ts`.

---

## What it is

`imageConfig` is a static configuration object passed to Sharp (via Astro's image optimizer)
to control image compression settings. It has no behavior - no functions, no logic.

There is nothing to unit test here. Changes to values are verified by visual output inspection
or by checking that the build passes with valid Sharp options.

---

## Contracts

### Pixel limit

`limitInputPixels: 268402689`

Maximum input image size (~16384 x 16384 pixels). Images larger than this will error at build time.
Set explicitly to avoid Sharp's default limit rejecting large source images.

### Quality

All formats use `quality: 85`. This is the global quality target across formats.
Individual format sections may add format-specific tuning on top of this value.

### Per-format settings

| Format | Key settings                                              |
| ------ | --------------------------------------------------------- |
| jpeg   | progressive, mozjpeg optimization, scan optimization      |
| png    | progressive, max compression (level 9), adaptive filter   |
| webp   | near-lossless, smart subsampling, lossy mode              |
| avif   | lossy mode, speed 5 (balanced encode time vs. quality)    |

### Invariants

- `lossless: false` for webp and avif - these formats use lossy compression.
- `quality` value is the same for all four formats.
- No format omits the `quality` key.

---

## Usage

This object is consumed by `astro.config.mjs` as part of the image service configuration.
It is not used at runtime in the browser.
