<script>
    import { onMount } from "svelte";
    import ForSale from "../../components/ForSale.svelte";
    import { getThingsForSaleUidsQuery } from "../../js/graphqlQueries.js";
    import { fetchThings } from "../../js/processGraphql.js";

    let forsale = [];
    let error = null;
    let loading = true;

    onMount(async () => {
        try {
            forsale = await fetchThings(getThingsForSaleUidsQuery());

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
    <ForSale {forsale} />
{/if}
