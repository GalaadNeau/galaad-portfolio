#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ASSET_DIR="$ROOT_DIR/public/assets"
VIDEO_DIR="$ASSET_DIR/video"
FRAMES_DIR="$ASSET_DIR/frames"

mkdir -p "$VIDEO_DIR" "$FRAMES_DIR"

VIDEO_OUT="$VIDEO_DIR/galaad-placeholder.mp4"

# Generated local placeholder content (royalty-free, no external rights required)
ffmpeg -y \
  -f lavfi -i "testsrc2=size=1280x720:rate=24:duration=6" \
  -vf "drawbox=x=0:y=0:w=iw:h=ih:color=black@0.25:t=fill,drawtext=text='GALAAD NEAU':fontcolor=white:fontsize=78:x=(w-text_w)/2:y=h*0.28,drawtext=text='Portfolio Prototype':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=h*0.43,drawtext=text='Generated with ffmpeg test source':fontcolor=white:fontsize=28:x=(w-text_w)/2:y=h*0.56" \
  -c:v libx264 -pix_fmt yuv420p "$VIDEO_OUT"

# 72 scrub-friendly JPG frames
ffmpeg -y -i "$VIDEO_OUT" \
  -vf "fps=12,scale=1280:720" \
  "$FRAMES_DIR/frame-%04d.jpg"

echo "Assets generated:"
echo "- $VIDEO_OUT"
echo "- $FRAMES_DIR/frame-0001.jpg ..."
