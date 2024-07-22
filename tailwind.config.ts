import type { Config } from "tailwindcss";

const config: {
  plugins: any[];
  theme: {
    extend: {
      backgroundImage: { "gradient-conic": string; "gradient-radial": string };
      textColor: { "selected-tab": string };
      colors: {
        wallpaper: string;
        "console-layout": string;
        "console-active": string;
        "sandy-1": string;
        "mypage-layout": string;
        "sandy-2": string;
        "woody-1": string;
        "sandy-3": string;
        "mypage-active-3": string;
        "mypage-active-2": string;
        "mypage-active-1": string;
        "mypage-button-2": string;
        "mypage-button-1": string;
        "mono-1": string;
        "mono-2": string;
        "mono-3": string;
        "mono-4": string;
        "other-1": string
      }
    }
  };
  content: string[]
} = {
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
      textColor: {
        'selected-tab': 'white', // Change this to your desired text color
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
        'wallpaper' : '#ffffff',
        'console-layout' : '#dddddd',
        'console-active' : '#dddddd',
        'other-1' : '#a29677',
        'mypage-layout' : '#dddddd',
        'mypage-active-1' : '#dddddd',
        'mypage-active-2' : '#dddddd',
        'mypage-active-3' : '#eeeeee',
        'mypage-button-1' : '#6a6b8c',
        'mypage-button-2' : '#53547c',
      }
    },
  },
  plugins: [],
};
export default config;
