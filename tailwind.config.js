/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    colors: {
      'blue': '#1172CC',
      'gray-1': '#545F71',
      'main-txt-color': '#344054',
      'sub-txt-color': '#475467',
      'disabled-txt-color': '#A9AFB8',
      'black': '#000',
      'border-color': '#DEDEDE',
    },


    screens: {

      'sm': '340px',
      // => @media (min-width: 340px) { ... }


      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      '2lg': '1190px',
            // => @media (min-width: 1190px) { ... }
      
      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1440px',
      // => @media (min-width: 1440px) { ... }

      '3xl': '1650px',
      // => @media (min-width: 1650px) { ... }
    },
    extend: {},
  },
  plugins: [],
}