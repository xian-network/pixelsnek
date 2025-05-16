<script>
	import { userAccount, currency, walletInfo, walletInstalled, theme, toggleTheme } from '../js/stores'
	import { beforeUpdate, onMount } from 'svelte'

	import { formatAccountAddress, stringToFixed } from '../js/utils.js'
	import {  checkForApproval, refreshTAUBalance} from '../js/store-utils.js'
	import { config } from '../js/config'

	import Title from './Title.svelte'
	import WalletConnectButton from './WalletConnectButton.svelte'
	import Button from './Button.svelte'
	import Input from './Input.svelte'
	import MoonIcon from '../icons/MoonIcon.svelte'
	import SunIcon from '../icons/SunIcon.svelte'
	import SearchIcon from '../icons/SearchIcon.svelte'

	export let segment;
	export let xdu;

	let initalize = false;
	let balance;
	let timer;
	let globalSearchTerm = '';
	setTimeout(() => initalize = true, 300)

	$: xduInitialized = false;

	onMount(() => {
		timer = setTimeout(() => {
		if ($userAccount && !balance) {
			balance = refreshTAUBalance()
			checkForApproval(config.masterContract)
			timer = null;
		}
		}, 1000)
	})


	beforeUpdate(() => {
		if (!xdu) {
			balance = undefined
			xduInitialized = false;
		}
		if (xdu && !xduInitialized) xduInitialized = true;
	})

</script>

<style>
	.site-header {
		display: flex;
		flex-direction: column;
		width: 100%;
		/* background-color: var(--color-background-nav, var(--color-background-primary)); */
	}

	.top-bar {
		display: flex;
		align-items: center;
		padding: var(--space-sm) var(--space-lg);
		border-bottom: 1px solid var(--color-border-soft, #e0e0e0);
		gap: var(--space-md);
	}

	.catalog-link {
		font-weight: var(--font-weight-medium);
		color: var(--color-text-secondary);
		text-decoration: none;
		white-space: nowrap;
	}
	.catalog-link:hover {
		color: var(--color-text-primary);
	}

	.nav-search-input {
		flex-grow: 1;
		min-width: 150px;
		max-width: 500px;
	}

	.top-bar-actions {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.main-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-sm) var(--space-lg);
	}

	.brand {
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 300;
		font-size: 2em;
		min-width: max-content;
		cursor: pointer;
		text-decoration: none;
	}
	.brand > img {
		width: 37px;
		min-width: 37px;
		margin-right: 8px;
	}

	.links {
		padding: 0;
		min-width: max-content;
		color: var(--color-text-secondary);
	}
	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	ul::after {
		content: '';
		display: block;
		clear: both;
	}
	li {
		display: block;
		float: left;
	}
	[aria-current='page'] {
		position: relative;
		color: var(--color-text-link-active, var(--color-primary-accent));
	}
	[aria-current='page']::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: var(--color-primary-accent);
		display: block;
		bottom: -1px;
	}
	li > a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
		color: inherit;
	}
	li > a:hover{
		color: var(--color-text-link-hover, var(--color-primary-accent-hover));
	}

	.currency-display {
		color: var(--color-text-secondary);
		font-size: 0.9em;
		background: var(--color-background-muted, #dedede8c);
		padding: var(--space-xxs) var(--space-xs);
		border-radius: var(--border-radius-sm);
		white-space: nowrap;
	}
	.currency-display > strong {
		margin-left: var(--space-xxs);
		color: var(--color-text-primary);
	}

	.desktop {
		display: none;
	}
	@media (min-width: 450px) {
		.desktop {
			display: flex;
		}
	}
	@media (min-width: 900px) {
		.links {
			display: block;
			font-size: 1.3em;
		}
		li > a {
			padding: 1em 0.25em 0.5em;
			margin-bottom: 0.5em;
		}
		[aria-current='page']::after {
			width: calc(100% - 0.5em);
			height: 3px;
		}
		.currency-display {
			font-size: 1em;
		}
	}
</style>

<header class="site-header">
	<div class="top-bar">
		<a href="/catalog" class="catalog-link desktop">Catalog</a>
		<Input 
			class="nav-search-input"
			placeholder="Search items, collections, and accounts" 
			iconLeft={SearchIcon} 
			bind:value={globalSearchTerm} 
		/>
		<div class="top-bar-actions desktop">
			<Button class="theme-switcher-btn" variant="primary-icon" on:click={toggleTheme} aria-label="Toggle theme">
				{#if $theme.mode === 'dark'}
					<SunIcon />
				{:else}
					<MoonIcon />
				{/if}
			</Button>

			{#if $userAccount !== "" && initalize && !$walletInfo.locked}
				<p class="currency-display">
					{stringToFixed($currency, 8)}<strong>{config.currencySymbol}</strong>
				</p>
				<Button 
					variant="secondary-medium"
					href={`${config.blockExplorer}/addresses/${$userAccount}`}
					target="_blank"
					aria-label="View address on block explorer: {formatAccountAddress($userAccount, 8, 4)}"
					style="min-width: 160px; max-width: 180px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; display: inline-block;" 
				>
					{formatAccountAddress($userAccount, 8, 4)}
				</Button>
			{:else if initalize}
				<WalletConnectButton {xdu} />
			{:else if $walletInstalled === 'not_installed'}
				<Button variant="primary-medium" href="https://chromewebstore.google.com/search/Xian" target="_blank" rel="noopener noreferrer">
					Install Wallet
				</Button>
			{/if}
		</div>
	</div>

	<nav class="main-nav">
		<a class="brand flex-row" rel=prefetch href=".">
			<img src="img/PIXELSNEK-124.png" alt="nav logo">
			<Title fontSize={1.2} subtitle={false}/>
		</a>
		<div class="links desktop">
			<ul>
				<li><a rel=prefetch aria-current={segment === 'create' ? 'page' : undefined} href="create">create</a></li>
				{#if $userAccount !== "" || $userAccount == undefined}
					<li><a rel=prefetch aria-current={segment === 'owned' ? 'page' : undefined} href={'owned/' + $userAccount}>owned</a></li>
				{/if}
				<li><a rel=prefetch aria-current={segment === 'recent' ? 'page' : undefined} href="recent">recent</a></li>
				<li><a rel=prefetch aria-current={segment === 'forsale' ? 'page' : undefined} href="forsale">for sale</a></li>
				<li><a rel=prefetch href="/components-showcase">Showcase</a></li>
			</ul>
		</div>
	</nav>
</header>
