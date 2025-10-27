import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0A',
        surface: '#111111',
        text: '#F3F3F3',
        card: '#0E0E0E',
        primary: '#D4AF37',
        accent: '#FFD66B',
      },
      boxShadow: {
        gold: '0 0 36px rgba(212,175,55,0.25)'
      },
      backgroundImage: {
        'gold-sheen': "linear-gradient(135deg, #7A5E10 0%, #D4AF37 35%, #F4E2B9 55%, #D4AF37 75%, #7A5E10 100%)"
      }
    }
  },
  plugins: []
};

export default config;


