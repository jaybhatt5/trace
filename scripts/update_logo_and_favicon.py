"""
Update TRACE Logo and Favicon from user-uploaded image:
media_1793349037212_7c281e1e.png
"""

import cv2
import numpy as np
import os
from PIL import Image

source_img_path = r'C:\Users\zeega\.gemini\antigravity\brain\bf737284-6f04-4ebc-b5ff-54c86eaa5c17\.user_uploaded\media_1793349037212_7c281e1e.png'

if not os.path.exists(source_img_path):
    raise FileNotFoundError(f"Source image not found: {source_img_path}")

# Load image
im = cv2.imread(source_img_path)
h, w = im.shape[:2]
gray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
_, th = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY)
contours, hierarchy = cv2.findContours(th, cv2.RETR_TREE, cv2.CHAIN_APPROX_TC89_KCOS)

def cnt_to_svg_path(cnt):
    pts = cnt.reshape(-1, 2)
    return 'M ' + ' L '.join(f'{p[0]},{p[1]}' for p in pts) + ' Z'

# In this 1024x1024 image:
# Contour 0 & 1 form the rounded squircle border
# Contour 5 is the left 'C' and 'A'
# Contour 3 is the 'R' stem & bowl
# Contour 4 is the hole inside the 'R' bowl
# Contour 2 is the right lower leg of 'R'
squircle_border_d = cnt_to_svg_path(contours[0]) + ' ' + cnt_to_svg_path(contours[1])
monogram_d = cnt_to_svg_path(contours[5]) + ' ' + cnt_to_svg_path(contours[3]) + ' ' + cnt_to_svg_path(contours[4]) + ' ' + cnt_to_svg_path(contours[2])

# Also build the standalone monogram path centered in 512x512 space (for standalone glyph usage)
# Bounding box of monogram (contours 5, 3, 4, 2)
mono_pts = np.vstack([contours[5], contours[3], contours[4], contours[2]]).reshape(-1, 2)
mx, my, mw, mh = cv2.boundingRect(mono_pts)
print(f"Monogram bounding box in 1024x1024: x={mx}, y={my}, w={mw}, h={mh}")

# Scale to fit nicely in 512x512 with padding
target_size = 380.0
mono_scale = target_size / max(mw, mh)
mono_cx = mx + mw / 2.0
mono_cy = my + mh / 2.0
tx = 256.0 - mono_cx * mono_scale
ty = 256.0 - mono_cy * mono_scale

def cnt_to_scaled_svg(cnt):
    pts = cnt.reshape(-1, 2)
    spts = [(round(p[0] * mono_scale + tx, 1), round(p[1] * mono_scale + ty, 1)) for p in pts]
    return 'M ' + ' L '.join(f'{p[0]},{p[1]}' for p in spts) + ' Z'

monogram_512_d = (
    cnt_to_scaled_svg(contours[5]) + ' ' +
    cnt_to_scaled_svg(contours[3]) + ' ' +
    cnt_to_scaled_svg(contours[4]) + ' ' +
    cnt_to_scaled_svg(contours[2])
)

# 1. Full Badge SVG (Exact reproduction of uploaded image: black background, squircle border, white monogram)
badge_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="100%" height="100%">
  <!-- TRACE: Truth Review & Authenticity Checking Engine -->
  <!-- Official Crest Badge -->
  <rect width="1024" height="1024" rx="224" fill="#000000" />
  <path fill-rule="evenodd" clip-rule="evenodd" d="{squircle_border_d}" fill="#ffffff" />
  <path fill-rule="evenodd" clip-rule="evenodd" d="{monogram_d}" fill="#ffffff" />
</svg>'''

# 2. Pure Vector Logo (Standalone Monogram Glyph with currentColor)
logo_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- TRACE Monogram Glyph -->
  <path fill-rule="evenodd" clip-rule="evenodd" d="{monogram_512_d}" fill="currentColor" />
</svg>'''

# Write public/favicon.svg
with open('public/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(badge_svg)
print("Updated public/favicon.svg")

# Write assets/logo.svg
os.makedirs('assets', exist_ok=True)
with open('assets/logo.svg', 'w', encoding='utf-8') as f:
    f.write(badge_svg)
print("Updated assets/logo.svg")

# Also save standalone glyph as assets/logo_mark.svg
with open('assets/logo_mark.svg', 'w', encoding='utf-8') as f:
    f.write(logo_svg)
print("Updated assets/logo_mark.svg")

# Also update dist if it exists
if os.path.exists('dist'):
    with open('dist/favicon.svg', 'w', encoding='utf-8') as f:
        f.write(badge_svg)
    print("Updated dist/favicon.svg")

# Generate raster PNG copies for universal favicon support (PNG)
pil_img = Image.open(source_img_path)

# Save public/favicon.png (original high res 1024)
pil_img.save('public/favicon.png', 'PNG')
print("Saved public/favicon.png")

# Save 192x192 and 32x32 favicons
pil_img.resize((192, 192), Image.Resampling.LANCZOS).save('public/favicon-192.png', 'PNG')
pil_img.resize((32, 32), Image.Resampling.LANCZOS).save('public/favicon-32.png', 'PNG')
if os.path.exists('dist'):
    pil_img.save('dist/favicon.png', 'PNG')
    pil_img.resize((192, 192), Image.Resampling.LANCZOS).save('dist/favicon-192.png', 'PNG')
    pil_img.resize((32, 32), Image.Resampling.LANCZOS).save('dist/favicon-32.png', 'PNG')

# Save assets/trace_logo_badge.png (512x512) for PDF and reports
pil_img.resize((512, 512), Image.Resampling.LANCZOS).save('assets/trace_logo_badge.png', 'PNG')
pil_img.save('assets/logo.png', 'PNG')
print("Saved assets/trace_logo_badge.png and assets/logo.png")

# Save path data for React component
with open('scripts/trace_full_paths.py', 'w', encoding='utf-8') as f:
    f.write(f'SQUIRCLE_BORDER = """{squircle_border_d}"""\n')
    f.write(f'MONOGRAM_1024 = """{monogram_d}"""\n')
    f.write(f'MONOGRAM_512 = """{monogram_512_d}"""\n')
print("Saved scripts/trace_full_paths.py")
