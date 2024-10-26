<script>
    import { onMount } from "svelte";
    import Recent from "../../components/Recent.svelte";
    import { fetchThings } from "../../js/processGraphql.js";
    import { getRecentUidsQuery } from "../../js/graphqlQueries.js";

    let recent = [];
    let error = null;
    let loading = true;

    onMount(async () => {
        try {
            recent = await fetchThings(getRecentUidsQuery(0, 7));
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
    <Recent {recent} />
{/if}
