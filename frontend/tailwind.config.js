/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "main": "#132b3c",
        "input": "#c96a36",
        "input2": "#755243"
      },
    },
  },
  plugins: [
    function({addUtilities}){
      const newUtilities = {
        "no-scrollbar::-webkit-scrollbar":{
          display:"none",
        },
        "no-scrollbar": {
          "-ms-scrollbar": {
            "-ms-overflow-style": "none",
            "scrollbar-w": "none"
          }
      }
    }
    addUtilities(newUtilities);
    }
  ],
}

