/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

export default withMT({
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                'open-menu': {
                    '0%': {'transform': 'scaleY(0)'},
                    '80%': {'transform': 'scaleY(1.2)'},
                    '100%': {'transform': 'scaleY(1)'}
                }
            },
            animation: {
                'open-menu': 'open-menu .8s ease-in-out forwards'
            }
        },
    },
    plugins: [],
    darkMode:'class'
})
