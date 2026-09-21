import os
import json
import requests

os.makedirs('src/data/geo', exist_ok=True)

def fetch_and_save(candidates, out_path, fallback_bbox=None):
    for q in candidates:
        try:
            resp = requests.get(
                'https://nominatim.openstreetmap.org/search',
                params={'q': q, 'format': 'geojson', 'polygon_geojson': 1, 'limit': 1},
                headers={'User-Agent': 'terratree-build-script'}
            )
            features = resp.json().get('features', [])
            if features:
                geom = features[0]['geometry']
                geojson = {
                    'type': 'FeatureCollection',
                    'features': [{
                        'type': 'Feature',
                        'properties': {'name': q, 'source': 'OpenStreetMap Nominatim'},
                        'geometry': geom
                    }]
                }
                with open(out_path, 'w', encoding='utf-8') as f:
                    json.dump(geojson, f, indent=2)
                print(f'Saved {out_path} using query "{q}"')
                return
        except Exception as e:
            print(f'Error for {q}: {e}')
    if fallback_bbox:
        min_lon, min_lat, max_lon, max_lat = fallback_bbox
        geojson = {
            'type': 'FeatureCollection',
            'features': [{
                'type': 'Feature',
                'properties': {'name': candidates[0], 'source': 'Fallback bounding box'},
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [[[min_lon, min_lat], [max_lon, min_lat], [max_lon, max_lat], [min_lon, max_lat], [min_lon, min_lat]]]
                }
            }]
        }
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(geojson, f, indent=2)
        print(f'Saved fallback bbox for {out_path}')

if __name__ == '__main__':
    fetch_and_save([
        'Kali Tiger Reserve, Karnataka, India',
        'Anshi Dandeli Tiger Reserve',
        'Dandeli Wildlife Sanctuary',
        'Kali Tiger Reserve'
    ], 'src/data/geo/kali_boundary.geojson', [74.25, 14.85, 74.75, 15.55])

    fetch_and_save([
        'Sundarbans',
        'Sundarbans National Park, West Bengal, India',
        'Sundarban Tiger Reserve'
    ], 'src/data/geo/sundarbans_boundary.geojson', [88.75, 21.50, 89.20, 22.20])
