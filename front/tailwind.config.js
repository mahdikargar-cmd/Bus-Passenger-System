/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/**.{html,js,jsx,ts ,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            transitionDuration: {
                '2000': '2000ms',
            },
            transitionTimingFunction: {
                'ease-out-custom': 'ease-out',
            },

            colors: {
                'dark-black': '#0b1120',
                'dark-blue': 'rgba(0,0,0,0.49)',
                'white-blue': '#0A87DA',
                'hover-blue': '#3e81e1',
                'admin-modal':'rgb(100 116 139)',
                'light-mode-bg': '#f5f5f5',
                'adminpanel-bg':'#E5E5E5',
                'adminpanel-ui':'#FFFFFF',
                'show-data':'rgb(148 163 184)'

            },
            width: {
                '10p': '10%',
                '20p': '20%',
                '30p': '30%',
            },
        },
    },
    plugins: [],
}



