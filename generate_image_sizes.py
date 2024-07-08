import json
from PIL import Image

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
