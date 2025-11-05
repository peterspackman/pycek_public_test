import { defineConfig, presetUno, presetTypography } from 'unocss';

export default defineConfig({
	presets: [
		presetUno(), // Tailwind-compatible utilities
		presetTypography() // Better typography defaults
	],
	theme: {
		colors: {
			primary: {
				50: '#fef3e7',
				100: '#fce4c3',
				200: '#fad29b',
				300: '#f8c073',
				400: '#f6b254',
				500: '#f59e0b', // Main amber
				600: '#f38e0a',
				700: '#f17a08',
				800: '#ef6706',
				900: '#ec4503'
			},
			secondary: {
				50: '#e6f7f1',
				100: '#c1ebdc',
				200: '#98ddc5',
				300: '#6ecfad',
				400: '#4fc59c',
				500: '#10b981', // Main green
				600: '#0ea873',
				700: '#0c9563',
				800: '#0a8253',
				900: '#056135'
			}
		}
	},
	shortcuts: {
		// Button shortcuts
		'btn': 'px-5 py-2.5 rounded-lg font-medium transition-all duration-200 cursor-pointer inline-block text-center',
		'btn-primary': 'btn bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-lg',
		'btn-secondary': 'btn bg-secondary-500 hover:bg-secondary-600 text-white shadow-md hover:shadow-lg',
		'btn-outline': 'btn border-2 border-gray-300 hover:border-primary-500 text-gray-700 hover:text-primary-600',

		// Card shortcuts
		'card': 'bg-white rounded-xl shadow-sm border border-gray-200 p-6',
		'card-hover': 'card hover:shadow-md transition-shadow duration-200',

		// Form shortcuts
		'form-input': 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all',
		'form-label': 'block text-sm font-medium text-gray-700 mb-1.5',
		'form-select': 'form-input appearance-none bg-white cursor-pointer',

		// Container
		'container-page': 'max-w-7xl mx-auto px-4 py-8',

		// Gradients
		'gradient-orange': 'bg-gradient-to-br from-primary-500 to-orange-600',
		'gradient-amber': 'bg-gradient-to-br from-amber-500 to-orange-600',

		// Alert/Message boxes
		'alert': 'px-4 py-3 rounded-lg border',
		'alert-error': 'alert bg-red-50 border-red-200 text-red-800',
		'alert-success': 'alert bg-green-50 border-green-200 text-green-800',
		'alert-info': 'alert bg-blue-50 border-blue-200 text-blue-800'
	}
});
