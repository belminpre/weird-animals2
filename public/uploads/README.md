# Animal images

Animal images are now loaded from **free external URLs** (Pexels and Wikimedia Commons). No image files need to be added here for the site to work.

If you prefer to host your own images instead:
- Add the corresponding `.jpg` files here (e.g. `african-elephant.jpg`, `aye-aye.jpg`, …).
- Update the `"image"` field in each `src/data/animals/*.json` file back to `/uploads/<filename>.jpg`.
- Run `npm run build` and redeploy.

Current image sources: Pexels (CC0) and Wikimedia Commons (CC-licensed).
