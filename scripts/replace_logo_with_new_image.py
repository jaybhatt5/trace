"""
Replace TRACE logo with new uploaded image:
media_1793349824297_683c8550.png
"""

import cv2
import numpy as np
import os
from PIL import Image

source_img_path = r'C:\Users\zeega\.gemini\antigravity\brain\bf737284-6f04-4ebc-b5ff-54c86eaa5c17\.user_uploaded\media_1793349824297_683c8550.png'

if not os.path.exists(source_img_path):
    raise FileNotFoundError(f"Source image not found: {source_img_path}")

# Load image
im = cv2.imread(source_img_path)
h, w = im.shape[:2] # 1000, 1024
gray = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
_, th = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY)
contours, hierarchy = cv2.findContours(th, cv2.RETR_TREE, cv2.CHAIN_APPROX_TC89_KCOS)

# Center inside a 1024x1024 square coordinate space
y_offset = (1024 - h) // 2 # 12px vertical padding

def cnt_to_svg_path(cnt, y_off=12):
    pts = cnt.reshape(-1, 2)
    return 'M ' + ' L '.join(f'{p[0]},{p[1] + y_off}' for p in pts) + ' Z'

# In contours:
# 3: left 'C' & 'A'
# 1: 'R' stem & outer bowl
# 2: inner hole of 'R'
# 0: lower leg of 'R'
monogram_1024_d = (
    cnt_to_svg_path(contours[3], y_offset) + ' ' +
    cnt_to_svg_path(contours[1], y_offset) + ' ' +
    cnt_to_svg_path(contours[2], y_offset) + ' ' +
    cnt_to_svg_path(contours[0], y_offset)
)

# 1. Full Logo SVG: Pure black background square, bold white TRACE monogram
logo_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="100%" height="100%">
  <!-- TRACE: Truth Review & Authenticity Checking Engine -->
  <!-- Official Monogram Logo -->
  <rect width="1024" height="1024" fill="#000000" rx="160" />
  <path fill-rule="evenodd" clip-rule="evenodd" d="{monogram_1024_d}" fill="#ffffff" />
</svg>'''

# 2. Favicon SVG (Full square/rounded for browser tabs)
favicon_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="100%" height="100%">
  <!-- TRACE Favicon -->
  <rect width="1024" height="1024" fill="#000000" rx="192" />
  <path fill-rule="evenodd" clip-rule="evenodd" d="{monogram_1024_d}" fill="#ffffff" />
</svg>'''

# 3. Transparent Monogram Glyph SVG
glyph_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="100%" height="100%">
  <!-- TRACE Monogram Glyph -->
  <path fill-rule="evenodd" clip-rule="evenodd" d="{monogram_1024_d}" fill="currentColor" />
</svg>'''

# Save public/favicon.svg
with open('public/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(favicon_svg)
print("Updated public/favicon.svg")

# Save assets/logo.svg and assets/logo_mark.svg
os.makedirs('assets', exist_ok=True)
with open('assets/logo.svg', 'w', encoding='utf-8') as f:
    f.write(logo_svg)
with open('assets/logo_mark.svg', 'w', encoding='utf-8') as f:
    f.write(glyph_svg)
print("Updated assets/logo.svg and assets/logo_mark.svg")

if os.path.exists('dist'):
    with open('dist/favicon.svg', 'w', encoding='utf-8') as f:
        f.write(favicon_svg)
    print("Updated dist/favicon.svg")

# Create a square 1024x1024 PIL image from the 1024x1000 original
pil_orig = Image.open(source_img_path)
square_img = Image.new('RGB', (1024, 1024), (0, 0, 0))
square_img.paste(pil_orig, (0, 12))

# Save PNG assets
square_img.save('public/favicon.png', 'PNG')
square_img.resize((192, 192), Image.Resampling.LANCZOS).save('public/favicon-192.png', 'PNG')
square_img.resize((32, 32), Image.Resampling.LANCZOS).save('public/favicon-32.png', 'PNG')
square_img.save('assets/logo.png', 'PNG')
square_img.resize((512, 512), Image.Resampling.LANCZOS).save('assets/trace_logo_badge.png', 'PNG')

if os.path.exists('dist'):
    square_img.save('dist/favicon.png', 'PNG')
    square_img.resize((192, 192), Image.Resampling.LANCZOS).save('dist/favicon-192.png', 'PNG')
    square_img.resize((32, 32), Image.Resampling.LANCZOS).save('dist/favicon-32.png', 'PNG')

print("Saved all PNG favicons and logo images successfully!")

# Save path string for TraceLogo.tsx
with open('scripts/trace_new_monogram_path.txt', 'w', encoding='utf-8') as f:
    f.write(monogram_1024_d)
print("Saved scripts/trace_new_monogram_path.txt")
