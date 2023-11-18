import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        "todos-dark": "#25273D",
        "todos-light": "#FFFFFF",
        "todotxt-light": "#494C6B",
        "grad-blue": "#55DDFF",
        "grad-purple": "#C058F3",
        "todotxt-dark-complete": "#4D5067",
        "todotxt-light-complete": "#D1D2DA",
        "todotxt-dark": "#C8CBE7",
        "seperator-dark": "#393A4B",
        "seperator-light": "#E3E4F1",
        "btn-dark": "#5B5E7E",
        "btn-light": "#9495A5",
        dark: "#171823",
        light: "#FAFAFA",
        "bright-blue": "#3A7CFD",
        "placeholder-dark": "#767992",
        "placeholder-light": "#9495A5",
      },
    },
  },
  plugins: [],
} satisfies Config;
