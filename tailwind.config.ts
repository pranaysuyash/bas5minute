import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Bollywood theme
        'bollywood-magenta': '#FF4F7B',
        'bollywood-gold': '#FFD166',
        'bollywood-black': '#1C1C1C',

        // Monsoon theme
        'monsoon-teal': '#009CA6',
        'monsoon-blue': '#0E4E68',
        'monsoon-cloud': '#F2F9FB',

        // Sandstone theme
        'sandstone-amber': '#FFC045',
        'sandstone-brick': '#B64926',
        'sandstone-cream': '#F6EAD7',

        // Neon Nights theme
        'neon-lime': '#C3FF00',
        'neon-cyan': '#00FFE0',
        'neon-charcoal': '#121212',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
