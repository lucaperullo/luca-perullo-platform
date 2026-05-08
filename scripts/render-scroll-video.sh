#!/usr/bin/env bash
# Render the two paired compositions (`scroll-video-left`,
# `scroll-video-right`) and extract WebP frames into separate folders for
# the <ScrollVideoSides> component on the home page.
#
# Output:
#   public/scroll-video/left/frame-0001.webp ... frame-NNNN.webp
#   public/scroll-video/right/frame-0001.webp ... frame-NNNN.webp
#
# Pipeline per side:
#   1. Remotion render → MP4 (intermediate)
#   2. ffmpeg → PNG frames (libwebp not required)
#   3. cwebp → WebP frames at WEBP_QUALITY (parallel via cwebp -mt)
#
# Usage:
#   bash scripts/render-scroll-video.sh
#   SKIP_RENDER=1 bash scripts/render-scroll-video.sh   # reuse existing MP4s
#   SCALE_WIDTH=2160 WEBP_QUALITY=80 bash scripts/render-scroll-video.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

INTERMEDIATE_DIR="${REPO_ROOT}/tmp"
FRAMES_ROOT="${REPO_ROOT}/public/scroll-video"

WEBP_QUALITY="${WEBP_QUALITY:-75}"
SCALE_WIDTH="${SCALE_WIDTH:-1080}"

mkdir -p "$INTERMEDIATE_DIR"

# 1) Tooling sanity checks.
if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "✗ ffmpeg not found on PATH."
  echo "  macOS: brew install ffmpeg"
  exit 1
fi
if ! command -v cwebp >/dev/null 2>&1; then
  echo "✗ cwebp not found on PATH."
  echo "  macOS: brew install webp"
  exit 1
fi

# Render + extract one side.
render_side() {
  local SIDE="$1"
  local COMPOSITION_ID="scroll-video-${SIDE}"
  local MP4="${INTERMEDIATE_DIR}/scroll-${SIDE}.mp4"
  local PNG_DIR="${INTERMEDIATE_DIR}/scroll-${SIDE}-frames-png"
  local FRAMES_DIR="${FRAMES_ROOT}/${SIDE}"

  echo ""
  echo "═══ $(echo "$SIDE" | tr '[:lower:]' '[:upper:]') ═══"

  # 1) Render Remotion → MP4 (or skip).
  if [[ "${SKIP_RENDER:-0}" == "1" ]]; then
    echo "▶ [1/3] SKIP_RENDER=1 → re-using ${MP4}"
    if [[ ! -f "$MP4" ]]; then
      echo "✗ No existing MP4 at ${MP4}. Run once without SKIP_RENDER first."
      exit 1
    fi
  else
    echo "▶ [1/3] Rendering ${COMPOSITION_ID} → ${MP4}"
    npx remotion render "${COMPOSITION_ID}" "${MP4}" \
      --concurrency=4 \
      --image-format=jpeg \
      --jpeg-quality=95
  fi

  # 2) Extract PNG frames at SCALE_WIDTH wide.
  rm -rf "$PNG_DIR"
  mkdir -p "$PNG_DIR"

  echo "▶ [2/3] Extracting PNG frames into ${PNG_DIR}"
  ffmpeg -y -i "$MP4" \
    -vf "fps=30,scale=${SCALE_WIDTH}:-2" \
    "${PNG_DIR}/frame-%04d.png" \
    -hide_banner -loglevel error -stats

  local PNG_COUNT
  PNG_COUNT=$(ls -1 "${PNG_DIR}"/frame-*.png 2>/dev/null | wc -l | tr -d ' ')
  echo "  → ${PNG_COUNT} PNG frames"

  # 3) Wipe + convert PNG → WebP.
  if [[ -d "$FRAMES_DIR" ]]; then
    rm -f "${FRAMES_DIR}"/frame-*.webp
  fi
  mkdir -p "$FRAMES_DIR"

  echo "▶ [3/3] Converting PNG → WebP (q=${WEBP_QUALITY})"
  local i=0
  local total
  total=$(ls -1 "${PNG_DIR}"/frame-*.png 2>/dev/null | wc -l | tr -d ' ')
  for png in "${PNG_DIR}"/frame-*.png; do
    local base
    base=$(basename "$png" .png)
    cwebp -quiet -q "$WEBP_QUALITY" -mt "$png" -o "${FRAMES_DIR}/${base}.webp"
    i=$((i + 1))
    if (( i % 25 == 0 )); then
      printf "  → %d / %d\n" "$i" "$total"
    fi
  done

  rm -rf "$PNG_DIR"

  local FRAME_COUNT SIZE
  FRAME_COUNT=$(ls -1 "${FRAMES_DIR}"/frame-*.webp 2>/dev/null | wc -l | tr -d ' ')
  SIZE=$(du -sh "${FRAMES_DIR}" | cut -f1)
  echo "  ✓ ${SIDE}: ${FRAME_COUNT} frames, ${SIZE}"
}

# Drive both sides.
render_side "left"
render_side "right"

# Cleanup any old top-level frames from the previous single-source design.
find "${FRAMES_ROOT}" -maxdepth 1 -name 'frame-*.webp' -delete 2>/dev/null || true

# Final report.
TOTAL_SIZE=$(du -sh "${FRAMES_ROOT}" | cut -f1)
LEFT_COUNT=$(ls -1 "${FRAMES_ROOT}/left"/frame-*.webp 2>/dev/null | wc -l | tr -d ' ')
echo ""
echo "✓ Done — ${LEFT_COUNT} frames per side, ${TOTAL_SIZE} total."
echo ""
echo "  Wire it on a page:"
echo "    <ScrollVideoSides baseUrl=\"/scroll-video\" frameCount={${LEFT_COUNT}} framePadding={4} />"
