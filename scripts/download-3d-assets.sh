#!/usr/bin/env bash
# Download Poly Haven CC0 GLTF assets for the side scenes.
# Each Poly Haven asset ships as .gltf + .bin + N textures — we mirror
# the file tree under public/3d/<slug>/ so R3F's useGLTF() resolves the
# relative references natively.
#
# Usage:
#   bash scripts/download-3d-assets.sh
#
# License: CC0 — no attribution required, free for commercial use.
# https://polyhaven.com/license

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_DIR="${REPO_ROOT}/public/3d"
mkdir -p "$TARGET_DIR"

ASSETS=(
  "marble_bust_01"
  "brass_vase_01"
  "Lantern_01"
  "ceramic_vase_01"
  "antique_ceramic_vase_01"
  "ceramic_vase_04"
)

# HDRI environment maps (.hdr) for ultra-HD reflections.
HDRIS=(
  "studio_small_09"
)

for SLUG in "${ASSETS[@]}"; do
  echo "▶ ${SLUG}"
  python3 - "$TARGET_DIR" "$SLUG" <<'PY'
import json, sys, urllib.request, os, pathlib

target_root, slug = sys.argv[1], sys.argv[2]
dir_path = os.path.join(target_root, slug)
os.makedirs(dir_path, exist_ok=True)

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X) Chrome/120 Safari/537.36"

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    return urllib.request.urlopen(req, timeout=30)

def download_to(url, dest):
    with fetch(url) as r, open(dest, "wb") as f:
        f.write(r.read())

meta = json.loads(fetch(f"https://api.polyhaven.com/files/{slug}").read())
gltf_1k = meta.get("gltf", {}).get("1k", {})
gltf_block = gltf_1k.get("gltf", {})

gltf_url = gltf_block.get("url")
if not gltf_url:
    print(f"  ✗ no gltf url for {slug}")
    sys.exit(1)

gltf_name = os.path.basename(gltf_url)
print(f"  ↓ {gltf_name}")
download_to(gltf_url, os.path.join(dir_path, gltf_name))

# Includes: .bin and texture files, preserving sub-paths.
includes = gltf_block.get("include", {})
for rel_path, info in includes.items():
    url = info.get("url") if isinstance(info, dict) else None
    if not url:
        continue
    out_path = os.path.join(dir_path, rel_path)
    pathlib.Path(os.path.dirname(out_path)).mkdir(parents=True, exist_ok=True)
    size_kb = info.get("size", 0) // 1024
    print(f"  ↓ {rel_path}  ({size_kb}KB)")
    download_to(url, out_path)
PY
done

# Now the HDRIs — download .hdr at 1K into public/3d/hdri/
HDRI_DIR="${TARGET_DIR}/hdri"
mkdir -p "$HDRI_DIR"
for SLUG in "${HDRIS[@]}"; do
  echo "▶ HDRI ${SLUG}"
  python3 - "$HDRI_DIR" "$SLUG" <<'PY'
import json, sys, urllib.request, os

target_dir, slug = sys.argv[1], sys.argv[2]
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X) Chrome/120 Safari/537.36"

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    return urllib.request.urlopen(req, timeout=30)

def download_to(url, dest):
    with fetch(url) as r, open(dest, "wb") as f:
        f.write(r.read())

meta = json.loads(fetch(f"https://api.polyhaven.com/files/{slug}").read())
hdr_1k = meta.get("hdri", {}).get("1k", {}).get("hdr", {})
url = hdr_1k.get("url")
if not url:
    print(f"  ✗ no 1k .hdr for {slug}")
    sys.exit(1)
out_path = os.path.join(target_dir, f"{slug}_1k.hdr")
print(f"  ↓ {os.path.basename(out_path)}  ({hdr_1k.get('size', 0)//1024}KB)")
download_to(url, out_path)
PY
done

echo ""
echo "✓ Done."
du -sh "${TARGET_DIR}"/* 2>/dev/null || true
