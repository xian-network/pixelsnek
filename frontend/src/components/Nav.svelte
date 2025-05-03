<script>
	import { userAccount, currency, walletInfo, walletInstalled } from '../js/stores'
	import { beforeUpdate, onMount } from 'svelte'

	import { formatAccountAddress, stringToFixed } from '../js/utils.js'
	import {  checkForApproval, refreshTAUBalance} from '../js/store-utils.js'
	import { config } from '../js/config'

	import Title from './Title.svelte'
	import WalletConnectButton from './WalletConnectButton.svelte'

	export let segment;
	export let xdu;

	let initalize = false;
	let balance;
	let timer;
	let mobileMenuOpen = false; // State for mobile menu

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

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

</script>

<style>
	nav {
		position: sticky;
    	top: 0;
		left: 0;
		min-height: fit-content;
		box-sizing: border-box;
    	width: 100%;
		padding: 1rem 2rem; /* More generous padding */
		justify-content: space-between; /* Space out items */
		background: rgba(10, 14, 23, 0.8); /* Semi-transparent dark background */
		backdrop-filter: blur(10px); /* Modern glass effect */
		-webkit-backdrop-filter: blur(10px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
		z-index: 100;
		transition: all 0.3s ease;
	}
	nav.flex-row{
		justify-content: center;
	}
	.desktop{
		display: none;
	}
	.brand{
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 1.5em;
		min-width: max-content;
		cursor: pointer;
		background: var(--gradient-primary);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		position: relative;
		transition: transform 0.3s ease;
	}
	.brand:hover {
		transform: scale(1.05);
	}
	.brand > img {
		width: 38px;
		min-width: 38px;
		margin-right: 10px;
		filter: drop-shadow(0 0 8px rgba(123, 93, 250, 0.6));
		transition: transform 0.3s ease, filter 0.3s ease;
	}
	.brand:hover > img {
		transform: rotate(10deg);
		filter: drop-shadow(0 0 12px rgba(123, 93, 250, 0.8));
	}

	.account-section {
		display: flex;
		align-items: center;
		gap: 16px;
		background: rgba(31, 41, 55, 0.4);
		padding: 8px 16px;
		border-radius: 12px;
		border: 1px solid rgba(123, 93, 250, 0.2);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		transition: all 0.3s ease;
	}
	
	.account-section:hover {
		border-color: rgba(123, 93, 250, 0.5);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
	}

	.account{
		color: var(--pure-white);
		height: 100%;
		align-items: flex-end;
		justify-content: space-evenly;
		font-weight: 400;
		font-size: 0.9em;
		line-height: 1.2;
		text-align: left;
		margin-left: 10px;
		min-width: auto; /* Allow shrinking */
		flex-grow: 0; /* Don't grow */
	}
	.currency > strong {
		margin-left: 4px;
		font-size: 0.9em;
		padding: 0.3rem 0.6rem;
		margin-top: 3px;
	}

	.address{
		width: auto; /* Adjust width */
		max-width: 100px; /* Limit width */
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		align-self: flex-end;
		margin: 0;
		color: var(--primary);
	}
	.address:hover{
		color: var(--primary)
	}
	.currency{
		color: var(--primary-dark);
		font-size: 1em;
		margin: 0;
		background: #dedede8c;
		padding: 0.5rem 1rem;
		border-radius: 10px;
	}

	.links{
		display: none; /* Hide desktop links by default */
		order: 3; /* Ensure it comes after brand and account */
	}
	.mobile-menu-button {
		display: block; /* Show hamburger by default */
		background: none;
		border: none;
		cursor: pointer;
		padding: 8px;
		margin-left: 10px; /* Space from brand */
		order: 1; /* Position after brand */
		z-index: 120; /* Asegurar que esté por encima de otros elementos */
	}
	.mobile-menu-button svg {
		width: 30px;
		height: 30px;
		fill: var(--pure-white); /* Cambiar a blanco para que se vea en el fondo oscuro */
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5)); /* Añadir sombra para mejor visibilidad */
	}

	.mobile-nav-links {
		display: none; /* Hidden by default */
		position: absolute;
		top: 100%; /* Position below nav bar */
		left: 0;
		width: 100%;
		background-color: rgba(15, 20, 30, 0.95); /* Fondo oscuro semitransparente */
		border-bottom: 1px solid rgba(123, 93, 250, 0.3);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
		z-index: 110; /* Ensure dropdown is above the nav bar content */
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}
	.mobile-nav-links.open {
		display: block; /* Show when open */
		animation: fadeInDown 0.3s ease forwards;
	}
	@keyframes fadeInDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.mobile-nav-links ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.mobile-nav-links li {
		float: none; /* Stack vertically */
		display: block;
		text-align: center;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}
	.mobile-nav-links li:last-child {
		border-bottom: none;
	}
	.mobile-nav-links a {
		padding: 1em;
		display: block;
		text-decoration: none;
		color: var(--pure-white); /* Texto blanco para mejor visibilidad */
		font-size: 1.2em;
		font-weight: 500;
		letter-spacing: 0.5px;
		transition: all 0.2s ease;
	}
	.mobile-nav-links a:hover {
		background-color: rgba(123, 93, 250, 0.2); /* Fondo sutilmente coloreado al hover */
		color: var(--primary-highlight);
	}
	.mobile-nav-links [aria-current]::after {
		display: none; /* No underline needed in mobile menu */
	}
	.mobile-nav-links [aria-current] a {
		font-weight: 700;
		color: var(--primary-highlight); /* Color más destacado para la página actual */
		background: linear-gradient(90deg, rgba(123, 93, 250, 0.1), rgba(123, 93, 250, 0));
		border-left: 3px solid var(--primary); /* Indicador lateral para la página actual */
	}

	/* Desktop Styles */
	@media (min-width: 768px) { /* Adjust breakpoint as needed */
		nav {
			padding: 1rem 3em; /* Restore desktop padding */
			justify-content: flex-start; /* Align items to start */
		}
		.mobile-menu-button {
			display: none; /* Hide hamburger on desktop */
		}
		.links {
			display: block; /* Show desktop links */
			order: 2; /* Position after brand */
			margin-left: 2em;
		}
		.account-section {
			margin-left: auto; /* Push account section to the right */
			order: 3;
		}
		.account {
			font-size: 0.9em;
			text-align: right;
		}
		.brand {
			font-size: 2em;
		}
		.brand > img {
			width: 37px;
			min-width: 37px;
		}
		/* Restore desktop link styles if needed */
		ul {
			margin: 0;
			padding: 0;
		}
		li {
			display: block;
			float: left;
		}
		[aria-current] {
			position: relative;
			display: inline-block;
		}
		[aria-current]::after {
			position: absolute;
			content: '';
			width: calc(100% - 1em);
			height: 2px;
			background-color: var(--primary);
			display: block;
			bottom: -1px;
		}
		li > a {
			text-decoration: none;
			padding: 1em 0.5em;
			display: block;
			color: var(--pure-white);
			font-size: 1.1em;
			font-weight: 500;
			position: relative;
			text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
			transition: all 0.3s ease;
		}
		li > a:hover{
			color: var(--primary-highlight);
			transform: translateY(-2px);
		}
		/* li > a::after {
			content: '';
			position: absolute;
			bottom: 0.7em;
			left: 0.5em;
			width: 0;
			height: 2px;
			background: var(--gradient-primary);
			transition: width 0.3s ease;
		}
		li > a:hover::after {
			width: calc(100% - 1em);
		} */
	}

</style>

<nav class="flex-row">
	<a class="brand flex-row" rel=prefetch href="." on:click={closeMobileMenu}>
		<img src="img/PIXELSNEK-124.png" alt="nav logo">
		<!-- Use smaller Title component or adjust styles directly -->
		<Title fontSize={1} subtitle={false}/>
	</a>

	<!-- Mobile Menu Button -->
	<button class="mobile-menu-button" on:click={toggleMobileMenu} aria-label="Toggle menu">
		<svg viewBox="0 0 24 24">
			<path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
		</svg>
	</button>

	<!-- Desktop Links -->
	<div class="links">
		<ul>
			<li aria-current={segment === 'create' ? 'page' : undefined}>
				<a rel=prefetch href='create' on:click={closeMobileMenu}>Create</a>
			</li>
			<li aria-current={segment === 'recent' ? 'page' : undefined}>
				<a rel=prefetch href='recent' on:click={closeMobileMenu}>Recent</a>
			</li>
			<li aria-current={segment === 'forsale' ? 'page' : undefined}>
				<a rel=prefetch href='forsale' on:click={closeMobileMenu}>For Sale</a>
			</li>
		</ul>
	</div>

	<!-- Account Section (Wallet Button + Info) -->
	<div class="account-section">
		{#if $userAccount !== "" && initalize && !$walletInfo.locked}
			<div class="account flex-col">
				<a href={`${config.blockExplorer}/addresses/${$userAccount}`}
				target="_blank"
				rel="noopener noreferrer"
				class="address">
					{`${formatAccountAddress($userAccount, 8, 4)}`}
				</a>
				<p class="currency">
					{stringToFixed($currency, 8)}<strong>{config.currencySymbol}</strong>
				</p>	
			</div>
		{:else if xduInitialized && initalize}
				<WalletConnectButton {xdu} />
		{:else if $walletInstalled === 'not_installed'}
			INSTALL WALLET PLS
		{/if}
	</div>

	<!-- Mobile Navigation Links (Dropdown) -->
	<div class="mobile-nav-links" class:open={mobileMenuOpen}>
		<ul>
			<li aria-current={segment === 'create' ? 'page' : undefined}>
				<a rel=prefetch href='create' on:click={closeMobileMenu}>Create</a>
			</li>
			<li aria-current={segment === 'recent' ? 'page' : undefined}>
				<a rel=prefetch href='recent' on:click={closeMobileMenu}>Recent</a>
			</li>
			<li aria-current={segment === 'forsale' ? 'page' : undefined}>
				<a rel=prefetch href='forsale' on:click={closeMobileMenu}>For Sale</a>
			</li>
		</ul>
	</div>
</nav>
