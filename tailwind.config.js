import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                cat: {
                    50: '#fff8f1',
                    100: '#ffefdb',
                    200: '#ffdbb0',
                    300: '#ffc07c',
                    400: '#ff9d40',
                    500: '#ff8014',
                    600: '#f06406',
                    700: '#c74b07',
                    800: '#9e3b0e',
                    900: '#7f3310',
                },
            },
        },
    },

    plugins: [forms],
};
