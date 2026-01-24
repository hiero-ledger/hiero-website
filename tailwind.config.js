/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./layouts/**/*.{html,gohtml}",
    "./content/**/*.{md,html}",
    "./assets/**/*.{js,css}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        colors: "color, background-color, border-color",
        transform: "transform",
      },
      colors: {
        red: {
          DEFAULT: "#B81A56",
          dark: "#992350",
          light: "#D92D6A",
        },
        white: {
          DEFAULT: "#FFFFFF",
          dark: "#E5E4D7",
        },
        black: "#000000",
        charcoal: "#1E1E1E",
        sand: "#E5E4D7",
        gray: {
          DEFAULT: "#616161",
          light: "#EFEFEE",
        },
      },
      fontFamily: {
        serif: ['"Space Grotesk"'],
        ibm: ['"IBM Plex Mono"'],
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: [
          "1rem",
          {
            lineHeight: "1.313rem",
            letterSpacing: "-0.054rem",
            fontWeight: "400",
          },
        ],
        lg: [
          "1.125rem",
          {
            lineHeight: "1.438rem",
            letterSpacing: "-0.06rem",
            fontWeight: "400",
          },
        ],
        xl: [
          "1.75rem",
          {
            lineHeight: "2.25rem",
            letterSpacing: "-0.094rem",
            fontWeight: "400",
          },
        ],
        "2xl": [
          "2rem",
          {
            lineHeight: "2.25rem",
            letterSpacing: "-0.167rem",
            fontWeight: "400",
          },
        ],
        "3xl": [
          "2.25rem",
          {
            lineHeight: "2.875rem",
            letterSpacing: "-0.188rem",
            fontWeight: "400",
          },
        ],
        "4xl": [
          "4rem",
          {
            lineHeight: "4.5rem",
            letterSpacing: "-0.333rem",
            fontWeight: "400",
          },
        ],
        "5xl": [
          "7.5rem",
          {
            lineHeight: "6.875rem",
            letterSpacing: "-0.625rem",
            fontWeight: "400",
          },
        ],
      },
    },
  },
  plugins: [],
};
