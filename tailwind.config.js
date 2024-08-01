/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
  ],
  purge: {
    content: [
      "./src/**/*.{html,ts}",
    ],
    options: {
      safelist: [
        // Add PrimeNG classes here to exclude them from purging
        'p-table',
        // Add more PrimeNG classes as needed
      ],
    },
  },
};