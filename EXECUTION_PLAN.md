# Bay Greenery GitHub Pages - Execution Plan

## Overview
Rebuild the Bay Greenery website (www.baygreenery.com) as a static GitHub Pages site with a fresh design, maintaining brand elements and content.

---

## Design Specifications

### Typography
- **Titles/Headers:** Harabara font (via CDN: fonts.cdnfonts.com)
- **Body text:** Open Sans or similar clean sans-serif (to be finalized - pairs well with Harabara)

### Colors
- **Background:** Same as current site – warm off-white/cream (`#f5f0e8` approximate from Wix site)
- **Accent:** Dark green/earthy tones for CTAs
- **Review bar:** Frosted glass effect – low opacity dark blue/grey (`rgba(30, 40, 50, 0.3)`) with `backdrop-filter: blur()`

---

## Section-by-Section Plan

### 1. Splash/Landing Page ✅
- Full-viewport landscape photo as background (`background-size: cover`)
- Company logotype centered at top
- "Book a Service >" CTA centered, positioned near bottom
- Single-page scroll layout (splash is first section)

### 2. Trust Building Section
- **Review bar:**
  - Chunky, readable review cards (reference: jpmlandscapes.com size)
  - Horizontal scroll functionality
  - Rounded rectangle frosted glass background (`backdrop-filter: blur(10px)`, `background: rgba(30, 40, 50, 0.25)`, `border-radius: 16px`)
- **Company Values:** Placeholder section – await text, images, layout from client

### 3. Most Popular Services
- "Services" header centered at top
- **Left half:** Bulleted list of services:
  - Landscape Construction, Design Services, Remodels & New Construction, Plantings, Drip and Sprinkler Irrigation, Drainage, Hardscape, Fencing, Retaining and Free-Standing Walls, Landscape Lighting, Water Features
  - Maintenance: Lawn and Landscape Care, Pesticide Application, Irrigation Management & Maintenance, Full Yard Cleanup & Restoration, Pressure Washing, Consultations
- **Right half (center-right):** "Book a Service >" link (no functionality for now)

### 4. Project Gallery
- CSS Grid or Flexbox tile gallery
- Largest/best landscape photos on left, progressively smaller/focused photos toward right
- "See Portfolio >" text button at bottom or side (no functionality for now)

### 5. About the Owner
- Similar layout to current site
- Content: Nathan's bio (horticulturist, Almaden Golf and Country Club, passion for plants, D&D, etc.)

### 6. Contact Footer
- ops@baygreenery.com
- (408) 454-8078
- San Jose, CA 95128
- Service Area: South Bay, Peninsula

---

## Image Inventory (from baygreenery.com)

| Use | File | Source ID |
|-----|------|-----------|
| Splash background | landscape1.jpg | 9ab2c9_2377690490e744deb40925965d619d42 |
| Gallery | landscape2.jpg | 9ab2c9_69dcd3dc6dec429f8f6ccf33478cc795 |
| Gallery | landscape3.jpg | 9ab2c9_ecbca0dfe40e4f2fad8a444c9f6170af |
| Logotype | logotype.png | 9ab2c9_8d1a11a527bd4104bcc36420f7881bdf |
| Gallery thumb | thumb1.jpg | 9ab2c9_abb2379c83034bdc81a7094bcb327938 |
| Gallery thumb | thumb2.jpg | 9ab2c9_d6fec3f44b704035bdf1797b464d859a |

---

## Future Scope (Not in Current Build)

### 3.5 Book a Service Form
- Dropdown: Services [Required]
- Contact: Name, Address, Phone, Email [Required]
- Project Timeline [Required]: ASAP or date picker
- Project Description [Optional] – large text area
- Project Site Photos [Optional] – file upload

---

## File Structure

```
baygrennery/
├── index.html          # Single-page site
├── styles.css          # All styles
├── script.js           # Scroll, review carousel if needed
├── images/
│   ├── landscape1.jpg  # Splash background
│   ├── landscape2.jpg
│   ├── landscape3.jpg
│   ├── logotype.png
│   ├── thumb1.jpg
│   └── thumb2.jpg
├── README.md           # Deployment instructions
├── EXECUTION_PLAN.md   # This file
└── .gitignore
```

---

## Deployment
See README.md for GitHub Pages deployment steps.
