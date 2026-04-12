# CSS Color Level 4 Specification

Reference documentation for implementing CSS-compliant color parsing.

## Summary of Changes from Level 3 to Level 4

- **Modern syntax**: space-separated components, `/` for alpha
- **`none` keyword**: for missing/powerless components (treated as `0` for rendering)
- **Angle units**: `deg`, `grad`, `rad`, `turn` for hue values
- **`rgb()`/`rgba()` and `hsl()`/`hsla()`**: now aliases (both support alpha)
- **New color spaces**: OkLab, OkLCH, Lab, LCH, HWB, color()

---

## 1. RGB() / RGBA()

### Modern Syntax (Level 4)
```css
rgb([<number> | <percentage> | none]{3} [/ [<alpha-value> | none]]?)
```

### Legacy Syntax (Level 3, still supported)
```css
rgb(<percentage>#{3}, <alpha-value>?)
rgb(<number>#{3}, <alpha-value>?)
```

### Key Differences
| Feature | Modern | Legacy |
|---------|--------|--------|
| Separator | Space | Comma |
| Alpha | `/ 0.5` | `, 0.5` |
| Mix types | `rgb(100% 128 50%)` | Not allowed |
| `none` keyword | Supported | Not supported |

### Value Mappings
- **Number range**: 0-255
- **Percentage**: 0% = 0, 100% = 255

### Examples
```css
rgb(255 0 0)              /* Modern */
rgb(255 0 0 / 0.5)        /* Modern with alpha */
rgb(none 128 255)         /* none keyword */
rgb(255, 0, 0)            /* Legacy */
rgba(255, 0, 0, 0.5)      /* Legacy with alpha */
```

---

## 2. HSL() / HSLA()

### Modern Syntax (Level 4)
```css
hsl(<hue> <percentage> <percentage> [/ [<alpha-value> | none]]?)
```

### Legacy Syntax (Level 3, still supported)
```css
hsl(<hue>, <percentage>, <percentage>, <alpha-value>?)
```

### Hue Angle Units
| Unit | Full Circle | Conversion |
|------|-------------|------------|
| (none) | 360 | Interpreted as degrees |
| `deg` | 360deg | As-is |
| `grad` | 400grad | value * 0.9 |
| `rad` | 2π rad | value * (180/π) |
| `turn` | 1turn | value * 360 |

### Examples
```css
hsl(120 100% 50%)         /* Modern */
hsl(120deg 100% 50%)      /* Explicit degrees */
hsl(0.33turn 100% 50%)    /* Turns */
hsl(2.094rad 100% 50%)    /* Radians */
hsl(133.33grad 100% 50%)  /* Gradians */
hsl(none 50% 50%)         /* none keyword */
hsl(120, 100%, 50%)       /* Legacy */
```

---

## 3. OkLab()

### Syntax (Modern Only)
```css
oklab([<percentage> | <number> | none]{3} [/ [<alpha-value> | none]]?)
```

### Value Mappings
| Component | Number Range | Percentage Mapping |
|-----------|--------------|-------------------|
| L (Lightness) | 0-1 | 100% = 1 |
| a (Green/Red) | -0.4 to 0.4 | 100% = 0.4 |
| b (Blue/Yellow) | -0.4 to 0.4 | 100% = 0.4 |

### Examples
```css
oklab(0.5 0.1 0.2)
oklab(50% 25% 50%)
oklab(0.5 0.1 0.2 / 0.8)
oklab(none 0.1 -0.1)
```

---

## 4. OkLCH()

### Syntax (Modern Only)
```css
oklch([<percentage> | <number> | none] [<percentage> | <number> | none] [<hue> | none] [/ [<alpha-value> | none]]?)
```

### Value Mappings
| Component | Number Range | Percentage Mapping |
|-----------|--------------|-------------------|
| L (Lightness) | 0-1 | 100% = 1 |
| C (Chroma) | 0-0.5 | **100% = 0.4** |
| H (Hue) | 0-360 | Supports angle units |

### Examples
```css
oklch(0.5 0.15 120)
oklch(50% 37.5% 120deg)
oklch(0.5 0.15 0.33turn)
oklch(0.5 0.15 2.09rad)
oklch(0.5 none 180)
```

---

## 5. The `none` Keyword

- Available in **modern syntax only** (space-separated)
- Treated as `0` for rendering purposes
- Indicates a missing/powerless component

### Powerless Components
- **HSL/OkLCH hue**: powerless when saturation/chroma = 0
- Automatically treated as `none` in interpolation

---

## 6. Alpha Channel

### Syntax
- **Modern**: `/ <alpha-value>` (e.g., `rgb(255 0 0 / 0.5)`)
- **Legacy**: `, <alpha-value>` (e.g., `rgba(255, 0, 0, 0.5)`)

### Values
- **Number**: 0 (transparent) to 1 (opaque)
- **Percentage**: 0% to 100%
- **Default**: 1 (100% opaque) if omitted

---

## 7. Not Implemented

The following CSS Color Level 4/5 features are not implemented in this library:

- **HWB()**: Hue-Whiteness-Blackness
- **Lab()**: CIE LAB color space
- **LCH()**: CIE LCH color space
- **color()**: Generic color function for wide-gamut spaces
- **Relative color syntax**: `oklch(from purple l c h)`

---

## Sources

- [CSS Color Module Level 4 - W3C](https://w3.org/TR/css-color-4)
- [CSS Color Module Level 5 - CSSWG Drafts](https://drafts.csswg.org/css-color-5/)
- [CSS Values and Units Module Level 4](https://www.w3.org/TR/css-values-4/)
