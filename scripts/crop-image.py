from PIL import Image
import sys

# Open the image
img = Image.open('attached_assets/jollyfrog_pic.jpg')

# Get dimensions
width, height = img.size

# Crop to show top 70% of the image (removes bottom 30% which is mostly ground)
# This will emphasize the truck and building  more
crop_box = (0, 0, width, int(height * 0.7))

# Crop the image
cropped_img = img.crop(crop_box)

# Save to client/public
cropped_img.save('client/public/jollyfrog_pic.jpg', 'JPEG', quality=90)

print(f"✓ Cropped image from {width}x{height} to {cropped_img.size[0]}x{cropped_img.size[1]}")
print(f"  Saved to client/public/jollyfrog_pic.jpg")
