import os
from PIL import Image

input_dir = 'scareenshot'
output_dir = '10_inch_tablet_screenshots'

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Tablet screenshot requirement: 9:16 aspect ratio, min side 1080px.
# We will create a 1080 x 1920 canvas.
target_width = 1080
target_height = 1920
bg_color = (255, 255, 255) # White

valid_extensions = {'.png', '.jpg', '.jpeg'}

for filename in os.listdir(input_dir):
    ext = os.path.splitext(filename)[1].lower()
    if ext in valid_extensions:
        img_path = os.path.join(input_dir, filename)
        
        try:
            with Image.open(img_path) as img:
                # Convert to RGB if necessary (e.g., if it has an alpha channel or is RGBA)
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Calculate the scaling factor to fit within the target dimensions
                scale = min(target_width / img.width, target_height / img.height)
                
                new_width = int(img.width * scale)
                new_height = int(img.height * scale)
                
                # Resize the original image
                resized_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                
                # Create the target canvas
                canvas = Image.new('RGB', (target_width, target_height), bg_color)
                
                # Paste the resized image into the center of the canvas
                x_offset = (target_width - new_width) // 2
                y_offset = (target_height - new_height) // 2
                canvas.paste(resized_img, (x_offset, y_offset))
                
                # Save it to the new folder
                out_path = os.path.join(output_dir, filename)
                canvas.save(out_path, quality=95)
                print(f"Processed: {filename}")
                
        except Exception as e:
            print(f"Error processing {filename}: {e}")

print("All done!")
