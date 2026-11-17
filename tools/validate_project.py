import os
import sys
import re
from pathlib import Path
from urllib.parse import urlparse

ROOT_DIR = Path(__file__).resolve().parent.parent

EXCLUDE_DIRS = {
    '.git',
    '.agents',
    '.system_generated',
    'node_modules',
    'brain'
}

TEXT_EXTENSIONS = {'.html', '.css', '.js', '.json', '.md', '.tsv', '.py', '.txt'}
CODE_EXTENSIONS = {'.html', '.css', '.js'}

ERRORS = []
WARNINGS = []
PASSED = 0

def log_error(file_path, message):
    rel = file_path.relative_to(ROOT_DIR) if isinstance(file_path, Path) else file_path
    ERRORS.append(f"[ERROR] {rel}: {message}")

def log_warning(file_path, message):
    rel = file_path.relative_to(ROOT_DIR) if isinstance(file_path, Path) else file_path
    WARNINGS.append(f"[WARN]  {rel}: {message}")

def log_pass():
    global PASSED
    PASSED += 1

def collect_files():
    collected = []
    for root, dirs, files in os.walk(ROOT_DIR):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for f in files:
            path = Path(root) / f
            if path.suffix.lower() in TEXT_EXTENSIONS:
                collected.append(path)
    return collected

def check_utf8_encoding(file_path):
    try:
        raw = file_path.read_bytes()
        if raw.startswith(b'\xef\xbb\xbf'):
            log_warning(file_path, "File mengandung UTF-8 BOM, disarankan UTF-8 tanpa BOM.")
        raw.decode('utf-8')
        log_pass()
    except UnicodeDecodeError as e:
        log_error(file_path, f"Bukan encoding UTF-8 valid ({e}).")

def check_html_standards(file_path, content):
    if 'components' in file_path.parts:
        log_pass()
        return
    lower = content.lower()
    if '<!doctype html>' not in lower:
        log_error(file_path, "Tidak memiliki deklarasi <!DOCTYPE html>.")
    if '<meta charset="utf-8"' not in lower and "<meta charset='utf-8'" not in lower:
        log_error(file_path, 'Tidak memiliki <meta charset="UTF-8">.')
    if 'name="viewport"' not in lower and "name='viewport'" not in lower:
        log_error(file_path, 'Tidak memiliki <meta name="viewport">.')
    if '<html' in lower and 'lang=' not in lower:
        log_warning(file_path, "Tag <html> sebaiknya memiliki atribut lang (misal: lang=\"id\").")
    log_pass()

def check_inline_code(file_path, content):
    if file_path.suffix.lower() != '.html':
        return
    style_attr = re.search(r'\sstyle\s*=\s*["\'][^"\']*["\']', content, re.IGNORECASE)
    if style_attr:
        log_error(file_path, f"Ditemukan inline style CSS: '{style_attr.group(0).strip()}'. Gunakan class eksternal.")
    inline_events = re.findall(r'\s(on[a-z]{3,15})\s*=\s*["\'][^"\']*["\']', content, re.IGNORECASE)
    if inline_events:
        unique_events = sorted(set(inline_events))
        log_error(file_path, f"Ditemukan inline JavaScript event handler: {', '.join(unique_events)}. Gunakan addEventListener.")
    internal_style = re.search(r'<style\b[^>]*>(.*?)</style>', content, re.DOTALL | re.IGNORECASE)
    if internal_style and internal_style.group(1).strip():
        log_error(file_path, "Ditemukan internal CSS tag <style>...</style>. Pindahkan ke file .css terpisah.")
    internal_script = re.finditer(r'<script\b([^>]*)>(.*?)</script>', content, re.DOTALL | re.IGNORECASE)
    for m in internal_script:
        attrs = m.group(1)
        body = m.group(2).strip()
        if 'src=' not in attrs.lower() and body:
            log_error(file_path, "Ditemukan internal JavaScript tag <script>...</script> langsung. Pindahkan ke file .js terpisah.")
    log_pass()

def check_cache_busting(file_path, content):
    cache_bust = re.search(r'(href|src)\s*=\s*["\'][^"\']+\?([vV]=|\d{6,}|t=|ver=)[^"\']*["\']', content, re.IGNORECASE)
    if cache_bust:
        log_error(file_path, f"Ditemukan cache busting parameter pada URL: {cache_bust.group(0).strip()}. Dilarang sesuai pedoman.")
    else:
        log_pass()

def check_comments_in_code(file_path, content):
    ext = file_path.suffix.lower()
    if ext == '.html':
        comments = re.findall(r'<!--(.*?)-->', content, re.DOTALL)
        if comments:
            log_error(file_path, f"Ditemukan {len(comments)} komentar HTML. Seluruh file HTML harus bersih dari komentar.")
    elif ext == '.css':
        css_comments = re.findall(r'/\*(.*?)\*/', content, re.DOTALL)
        if css_comments:
            log_error(file_path, f"Ditemukan {len(css_comments)} komentar CSS. Seluruh file CSS harus bersih dari komentar.")
    elif ext == '.js':
        js_multiline = re.findall(r'/\*.*?\*/', content, re.DOTALL)
        lines = content.splitlines()
        js_single = [line for line in lines if line.strip().startswith('//')]
        if js_multiline or js_single:
            total = len(js_multiline) + len(js_single)
            log_error(file_path, f"Ditemukan {total} komentar JavaScript. Seluruh file JS harus bersih dari komentar.")
    log_pass()

def check_ui_ux_standards(file_path, content):
    ext = file_path.suffix.lower()
    if ext == '.css':
        if '-webkit-line-clamp' in content:
            log_error(file_path, "Dilarang menggunakan '-webkit-line-clamp'. Gunakan card flex alami dengan margin-top: auto pada tombol, atau potong teks via ringkasan data.")
        if 'display: -webkit-box' in content or 'display:-webkit-box' in content:
            log_error(file_path, "Ditemukan 'display: -webkit-box' usang. Hindari peretasan box-orient yang tidak didukung secara stabil.")
        if 'prefers-reduced-motion' in content.lower():
            log_error(file_path, "Dilarang menggunakan '@media (prefers-reduced-motion)'. Seluruh animasi dan transisi harus tetap aktif dan hidup di semua perangkat.")
    log_pass()

def check_links_and_assets(file_path, content):
    if file_path.suffix.lower() != '.html':
        return
    matches = re.findall(r'(href|src)\s*=\s*["\']([^"\']+)["\']', content, re.IGNORECASE)
    for attr, target in matches:
        target = target.strip()
        if not target or target.startswith(('#', 'javascript:', 'mailto:', 'tel:', 'data:')):
            continue
        parsed = urlparse(target)
        if parsed.scheme in ('http', 'https', '//'):
            continue
        clean_path = parsed.path.split('?')[0].split('#')[0]
        if not clean_path:
            continue
        if clean_path.startswith('/'):
            target_file = ROOT_DIR / clean_path.lstrip('/')
        else:
            target_file = (file_path.parent / clean_path).resolve()
        if not target_file.exists():
            if not clean_path.endswith(('.html', '.css', '.js', '.webp', '.png', '.jpg', '.svg', '.json', '.ico', '.webmanifest')):
                continue
            log_error(file_path, f"Broken link/asset pada {attr}=\"{target}\" (Target tidak ditemukan di {target_file}).")
    log_pass()

def check_css_overflow_guard(file_path, content):
    if file_path.name.lower() in ('reset.css', 'typography.css'):
        return
    if 'overflow-x: hidden' in content.lower() and 'body' in content.lower():
        log_warning(file_path, "Ditemukan 'overflow-x: hidden' pada body. Jangan sembunyikan overflow; tangani elemen penyebabnya.")
    log_pass()

def run_all_checks():
    files = collect_files()
    for f in files:
        check_utf8_encoding(f)
        try:
            content = f.read_text(encoding='utf-8')
        except Exception:
            continue
        ext = f.suffix.lower()
        if ext in CODE_EXTENSIONS:
            check_cache_busting(f, content)
            check_comments_in_code(f, content)
            check_ui_ux_standards(f, content)
        if ext == '.html':
            check_html_standards(f, content)
            check_inline_code(f, content)
            check_links_and_assets(f, content)
        if ext == '.css':
            check_css_overflow_guard(f, content)

    print("=" * 60)
    print("HASIL AUDIT VALIDASI KUALITAS PROYEK")
    print("=" * 60)
    print(f"Total Berkas Diperiksa : {len(files)}")
    print(f"Pemeriksaan Lolos     : {PASSED}")
    print(f"Peringatan (Warnings) : {len(WARNINGS)}")
    print(f"Kesalahan (Errors)    : {len(ERRORS)}")
    print("=" * 60)

    if WARNINGS:
        print("\nDAFTAR PERINGATAN:")
        for w in WARNINGS:
            print(f"  {w}")

    if ERRORS:
        print("\nDAFTAR KESALAHAN YANG WAJIB DIPERBAIKI:")
        for e in ERRORS:
            print(f"  {e}")
        print("\nSTATUS: GAGAL (Terdapat kesalahan yang melanggar pedoman proyek).")
        return 1
    else:
        print("\nSTATUS: LULUS (Seluruh pedoman proyek terpenuhi dengan sempurna).")
        return 0

if __name__ == '__main__':
    sys.exit(run_all_checks())
