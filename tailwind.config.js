// Every color is a design token (a CSS variable, see src/index.css), so the whole app can switch theme
// by toggling the class "dark" on <html>. Components only use these names: bg-surface, text-fg, border-line...
const c = (name) => 'rgb(var(--color-' + name + ') / <alpha-value>)';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        canvas: c('canvas'),
        surface: c('surface'),
        sunken: c('sunken'),
        fg: c('fg'),
        muted: c('muted'),
        line: c('line'),
        action: c('action'),
        'action-hover': c('action-hover'),
        'on-action': c('on-action'),
        brand: c('brand'),
        'on-brand': c('on-brand'),
        info: c('info'),
        success: c('success'),
        warning: c('warning'),
        'amber-intense': c('amber-intense'),
        danger: c('danger'),
      },
    },
  },
};