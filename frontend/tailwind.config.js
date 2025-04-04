// tailwind.config.js

import withMT from "@material-tailwind/react/utils/withMT";
module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        lightBlue: "#f4f5fe",
        grey: "#7e7e7e",
        lightGrey: "#f5f5f5",
        orange: "#ef7c1a",
        dark: "#000000",
      },
      textColor: {
        DEFAULT: "#000000", 
      },
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
