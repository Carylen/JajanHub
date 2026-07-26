/**
 * JajanHub design tokens — single source of truth for both apps.
 * Extracted from the "Antri" design files. Extend this preset in each app's
 * tailwind config; never redefine colors/radii/shadows locally.
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: { light: '#FFB870', DEFAULT: '#FF7A1A', deep: '#E4560A', press: '#C4402F' },
        mint: { DEFAULT: '#16C784', deep: '#0E9F6E', soft: '#DFF7EC' },
        prio: { DEFAULT: '#7A3BF5', soft: '#F1E9FF', ink: '#2A1A3E' },
        danger: { DEFAULT: '#E5484D', soft: '#FFEBE9' },
        ink: '#23180F',
        muted: '#6B5D50',
        faint: '#9A8A7C',
        line: '#EDE3D6',
        cream: '#FFF8F1',
        sand: '#E7DCCE',
        card: '#FFFFFF',
      },
      fontFamily: {
        display: ['var(--font-bricolage)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
        '3xl': '26px',
      },
      boxShadow: {
        soft: '0 14px 34px rgba(35,24,15,.11)',
        card: '0 5px 16px rgba(35,24,15,.05)',
        raised: '0 12px 26px rgba(255,122,26,.36)',
      },
      maxWidth: {
        app: '420px',
        tablet: '688px',
        vendor: '480px',
      },
      keyframes: {
        screenIn: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'none' } },
        pop: { '0%': { transform: 'scale(1)' }, '42%': { transform: 'scale(1.32)' }, '100%': { transform: 'scale(1)' } },
        pulse: { '0%,100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '.4', transform: 'scale(.78)' } },
        dots: { '0%,20%': { opacity: '.25' }, '50%': { opacity: '1' }, '100%': { opacity: '.25' } },
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-5px)' } },
        toastIn: { from: { opacity: '0', transform: 'translateY(-18px)' }, to: { opacity: '1', transform: 'none' } },
        qnum: { from: { opacity: '0', transform: 'scale(.72)' }, to: { opacity: '1', transform: 'none' } },
        ringpulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(255,122,26,.4)' },
          '70%': { boxShadow: '0 0 0 22px rgba(255,122,26,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(255,122,26,0)' },
        },
        popin: { '0%': { transform: 'scale(.4)', opacity: '0' }, '60%': { transform: 'scale(1.12)' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        ripple: { '0%': { transform: 'scale(.6)', opacity: '.5' }, '100%': { transform: 'scale(2.4)', opacity: '0' } },
        sheetUp: { from: { transform: 'translateY(100%)' }, to: { transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        numflip: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'none' } },
        spin: { to: { transform: 'rotate(360deg)' } },
        barGrow: { from: { transform: 'scaleY(0)' }, to: { transform: 'scaleY(1)' } },
        shakex: {
          '0%,100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-5px)' },
          '80%': { transform: 'translateX(5px)' },
        },
        modalIn: {
          from: { opacity: '0', transform: 'scale(.94)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(120px) rotate(240deg)', opacity: '0' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-30px) rotate(0deg)', opacity: '0' },
          '12%': { opacity: '1' },
          '100%': { transform: 'translateY(440px) rotate(430deg)', opacity: '0' },
        },
        slideCard: {
          from: { opacity: '0', transform: 'translateY(10px) scale(.98)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        'screen-in': 'screenIn .4s ease',
        pop: 'pop .3s ease',
        pulse: 'pulse 1.9s infinite',
        dots: 'dots 1.2s infinite',
        floaty: 'floaty 2.8s ease-in-out infinite',
        'toast-in': 'toastIn .4s ease',
        qnum: 'qnum .5s ease',
        ringpulse: 'ringpulse 2s infinite',
        popin: 'popin .5s ease',
        ripple: 'ripple 1.8s infinite',
        'sheet-up': 'sheetUp .3s cubic-bezier(.2,.8,.2,1)',
        'fade-in': 'fadeIn .2s ease',
        numflip: 'numflip .4s ease',
        spin: 'spin .9s linear infinite',
      },
    },
  },
};
