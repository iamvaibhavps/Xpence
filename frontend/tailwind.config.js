// tailwind.config.js

import withMT from "@material-tailwind/react/utils/withMT";
module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        sm: "640px",
        md: "800px",
        lg: "1100px",
        xl: "1480px",
        "2xl": "1536px",
        custom: "1600px",
      },
      fontFamily: {
        sans: ["DM Sans", "Poppins", "sans-serif"],
        poppins: ["Poppins", "sans-serif"], // Add this line
      },
    },
  },
  plugins: [],
});
