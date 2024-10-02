<script>
    import { onMount } from 'svelte';
    import ForSale from '../../components/ForSale.svelte';

    let forsale = [];
    let error = null;
    let loading = true;

    onMount(async () => {
        try {
            const res = await fetch(`./forsale.json?limit=25`);
            forsale = await res.json();
            if (!forsale) forsale = [];
        } catch (err) {
            console.error("Error fetching for sale items:", err);
            error = err.message;
        } finally {
            loading = false;
        }
    });
</script>

<svelte:head>
	<title>Pixel Whale NFTs For Sale!</title>
</svelte:head>

{#if loading}
	<p>Loading...</p>
{:else if error}
	<p>Error: {error}</p>
{:else}
	<ForSale {forsale}/>
{/if}