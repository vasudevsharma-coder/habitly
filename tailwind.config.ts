/** @type {import('tailwindcss').Config} */
export default {
    safelist: [
        {
            pattern: /bg-(violet|red|green|blue|orange|pink)-(300|400|500|950)/,
            variants: ['hover', 'dark', 'dark:hover'],
        },
        {
            pattern: /text-(violet|red|green|blue|orange|pink)-(400|950)/,
            variants: ['dark'],
        },
        {
            pattern: /from-(violet|red|green|blue|orange|pink)-(300|400|500|800)/,
            variants: ['dark'],
        },
        {
            pattern: /via-(violet|red|green|blue|orange|pink)-(400|500)/,
            variants: ['dark'],
        },
        {
            pattern: /to-(violet|red|green|blue|orange|pink)-(500|800)/,
            variants: ['dark'],
        },
        {
            pattern: /shadow-(violet|red|green|blue|orange|pink)-(800)/,
            variants: ['dark'],
        },
        {
            pattern: /ring-(violet|red|green|blue|orange|pink)-(500)/,
            variants: ['focus'],
        }
    ],
}
