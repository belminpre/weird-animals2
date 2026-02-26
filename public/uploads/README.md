# Animal images

The app expects these image files here so they are served at `/uploads/<name>.jpg`:

- african-elephant.jpg
- aye-aye.jpg
- barreleye-fish.jpg
- blue-ringed-octopus.jpg
- coelacanth.jpg
- dumbo-octopus.jpg
- emperor-penguin.jpg
- giant-panda.jpg
- harpy-eagle.jpg
- horseshoe-crab.jpg
- peregrine-falcon.jpg
- slow-loris.jpg
- snow-leopard.jpg
- star-nosed-mole.jpg
- tarsier.jpg
- vampire-squid.jpg

Add the corresponding `.jpg` files into this folder, then run `npm run build` and redeploy.  
Vite copies `public/` into `dist/`, so they will be available at `/uploads/...` in production.
