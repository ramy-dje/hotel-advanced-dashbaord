import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        primary: {
          lighter: "rgb(var(--primary-lighter))",
          DEFAULT: "hsl(var(--primary))",
          dark: "rgb(var(--primary-dark))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          lighter: "rgb(var(--secondary-lighter))",
          DEFAULT: "hsl(var(--secondary))",
          dark: "rgb(var(--secondary-dark))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        red: {
          lighter: "rgb(var(--red-lighter))",
          DEFAULT: "rgb(var(--red-default))",
          dark: "rgb(var(--red-dark))",
        },
        orange: {
          lighter: "rgb(var(--orange-lighter))",
          DEFAULT: "rgb(var(--orange-default))",
          dark: "rgb(var(--orange-dark))",
        },
        blue: {
          lighter: "rgb(var(--blue-lighter))",
          DEFAULT: "rgb(var(--blue-default))",
          dark: "rgb(var(--blue-dark))",
        },
        green: {
          lighter: "rgb(var(--green-lighter))",
          DEFAULT: "rgb(var(--green-default))",
          dark: "rgb(var(--green-dark))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
