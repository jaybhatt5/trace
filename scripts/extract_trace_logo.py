"""
Extract the exact TRACE monogram from the user-uploaded image and generate:
- public/favicon.svg
- assets/logo.svg
- dist/favicon.svg
- src/components/TraceLogo.tsx
"""

import cv2
import numpy as np
import os

source_img_path = 'C:/Users/zeega/.gemini/antigravity/brain/bf737284-6f04-4ebc-b5ff-54c86eaa5c17/.user_uploaded/media_1793347606905_ab69cb7d.jpg'

im = cv2.imread(source_img_path)
if im is None:
    raise FileNotFoundError(f"Could not load image at {source_img_path}")

gray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
_, th = cv2.threshold(gray, 90, 255, cv2.THRESH_BINARY)
mask = np.zeros_like(th)
mask[220:785, 185:835] = th[220:785, 185:835]
contours, hierarchy = cv2.findContours(mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_TC89_KCOS)

# Emblem center and scale mapping to 512x512
scale = 352.0 / 646.0
cx, cy = 509.5, 501.5
tx = 256.0 - cx * scale
ty = 256.0 - cy * scale

def cnt_to_svg(cnt, epsilon_ratio=0.001):
    peri = cv2.arcLength(cnt, True)
    approx = cv2.approxPolyDP(cnt, epsilon_ratio * peri, True)
    pts = approx.reshape(-1, 2)
    mpts = [(round(p[0] * scale + tx, 1), round(p[1] * scale + ty, 1)) for p in pts]
    d = f'M {mpts[0][0]},{mpts[0][1]} ' + ' '.join([f'L {p[0]},{p[1]}' for p in mpts[1:]]) + ' Z'
    return d

d_c = cnt_to_svg(contours[23])
d_a = cnt_to_svg(contours[15])
d_r_outer = cnt_to_svg(contours[20])
d_r_hole = cnt_to_svg(contours[22])
d_r_leg = cnt_to_svg(contours[11])

combined_d = f'{d_c} {d_a} {d_r_outer} {d_r_hole} {d_r_leg}'

# 1. Broad-sheet styled Favicon SVG (deep ink squircle, crisp bone-white TRACE emblem, subtle hairline border)
favicon_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- TRACE: Truth Review & Authenticity Checking Engine -->
  <rect width="512" height="512" rx="112" fill="#111317" />
  <rect width="504" height="504" x="4" y="4" rx="108" fill="none" stroke="#292c34" stroke-width="6" />
  <path fill-rule="evenodd" clip-rule="evenodd" d="{combined_d}" fill="#f5f5f5" />
</svg>'''

# 2. Pure Vector Logo (no hardcoded container, uses currentColor or adaptable styling)
logo_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <path fill-rule="evenodd" clip-rule="evenodd" d="{combined_d}" fill="currentColor" />
</svg>'''

# Write to public/favicon.svg
with open('public/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(favicon_svg)
print("Updated public/favicon.svg")

# Write to assets/logo.svg
os.makedirs('assets', exist_ok=True)
with open('assets/logo.svg', 'w', encoding='utf-8') as f:
    f.write(logo_svg)
print("Updated assets/logo.svg")

# Write to dist/favicon.svg if dist exists
if os.path.exists('dist'):
    with open('dist/favicon.svg', 'w', encoding='utf-8') as f:
        f.write(favicon_svg)
    print("Updated dist/favicon.svg")

# Save paths string for React component
with open('scripts/trace_path.txt', 'w', encoding='utf-8') as f:
    f.write(combined_d)
print("Saved scripts/trace_path.txt")
