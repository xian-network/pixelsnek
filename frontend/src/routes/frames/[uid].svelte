<script context="module">
	import { decodeFrames } from "../../js/utils.js";
	import { getThingByUid } from "../../js/graphqlQueries";
	import { fetchThings } from "../../js/processGraphql.js";

	export async function preload({ params, query }) {
		let data = await Promise.all([
			fetchThings(getThingByUid(params.uid)),
			// this.fetch(`./history/${params.uid}.json`).then(res => res.json())
		]);
		// console.log({ data: JSON.stringify(data) });
		let thingInfo = data[0][0];
		// console.log({ thingInfo });
		try {
			thingInfo.frames = decodeFrames(thingInfo.thing);
			// console.log({ thingInfo });
		} catch (e) {
			thingInfo = {
				name: "Not Found",
				owner: "",
				uid: params.uid,
				description: "",
				notFound: true,
			};
		}

		return {
			thingInfo,
			// auctionInfo,
			// salesHistory: data[1]
		};
	}
</script>

<script>
	// Components
	import DisplayFramesOne from "../../components/DisplayFramesOne.svelte";

	// MISC
	import { updateInfo } from "../../js/utils.js";
	import { config } from "../../js/config.js";

	export let thingInfo;
	export let auctionInfo;
	export let salesHistory;

	// console.log({ thingInfo, auctionInfo });

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

<div class="page-container">
	{#if typeof thingInfo.notFound === "undefined"}
		<div class="frame-details-container">
			<DisplayFramesOne
				{thingInfo}
				{auctionInfo}
				{salesHistory}
				updateInfo={updateThingInfo}
			/>
		</div>
	{:else}
		<div class="not-found-container">
			<div class="not-found-content">
				<h2>NFT Not Found</h2>
				<p>{`${thingInfo.uid} doesn't exist.`}</p>
			</div>
		</div>
	{/if}
</div>

<style>
	.page-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: var(--space-lg, 16px);
	}

	.frame-details-container {
		margin: var(--space-xl, 24px) 0;
	}

	.not-found-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 400px;
	}

	.not-found-content {
		background-color: var(--color-background-secondary, #f5f5f5);
		border-radius: var(--border-radius, 8px);
		padding: var(--space-xl, 24px);
		text-align: center;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
		max-width: 500px;
		width: 100%;
		border: 1px solid var(--color-border-secondary, #e0e0e0);
	}

	.not-found-content h2 {
		color: var(--color-text-primary);
		font-size: var(--font-size-2xl, 1.5rem);
		margin-bottom: var(--space-md, 12px);
	}

	.not-found-content p {
		color: var(--color-text-secondary);
		font-size: var(--font-size-base, 1rem);
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.page-container {
			padding: var(--space-md, 12px);
		}

		.frame-details-container {
			margin: var(--space-md, 12px) 0;
		}

		.not-found-content {
			padding: var(--space-lg, 16px);
		}
	}
</style>
