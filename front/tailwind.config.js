/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/**.{html,js,jsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                'dark-black': '#0b1120',
                'dark-blue': 'rgba(0,0,0,0.49)',
                'white-blue': '#0A87DA',
                'light-mode-bg': '#f5f5f5',
                'adminpanel-bg':'#E5E5E5',
                'adminpanel-ui':'#FFFFFF',

            },
        },
    },
    plugins: [],
}



