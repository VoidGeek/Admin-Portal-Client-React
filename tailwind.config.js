module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Define your custom colors here
        'custom-white': 'rgba(255, 255, 255, 1)',
        'custom-gray': 'rgba(216, 217, 161, 1)',
        'custom-blue': 'rgba(183, 206, 210, 1)',
        'custom-pink': 'rgba(227, 186, 191, 1)',
        'custom-yellow': 'rgba(225, 228, 200, 1)',
      },
    },
  },
  plugins: [],
  purge: {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  },
  
};
