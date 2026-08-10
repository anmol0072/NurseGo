from PIL import Image

# Settings
bg_color = "#1d4ed8"  # NurseGo Blue
width = 1024
height = 500

# Create solid background
bg = Image.new("RGB", (width, height), bg_color)

# Try opening the logo
try:
    logo = Image.open("assets/nursego_logo.png")
    # Resize logo to fit well
    target_height = 350
    aspect_ratio = logo.width / logo.height
    target_width = int(target_height * aspect_ratio)
    logo = logo.resize((target_width, target_height), Image.Resampling.LANCZOS)
    
    # Calculate position to center
    x = (width - target_width) // 2
    y = (height - target_height) // 2
    
    # Paste with transparency if it has an alpha channel
    if logo.mode == 'RGBA':
        bg.paste(logo, (x, y), logo)
    else:
        bg.paste(logo, (x, y))
except Exception as e:
    print(f"Error opening logo: {e}")

# Save the final image
bg.save("feature_graphic.png")
print("Successfully generated feature_graphic.png (1024x500)!")
