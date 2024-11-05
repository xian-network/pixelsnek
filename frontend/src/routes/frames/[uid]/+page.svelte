<script>
	// Components
	import DisplayFramesOne from "../../../components/DisplayFramesOne.svelte";

	// MISC
	import { updateInfo } from "../../../js/utils.js";
	import { config } from "../../../js/config.js";

	// export let thingInfo;
	// export let auctionInfo;
	// export let salesHistory;

	export let data;
	let { thingInfo, auctionInfo, salesHistory } = data;

	console.log({ thingInfo, auctionInfo });

	let gifURL = `${config.domainName}/gif/${thingInfo.uid}.gif`;

	const updateThingInfo = (updates) => {
		thingInfo = updateInfo(thingInfo, updates);
	};
</script>

<svelte:head>
	<title>{thingInfo.name}</title>

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={thingInfo.name} />
	<meta name="twitter:description" content={thingInfo.description} />
	<meta name="twitter:site" content="@framespixel" />
	<meta name="twitter:creator" content={thingInfo.owner} />
	<meta name="twitter:image" content={gifURL} />
	<meta name="twitter:image:alt" content={thingInfo.name} />

	<meta property="og:url" content={gifURL} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content="Pixel Snek" />
	<meta property="og:image" content={gifURL} />
	<meta property="og:description" content={thingInfo.description} />
	<meta property="og:image:url" content={gifURL} />
	<meta property="og:image:secure_url" content={gifURL} />
	<meta property="og:image:width" content="150" />
	<meta property="og:image:height" content="150" />
	<meta property="og:image:type" content="image/gif" />
</svelte:head>

{#if typeof thingInfo.notFound === "undefined"}
	<div class="display-one">
		<DisplayFramesOne
			{thingInfo}
			{auctionInfo}
			{salesHistory}
			updateInfo={updateThingInfo}
		/>
	</div>
{:else}
	<p>{`${thingInfo.uid} doesn't exist.`}</p>
{/if}

<style>
	.display-one {
		max-width: 75em;
		margin: 0 auto;
	}
</style>
