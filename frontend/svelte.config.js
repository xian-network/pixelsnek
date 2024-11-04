import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// kit config options go here
	},
	vite: {
		ssr: {
			noExternal: ["dayjs"],
		},
	}
};

export default config;