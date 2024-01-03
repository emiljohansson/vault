
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
	daisyui: {
		// themes: ['dracula'],
		themes: [
			{
				mytheme: {
					primary: '#10b981',
					secondary: '#fd6f9c',
					accent: '#b387fa',
					neutral: '#1b262c',
					'base-100': '#282a36',
					info: '#89e0eb',
					success: '#addfad',
					warning: '#f1c891',
					error: '#ffbbbd',
				},
			},
		],
	},
}
