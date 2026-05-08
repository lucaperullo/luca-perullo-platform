#!/usr/bin/env bash
# Extract a generic MP4 (or any ffmpeg-readable video) into WebP frames
# ready for the <ScrollVideoSides> component.
#
# Usage:
#   bash scripts/extract-mp4-frames.sh <input.mp4> <side>
#
# Example — replace the right gutter with a custom AI-generated video:
#   bash scripts/extract-mp4-frames.sh public/scroll_video.mp4 right
#
# Env overrides:
#   FPS=30                  Target frame rate (default: source's native fps)
#   SCALE_WIDTH=1080        Output frame width (default 1080)
#   WEBP_QUALITY=75
#
# Output: public/scroll-video/<side>/frame-NNNN.webp

set -euo pipefail

INPUT="${1:-}"
SIDE="${2:-}"

if [[ -z "$INPUT" || -z "$SIDE" ]]; then
  echo "✗ Usage: bash scripts/extract-mp4-frames.sh <input.mp4> <side>"
  echo "  Example: bash scripts/extract-mp4-frames.sh public/scroll_video.mp4 right"
  exit 1
fi

if [[ ! -f "$INPUT" ]]; then
  echo "✗ Input not found: ${INPUT}"
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

INTERMEDIATE_DIR="${REPO_ROOT}/tmp/extract-${SIDE}"
FRAMES_DIR="${REPO_ROOT}/public/scroll-video/${SIDE}"

WEBP_QUALITY="${WEBP_QUALITY:-75}"
SCALE_WIDTH="${SCALE_WIDTH:-1080}"

# 1) Sanity checks.
if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "✗ ffmpeg not found. brew install ffmpeg"
  exit 1
fi
if ! command -v cwebp >/dev/null 2>&1; then
  echo "✗ cwebp not found. brew install webp"
  exit 1
fi

# 2) Probe source.
echo "▶ Source: ${INPUT}"
ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height,duration,nb_frames,r_frame_rate \
  -of default=noprint_wrappers=1 "$INPUT" \
  | sed 's/^/  /'

# 3) Build the ffmpeg filter chain.
#    Always scale to SCALE_WIDTH wide (preserve aspect via -2).
#    Honour FPS env if set; otherwise let ffmpeg keep source's native rate.
VF="scale=${SCALE_WIDTH}:-2"
if [[ -n "${FPS:-}" ]]; then
  VF="fps=${FPS},${VF}"
fi

# 4) Extract PNGs.
rm -rf "$INTERMEDIATE_DIR"
mkdir -p "$INTERMEDIATE_DIR"
echo ""
echo "▶ Extracting PNG frames into ${INTERMEDIATE_DIR}"
ffmpeg -y -i "$INPUT" -vf "$VF" \
  "${INTERMEDIATE_DIR}/frame-%04d.png" \
  -hide_banner -loglevel error -stats

PNG_COUNT=$(ls -1 "${INTERMEDIATE_DIR}"/frame-*.png 2>/dev/null | wc -l | tr -d ' ')
echo "  → ${PNG_COUNT} PNG frames"

# 5) Wipe previous WebP set + convert.
mkdir -p "$FRAMES_DIR"
rm -f "${FRAMES_DIR}"/frame-*.webp

echo ""
echo "▶ Converting PNG → WebP (q=${WEBP_QUALITY})"
i=0
for png in "${INTERMEDIATE_DIR}"/frame-*.png; do
  base=$(basename "$png" .png)
  cwebp -quiet -q "$WEBP_QUALITY" -mt "$png" -o "${FRAMES_DIR}/${base}.webp"
  i=$((i + 1))
  if (( i % 25 == 0 )); then
    printf "  → %d / %d\n" "$i" "$PNG_COUNT"
  fi
done

rm -rf "$INTERMEDIATE_DIR"

# 6) Report.
FRAME_COUNT=$(ls -1 "${FRAMES_DIR}"/frame-*.webp 2>/dev/null | wc -l | tr -d ' ')
SIZE=$(du -sh "${FRAMES_DIR}" | cut -f1)
echo ""
echo "✓ Done — ${SIDE}: ${FRAME_COUNT} frames, ${SIZE}"
echo ""
echo "  Update the homepage <ScrollVideoSides> with:"
echo "    right={{ baseUrl: \"/scroll-video/${SIDE}\", frameCount: ${FRAME_COUNT} }}"
