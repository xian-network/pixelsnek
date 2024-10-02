<script>
    import { onMount } from 'svelte';
    import Recent from '../../components/Recent.svelte';

    let recent = [];
    let error = null;
    let loading = true;

    onMount(async () => {
        try {
            const res = await fetch(`./recent_things.json?limit=25`);
            recent = await res.json();
            if (!recent) recent = [];
        } catch (err) {
            console.error("Error fetching recent things:", err);
            error = err.message;
        } finally {
            loading = false;
        }
    });
</script>

<svelte:head>
    <title>Pixel Whale Recent NFT Creations!</title>
</svelte:head>

{#if loading}
    <p>Loading...</p>
{:else if error}
    <p>Error: {error}</p>
{:else}
    <Recent {recent}/>
{/if}