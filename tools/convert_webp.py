import sys
import argparse
from pathlib import Path

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

def convert_images(src, dest, quality=80):
    if not HAS_PIL:
        print("Peringatan: Pustaka Pillow belum terpasang. Jalankan: pip install Pillow")
        sys.exit(1)

    src_dir = Path(src)
    dest_dir = Path(dest)
    dest_dir.mkdir(parents=True, exist_ok=True)

    supported_exts = {'.png', '.jpg', '.jpeg'}
    processed = 0

    for file_path in src_dir.iterdir():
        if file_path.is_file() and file_path.suffix.lower() in supported_exts:
            try:
                img = Image.open(file_path)
                dest_path = dest_dir / f"{file_path.stem}.webp"
                if img.mode not in ('RGB', 'RGBA'):
                    img = img.convert('RGBA')
                img.save(dest_path, "WEBP", quality=quality)
                print(f"Berhasil dikonversi: {file_path.name} -> {dest_path.name}")
                processed += 1
            except Exception as e:
                print(f"Gagal mengonversi {file_path.name}: {e}")

    print(f"Total gambar diproses: {processed}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Batch converter gambar JPG/PNG ke WebP")
    parser.add_argument("src", help="Direktori sumber gambar")
    parser.add_argument("dest", help="Direktori tujuan penyimpanan WebP")
    parser.add_argument("--quality", type=int, default=80, help="Kualitas kompresi WebP (default: 80)")
    args = parser.parse_args()
    convert_images(args.src, args.dest, args.quality)
