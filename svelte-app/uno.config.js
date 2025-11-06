import { defineConfig, presetMini, presetTypography } from 'unocss';

export default defineConfig({
	presets: [
		presetMini(), // Minimal, fast preset
		presetTypography() // Nice typography
	],
	theme: {
		colors: {
			primary: '#f59e0b', // Amber
			secondary: '#10b981' // Green
		}
	}
});
