import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      // --spacing is 0.25rem (4px); * 4 → 1rem / 16px container padding
      padding: "calc(var(--spacing) * 4)",
      screens: {
        xs: "30rem", // 480px
        sm: "40rem", // 640px
        md: "48rem", // 768px
        tablet: "56.25rem", // 900px
        lg: "64rem", // 1024px
        xl: "80rem", // 1280px
        "2xl": "96rem", // 1536px
        ultrawide: "160rem", // 2560px
      },
    },
    extend: {
      /*
       * Shared breakpoints (src/lib/breakpoints.ts + --breakpoint-* in index.css).
       * Collapsed: 600→sm, 860→tablet; Footer/Connect 900→tablet.
       */
      screens: {
        xs: "480px",
        tablet: "900px",
        ultrawide: "2560px",
      },
      transitionDuration: {
        1200: "1200ms",
      },
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
        bagel: ["Bagel Fat One", "cursive"],
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
          blue: "var(--accent-blue)",
          emerald: "var(--accent-emerald)",
          purple: "var(--accent-purple)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        brand: {
          gold: "var(--brand-gold)",
          cream: "var(--brand-cream)",
          black: "var(--brand-black)",
          ink: "var(--brand-ink)",
          DEFAULT: "var(--color-brand)",
          highlight: "var(--color-brand-highlight)",
        },
        page: "var(--color-page)",
        ink: "var(--color-ink)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "elevation-sm": "var(--elevation-sm-radius)",
        "elevation-md": "var(--elevation-md-radius)",
        "elevation-lg": "var(--elevation-lg-radius)",
      },
      boxShadow: {
        "elevation-sm": "var(--elevation-sm-shadow)",
        "elevation-md": "var(--elevation-md-shadow)",
        "elevation-lg": "var(--elevation-lg-shadow)",
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
  plugins: [tailwindAnimate],
} satisfies Config;
