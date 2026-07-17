# The Vault of Echoes

An interactive fictional-world archive by Andrei Bituleanu. The application uses OpenSeadragon to progressively load a tiled world map, anchors React portal nodes to normalized image coordinates, and presents responsive lore records without a backend.

## Stack

- React 18 + TypeScript
- Vite
- OpenSeadragon Deep Zoom Images (DZI)
- Local typed content in `src/data/locations.ts`
- Organized global CSS with reduced-motion support

## Run locally

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

Useful checks:

```bash
npm run lint
npm run build
npm run preview
```

Copy `.env.example` to `.env.local` when you need to change map limits, the DZI path, ambient audio, or development placement mode. Vite reads `.env.local` automatically.

## Project structure

```text
src/
  components/
    VaultEntrance.tsx
    WorldMap.tsx
    PortalNode.tsx
    LocationPanel.tsx
    StoryCard.tsx
    MapControls.tsx
    PlacementTool.tsx
  data/locations.ts
  hooks/useReducedMotion.ts
  lib/ambientAudio.ts
public/
  favicon.png
  images/
    locations/
    stories/
  map/world-map.dzi
  map/world-map_files/
source-assets/          # local originals; ignored by Git and deployment
  map/
  reference/
scripts/
  generate_dzi.py
  create_zone_crops.py
worker/
  sites-worker.js
```

## Install the production 16K map

The application never renders the source map as a normal `<img>`. OpenSeadragon reads the descriptor at `public/map/world-map.dzi` and requests only the JPEG tiles needed for the current view.

The installed DZI pyramid was generated from the 16384×12288 production source. Original map and working artwork files live under the ignored `source-assets/` directory so they are never copied into a deployment.

Expected placement:

```text
public/
  map/
    world-map.dzi
    world-map_files/
      0/
      1/
      ...
```

### Bundled converter

Install Pillow, then run the provided converter from the project root:

```bash
python -m pip install Pillow
python scripts/generate_dzi.py "source-assets/map/Echoes 16K.jpg" public/map/world-map
```

The output stem must be `public/map/world-map` unless `VITE_MAP_TILE_SOURCE` points to a different descriptor. The script writes 256px JPEG tiles with a one-pixel overlap.

### libvips alternative

For very large production sources, libvips is faster and uses less memory:

```bash
vips dzsave path/to/your-16k-map.png public/map/world-map \
  --layout dz --tile-size 256 --overlap 1 --suffix ".jpg[Q=86]"
```

Keep the `.dzi` descriptor and its matching `_files` folder together. Both paths are copied unchanged into the Vite production output.

Zoom limits are configurable in `.env.local`:

```dotenv
VITE_MAP_MIN_ZOOM=0.9
VITE_MAP_MAX_ZOOM=6
VITE_MAP_TILE_SOURCE=/map/world-map.dzi
```

## Add locations and stories

Edit `src/data/locations.ts`. Coordinates are normalized, so `x: 0` / `y: 0` is the image's top-left and `x: 1` / `y: 1` is its bottom-right.

```ts
{
  id: "new-location",
  name: "New Location",
  category: "Uncatalogued",
  x: 0.500000,
  y: 0.500000,
  image: "/images/locations/new-location.webp",
  summary: "A concise archive summary.",
  sections: [
    { title: "Field note", body: "Optional long-form lore." }
  ],
  stories: [
    {
      id: "related-story",
      title: "Related Story",
      format: "Short story",
      synopsis: "A concise synopsis.",
      image: "/images/stories/related-story.webp",
      url: "https://example.com/story",
      buttonLabel: "Read the story"
    }
  ]
}
```

Omit `sections` or `stories` when they are not needed. The panel hides absent sections automatically. External story links open in a new tab with `noopener noreferrer` protection.

## Development placement mode

Create `.env.local` with:

```dotenv
VITE_ENABLE_PLACEMENT_MODE=true
```

Restart `npm run dev`. Clicking an unmarked map point displays normalized coordinates to six decimal places, creates a temporary portal marker, and provides copy buttons for both the coordinates and a starter location object.

The tool is guarded by both `import.meta.env.DEV` and the environment flag, so it is removed from production builds even when the variable is accidentally set during a production build.

## Optional ambient audio

Create an `audio` folder inside `public`, then add your music at:

```text
public/audio/002_Synthwave_15k.mp3
```

That path works automatically. To use a different filename or a hosted audio URL, set:

```dotenv
VITE_AMBIENT_AUDIO_URL=/audio/002_Synthwave_15k.mp3
```

The audio controller is invoked only from the visitor's Enter button gesture. Visitors can mute, unmute, and adjust the volume with the compact control in the top-right corner.

## Interaction and accessibility

- Mouse drag, touch drag, wheel zoom, and pinch zoom are handled by OpenSeadragon.
- Arrow keys pan; `+` / `-` zoom; `Home` or `0` returns to world view.
- Nodes are real buttons with visible focus, accessible labels, and enlarged mobile targets.
- Touch users tap once to inspect a portal label and again to open it.
- Location dialogs trap focus, close with Escape, and restore focus to the originating portal.
- Reduced-motion preferences remove entrance, portal, map, and panel motion.
- Panel artwork is lazy-loaded and never enters the JavaScript bundle.

## Artwork

The included fictional cartography and derived lore crops are original project assets created for this build. Portal marks and interface texture are rendered entirely in CSS. No third-party imagery is used.

The small worker entrypoint in `worker/sites-worker.js` serves the Vite output on Cloudflare-compatible static hosting and falls back to `index.html` for client-side routes.
