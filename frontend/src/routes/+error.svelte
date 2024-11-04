<!-- <script>
	export let status;
	export let error;

	const dev = process.env.NODE_ENV === 'development';
</script>

<style>
	h1, p {
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	p {
		margin: 1em auto;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>

<svelte:head>
	<title>{status}</title>
</svelte:head>

<h1>{status}</h1>

<p>{error.message}</p>

{#if dev && error.stack}
	<pre>{error.stack}</pre>
{/if} -->

<script>
	import { page } from '$app/stores';
  </script>
  
  <div class="error-container">
	<h1>{$page.status || 'Error'}</h1>
	<p>{$page.error?.message || 'An unexpected error occurred'}</p>
  </div>
  
  <style>
	.error-container {
	  padding: 2rem;
	  text-align: center;
	}
  </style>
