import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter()
	},
	vite: {
		ssr: {
			noExternal: ["dayjs"],
		},
	}
};

export default config;