import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://gilbarbara.github.io',
  base: '/colorizr',
  integrations: [
    starlight({
      title: '',
      logo: {
        src: './public/logo.svg',
      },
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/gilbarbara/colorizr' }],
      editLink: {
        baseUrl: 'https://github.com/gilbarbara/colorizr/edit/main/docs/',
      },
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        { label: 'Getting Started', link: '/getting-started/' },
        {
          label: 'Generators',
          items: [
            { label: 'scale', link: '/generators/scale/' },
            { label: 'palette', link: '/generators/palette/' },
            { label: 'scheme', link: '/generators/scheme/' },
            { label: 'random', link: '/generators/random/' },
            { label: 'mix', link: '/generators/mix/' },
          ],
        },
        {
          label: 'Accessibility',
          items: [
            { label: 'apcaContrast', link: '/accessibility/#apcacontrast' },
            { label: 'contrast', link: '/accessibility/#contrast' },
            { label: 'readableColor', link: '/accessibility/#readablecolor' },
          ],
        },
        {
          label: 'Comparison',
          items: [
            { label: 'brightnessDifference', link: '/comparison/#brightnessdifference' },
            { label: 'colorDifference', link: '/comparison/#colordifference' },
            { label: 'compare', link: '/comparison/#compare' },
            { label: 'deltaE', link: '/comparison/#deltae' },
          ],
        },
        {
          label: 'Info',
          items: [
            { label: 'chroma', link: '/info/#chroma' },
            { label: 'luminance', link: '/info/#luminance' },
            { label: 'name', link: '/info/#name' },
            { label: 'opacity', link: '/info/#opacity' },
          ],
        },
        {
          label: 'Manipulation',
          items: [
            { label: 'lighten', link: '/manipulation/#lighten' },
            { label: 'darken', link: '/manipulation/#darken' },
            { label: 'saturate', link: '/manipulation/#saturate' },
            { label: 'desaturate', link: '/manipulation/#desaturate' },
            { label: 'rotate', link: '/manipulation/#rotate' },
            { label: 'invert', link: '/manipulation/#invert' },
            { label: 'grayscale', link: '/manipulation/#grayscale' },
            { label: 'opacify', link: '/manipulation/#opacify' },
            { label: 'transparentize', link: '/manipulation/#transparentize' },
          ],
        },
        {
          label: 'Converters',
          items: [
            { label: 'HEX', link: '/converters/#from-hex' },
            { label: 'HSL', link: '/converters/#from-hsl' },
            { label: 'OkLab', link: '/converters/#from-oklab' },
            { label: 'OkLCH', link: '/converters/#from-oklch' },
            { label: 'RGB', link: '/converters/#from-rgb' },
            { label: 'convertCSS', link: '/converters/#convertcss' },
          ],
        },
        {
          label: 'Gamut',
          items: [
            { label: 'getP3MaxChroma', link: '/gamut/#getp3maxchroma' },
            { label: 'getP3MaxColor', link: '/gamut/#getp3maxcolor' },
            { label: 'toGamut', link: '/gamut/#togamut' },
          ],
        },
        {
          label: 'Parsers',
          items: [
            { label: 'extractColorParts', link: '/parsers/#extractcolorparts' },
            { label: 'getColorType', link: '/parsers/#getcolortype' },
            { label: 'parseCSS', link: '/parsers/#parsecss' },
          ],
        },
        {
          label: 'Formatters',
          items: [
            { label: 'formatCSS', link: '/formatters/#formatcss' },
            { label: 'formatHex', link: '/formatters/#formathex' },
          ],
        },
        {
          label: 'Validators',
          items: [
            { label: 'isValidColor', link: '/validators/#isvalidcolor' },
            { label: 'Type Guards', link: '/validators/#type-guards' },
          ],
        },
        {
          label: 'Utilities',
          items: [
            { label: 'Alpha / Hex', link: '/utilities/#alpha--hex-utilities' },
            { label: 'Scale Helpers', link: '/utilities/#scale-helpers' },
          ],
        },
        { label: 'Colorizr Class', link: '/class/' },
        {
          label: 'Exports',
          items: [
            { label: 'Types', link: '/exports/types/' },
            { label: 'Constants', link: '/exports/constants/' },
            { label: 'Helpers', link: '/exports/helpers/' },
          ],
        },
        { label: 'Recipes', link: '/recipes/' },
        {
          label: 'Companion Apps',
          items: [
            { label: 'ColorMeUp', link: 'https://colormeup.co', attrs: { target: '_blank' } },
            {
              label: 'ColorMeUp Lab',
              link: 'https://lab.colormeup.co',
              attrs: { target: '_blank' },
            },
          ],
        },
      ],
    }),
    react(),
  ],
});
