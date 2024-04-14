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
        "site-purple": {
          r: "#7153f5",
          l: "#f1eefd",
        },
        "site-blue": {
          r: "#4ba5f8",
          l: "#ddf1fb",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
