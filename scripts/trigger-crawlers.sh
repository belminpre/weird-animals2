#!/usr/bin/env bash
# Hit all 24 sitemap pages with each crawler User-Agent (root, /categories, 6 category pages, 16 animal pages).
# Usage: ./scripts/trigger-crawlers.sh [BASE_URL]
# Example: ./scripts/trigger-crawlers.sh

BASE="${1:-https://weird-animals.belmin.workers.dev}"
NOCACHE="${2:-}"
SUFFIX="${NOCACHE:+?nocache=$NOCACHE}"

# All 24 URLs from sitemap: /, /categories, 6 categories, 16 animals
PAGES=(
  "/"
  "/categories"
  "/category/birds"
  "/category/deep-sea-creatures"
  "/category/living-fossils"
  "/category/mammals"
  "/category/nocturnal-oddities"
  "/category/venomous-oddities"
  "/animal/african-elephant"
  "/animal/aye-aye"
  "/animal/barreleye-fish"
  "/animal/blue-ringed-octopus"
  "/animal/coelacanth"
  "/animal/dumbo-octopus"
  "/animal/emperor-penguin"
  "/animal/giant-panda"
  "/animal/harpy-eagle"
  "/animal/horseshoe-crab"
  "/animal/peregrine-falcon"
  "/animal/slow-loris"
  "/animal/snow-leopard"
  "/animal/star-nosed-mole"
  "/animal/tarsier"
  "/animal/vampire-squid"
)

CRAWLERS=(
  "other"
  "gptbot"
  "chatgpt"
  "baiduspider"
  "mediapartners-google"
  "tiktok"
  "rogerbot"
  "dotbot"
  "bingbot"
  "slackbot"
  "yahoo"
  "linkedinbot"
  "ahrefsbot"
  "pinterestbot"
  "yandexbot"
  "google-safety"
  "twitter"
  "googlebot"
  "facebookexternalhit"
  "applebot"
  "adsbot-google"
  "yabrowser"
)

total=$((${#PAGES[@]} * ${#CRAWLERS[@]}))
n=0
for path in "${PAGES[@]}"; do
  url="${BASE}${path}${SUFFIX}"
  for ua in "${CRAWLERS[@]}"; do
    ((n++))
    printf "[%4d/%d] %-22s %s -> " "$n" "$total" "$ua" "$path"
    curl -sI -A "$ua" "$url" | head -1
  done
done
echo "Done. $total requests."
