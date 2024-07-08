import os
import json
from PIL import Image, ExifTags

def get_image_size(image_path):
    with Image.open(image_path) as img:
        return img.size
        
with open('json/data.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

for image in data:
    size = get_image_size(image['src'])
    if size:
        image['width'], image['height'] = size

with open('json/data.min.json', 'w', encoding='utf-8') as file:
    json.dump(data, file)

    
total_size = 0
for image in data:
    src_path = image['src']
    base, ext = os.path.splitext(src_path)
    if ext.lower() == '.jpg':
        new_src_path = f"{base}.min.jpg"
        with Image.open(src_path) as img:
            # Correct image orientation based on EXIF data
            for orientation in ExifTags.TAGS.keys():
                if ExifTags.TAGS[orientation] == 'Orientation':
                    break

            exif = img._getexif()
            if exif is not None:
                exif = dict(exif.items())
                orientation = exif.get(orientation, 1)

                if orientation == 3:
                    img = img.rotate(180, expand=True)
                elif orientation == 6:
                    img = img.rotate(270, expand=True)
                elif orientation == 8:
                    img = img.rotate(90, expand=True)

            while True:
                img.save(new_src_path, 'JPEG', quality=20)
                with open(new_src_path, 'rb') as f:
                    img_size = len(f.read())
                if img_size <= 1024 * 128:
                    total_size += img_size
                    break
                    
                img = img.resize((img.width // 2, img.height // 2))
            
print(f"Total {total_size / 1024 / 1024} MB")