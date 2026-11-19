/* ==========================================================================
   Vanilla CSS Mobile-First Starter
   Standar: Breakpoint responsif, tipografi fluida, media, & touch target
   ========================================================================== */

:root {
  /* Tipografi Fluida (Mobile -> Desktop) */
  --font-sans: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --text-xs: 0.8125rem;  /* 13px - caption/meta */
  --text-sm: 0.875rem;   /* 14px - label/sekunder */
  --text-base: 1rem;     /* 16px - body & input minimum */
  --text-lg: clamp(1.125rem, 1rem + 0.5vw, 1.25rem);
  --text-h2: clamp(1.375rem, 1.1rem + 1.5vw, 2rem);
  --text-h1: clamp(1.75rem, 1.2rem + 2.5vw, 3rem); /* 28px -> 48px */

  /* Keterbacaan */
  --leading-body: 1.6;
  --leading-heading: 1.2;
  --measure: 65ch; /* Lebar baris ideal (45-75 karakter) */

  /* Spasi & Layout */
  --space-xs: 0.5rem;  /* 8px - jarak minimum antar touch target */
  --space-sm: 1rem;    /* 16px */
  --space-md: 1.5rem;  /* 24px */
  --space-lg: 2.5rem;  /* 40px */
  --container-max: 1200px;

  /* Touch Target (Rekomendasi iOS 44px / Android 48px) */
  --touch-min: 44px;
  --touch-comfortable: 48px;
}

/* 1. Reset Dasar & Box Sizing */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  font-size: 100%; /* 16px default browser */
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: var(--leading-body);
  color: #1f2937;
  background-color: #ffffff;
}

/* 2. Tipografi */
h1, h2, h3 {
  margin-top: 0;
  line-height: var(--leading-heading);
}

h1 { font-size: var(--text-h1); }
h2 { font-size: var(--text-h2); }
h3 { font-size: var(--text-lg); }

p {
  margin-top: 0;
  max-width: var(--measure);
}

small,
.caption {
  font-size: var(--text-sm);
}

/* Cegah auto-zoom pada iOS Safari saat input difokuskan */
input,
select,
textarea {
  font-family: inherit;
  font-size: max(1rem, 16px);
  min-height: var(--touch-min);
  padding: 0.5rem 0.75rem;
}

/* 3. Media Responsif (Gambar, Video, Iframe) */
img,
picture,
video,
svg {
  display: block;
  max-width: 100%;
  height: auto;
}

.media-frame {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

/* 4. Elemen Interaktif & Touch Target */
button,
.btn,
a.nav-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  min-width: var(--touch-min);
  min-height: var(--touch-min);
  padding: 0.625rem 1.25rem;
  font-size: var(--text-base);
  cursor: pointer;
  text-decoration: none;
}

/* Jarak aman antar tombol di mobile */
.action-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

/* 5. Layout Mobile-First & Grid */
.container {
  width: 100%;
  margin-inline: auto;
  padding-inline: var(--space-sm);
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-sm);
}

/* ==========================================================================
   6. Media Queries (Mobile-First: min-width)
   ========================================================================== */

/* Small (sm): Smartphone besar / landscape (>= 640px) */
@media (min-width: 640px) {
  .grid-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Medium (md): Tablet portrait (>= 768px) */
@media (min-width: 768px) {
  .container {
    padding-inline: var(--space-md);
  }

  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-md);
  }
}

/* Large (lg): Tablet landscape & Laptop kecil (>= 1024px) */
@media (min-width: 1024px) {
  .container {
    max-width: var(--container-max);
  }

  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Extra Large (xl): Desktop standar (>= 1280px) */
@media (min-width: 1280px) {
  .grid-4 {
    grid-template-columns: repeat(4, 1fr);
  }
}