import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      colors: {
        'sandy-1' : '#F2CD88',
        'sandy-2' : '#F2BA52',
        'sandy-3' : '#F2A950',
        'mono-1' : '#EEEEEE',
        'mono-2' : '#BFBFBF',
        'mono-3' : '#808080',
        'mono-4' : '#404040',
        'woody-1' : '#735B46',
        'wallpaper' : '#b4c0be',
        'console-layout' : '#b4b3af',
        'console-active' : '#9d9b97',
        'other-1' : '#a29677',
        'mypage-layout' : '#bfc0d2',
        'mypage-active-1' : '#a2a4c7',
        'mypage-active-2' : '#9c9dd2',
        'mypage-button-1' : '#6a6b8c',
        'mypage-button-2' : '#53547c',
      }
    },
  },
  plugins: [],
};
export default config;
