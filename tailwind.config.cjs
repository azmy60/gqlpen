/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {},
    },
    plugins: [require('daisyui')],
    daisyui: {
        logs: false,
        themes: [
            {
                forest: {
                    ...require('daisyui/src/colors/themes')[
                        '[data-theme=forest]'
                    ],
                    primary: '#1363DF',
                    secondary: '#1d4ed8',
                    accent: '#34d399',
                    neutral: '#16181D',
                    'base-100': '#050505',
                    info: '#3ABFF8',
                    success: '#36D399',
                    warning: '#facc15',
                    error: '#ef4444',
                },
            },
        ],
    },
};
