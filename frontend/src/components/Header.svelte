<script>
  import { slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { getContext, onMount } from 'svelte';
  import { theme, toggleTheme } from '../js/stores/theme.js';
  import { userAccount, walletInstalled } from '../js/stores.js';
  import { config } from '../js/config.js'; // Import config
  import Button from './Button.svelte';
  // import Icon from './Icon.svelte'; // No longer needed for header icons
  import Input from './Input.svelte';
  import SearchIcon from '../icons/SearchIcon.svelte';
  import MoonIcon from '../icons/MoonIcon.svelte';
  import MenuIcon from '../icons/MenuIcon.svelte';
  import CloseIcon from '../icons/CloseIcon.svelte';
  import SunIcon from '../icons/SunIcon.svelte';
  // import MobileMenu from './MobileMenu.svelte'; // We might create this later
  // Import the search query and processor
  import { getSearchResultsQuery, processSearchResults } from '../js/graphqlQueries.js';

  // Import user account store if needed for connect button state (assuming similar to old Nav)
  // import { userAccount } from '../js/stores'; 

  export let segment = ''; // From layout, to highlight active link

  // Get context during component initialization
  const appFunctions = getContext('app_functions');
  let xdu = null; // To store the xian wallet utility instance
  let mobileMenuOpen = false;
  let searchInputValue = '';
  let searchResults = [];
  let showSearchResults = false;
  let isSearching = false;
  let searchTimeout;
  // Use the endpoint from config
  let graphqlEndpoint = config.graphqlEndpoint;

  // Using the provided pixelsnek logo image
  const logoSrc = '/pixelsneklogo-sm.png';

  onMount(() => {
    try {
      console.log("Header component mounted, appFunctions:", appFunctions);
      console.log("Using GraphQL endpoint from config:", graphqlEndpoint);
      
      if (appFunctions && typeof appFunctions.xdu === 'function') {
        xdu = appFunctions.xdu();
      }
      
      // Setup click outside handler for search results
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    } catch (error) {
      console.error('Error initializing header components:', error);
    }
  });

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  async function connectWallet() {
    if ($walletInstalled === 'not_installed') {
      // TODO: Guide user to install wallet / show a modal
      alert('Xian Wallet is not installed. Please install it to connect.');
      return;
    }
    if (xdu && typeof xdu.requestWalletInfo === 'function') {
      try {
        await xdu.requestWalletInfo(); // This should trigger the wallet to connect and update stores
      } catch (error) {
        console.error("Error requesting wallet info:", error);
        // Handle error (e.g., show a snackbar)
      }
    } else {
      console.error("Xian Wallet Utility (xdu) not available from context or requestWalletInfo is not a function");
      // Potentially fallback or show an error to the user
    }
  }

  // Helper to format account address (optional)
  function formatAccountAddress(address) {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }
  
  // Handle search input changes with debounce
  function handleSearchInput() {
    console.log("handleSearchInput called with value:", searchInputValue);
    
    // Ensure we can access the input field for debugging
    const searchInputEl = document.querySelector('.header-search-input input');
    console.log("Search input element value:", searchInputEl?.value);
    
    // Clear previous timeout if it exists
    if (searchTimeout) {
      clearTimeout(searchTimeout);
      console.log("Cleared previous search timeout");
    }
    
    // Always show the dropdown when there's any input
    if (searchInputValue && searchInputValue.length > 0) {
      // Show the dropdown even for short searches, but with a message
      showSearchResults = true;
      
      // Only set isSearching if we're past the minimum length
      isSearching = searchInputValue.length >= 2;
      console.log(`Search input length: ${searchInputValue.length}, showing results: ${showSearchResults}, isSearching: ${isSearching}`);
    } else {
      console.log("Empty search input, hiding results");
      showSearchResults = false;
      searchResults = [];
      isSearching = false;
      return;
    }
    
    // Only continue with the search if we have at least 2 characters
    if (!searchInputValue || searchInputValue.length < 2) {
      return;
    }
    
    // Set a new timeout
    console.log("Setting new search timeout for:", searchInputValue);
    searchTimeout = setTimeout(async () => {
      if (searchInputValue.length < 2) {
        showSearchResults = false;
        searchResults = [];
        isSearching = false;
        return;
      }
      
      try {
        console.log("Search timeout triggered for:", searchInputValue);
        
        // Use the correct endpoint from config
        console.log("Using GraphQL endpoint:", graphqlEndpoint);
        
        const query = getSearchResultsQuery(searchInputValue);
        console.log("GraphQL query:", query);
        
        const requestBody = JSON.stringify({ query });
        console.log("Request body:", requestBody);
        
        console.log("Sending fetch request to:", graphqlEndpoint);
        const response = await fetch(graphqlEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: requestBody,
        });
        
        console.log("Fetch response status:", response.status);
        const data = await response.json();
        console.log("Search results data:", data);
        
        if (data && data.data) {
          searchResults = processSearchResults(data.data);
          showSearchResults = searchResults.length > 0;
          console.log("Processed search results:", searchResults);
          console.log("showSearchResults set to:", showSearchResults);
        } else {
          console.log("No data in response, clearing results");
          searchResults = [];
          showSearchResults = false;
        }
      } catch (error) {
        console.error('Search error (detailed):', error);
        searchResults = [];
      } finally {
        console.log("Search complete, isSearching set to false");
        isSearching = false;
      }
    }, 300); // 300ms debounce time
  }
  
  // Close search results when clicking outside
  function handleClickOutside(event) {
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer && !searchContainer.contains(event.target)) {
      showSearchResults = false;
    }
  }
  
  // Navigate to result page
  function navigateToResult(result) {
    let path = '';
    if (result.type === 'artwork' || result.type === 'uid') {
      path = `/frames/${result.uid}`;
    } else if (result.type === 'wallet') {
      path = `/profile/${result.address}`;
    }
    
    if (path) {
      window.location.href = path;
    }
    
    // Close search results
    showSearchResults = false;
    searchInputValue = '';
  }
  
  // Handle Enter key press in search input
  function handleSearchKeydown(event) {
    if (event.key === 'Enter' && searchInputValue.trim().length >= 2) {
      // Navigate to search page with current query
      window.location.href = `/search?q=${encodeURIComponent(searchInputValue)}`;
    }
  }
</script>

<header class="main-header">
  <!-- Top Bar - Keep search bar here but move other elements to mobile menu -->
  <div class="top-bar">
    <div class="top-bar-content-wrapper">
      <!-- Only show catalog link on desktop -->      
      <div class="search-container">
        <Input 
          type="search" 
          placeholder="Search items, collections, and accounts (min. 2 characters)" 
          bind:value={searchInputValue}
          on:input={(event) => {
            console.log("Search input event triggered with value:", event.detail);
            searchInputValue = event.detail;
            handleSearchInput();
          }}
          on:keydown={(event) => {
            if (event.key === 'Enter' && searchInputValue.trim().length >= 2) {
              console.log("Enter key pressed in search, navigating to search page");
              window.location.href = `/search?q=${encodeURIComponent(searchInputValue)}`;
            }
          }}
          aria-label="Search Catalog"
          class="catalog-search header-search-input"
        >
          <svelte:fragment slot="icon-left">
            <SearchIcon color="var(--color-search-icon, #555)" size="1.1em" />
          </svelte:fragment>
          
          <svelte:fragment slot="icon-right">
            <a 
              href={`/search?q=${encodeURIComponent(searchInputValue)}`} 
              class="search-go-button"
              title="Go to search page"
              aria-label="Go to search page"
            >
              <SearchIcon color="var(--color-search-icon, #555)" size="1.1em" />
            </a>
          </svelte:fragment>
        </Input>
        
        {#if showSearchResults}
          <div class="search-results-overlay" transition:slide={{ duration: 150 }}>
            <div class="search-results-container">
              {#if searchInputValue.length < 2}
                <div class="search-too-short">
                  Please enter at least 2 characters to search
                </div>
              {:else if isSearching}
                <div class="search-loading">
                  <div class="loading-spinner"></div>
                  <span>Searching...</span>
                </div>
              {:else if searchResults.length > 0}
                <ul class="search-results-list">
                  {#each searchResults as result}
                    <li>
                      <button 
                        class="search-result-item" 
                        on:click={() => navigateToResult(result)}
                      >
                        {#if result.type === 'artwork'}
                          <div class="search-result-icon">🖼️</div>
                          <div class="search-result-content">
                            <span class="search-result-title">
                              {result.value.length > 30 ? result.value.substring(0, 30) + '...' : result.value}
                            </span>
                            <span class="search-result-subtitle">Artwork: {result.matchField}</span>
                          </div>
                        {:else if result.type === 'wallet'}
                          <div class="search-result-icon">👤</div>
                          <div class="search-result-content">
                            <span class="search-result-title">
                              {formatAccountAddress(result.address)}
                            </span>
                            <span class="search-result-subtitle">Account</span>
                          </div>
                        {:else if result.type === 'uid'}
                          <div class="search-result-icon">🔍</div>
                          <div class="search-result-content">
                            <span class="search-result-title">
                              {result.uid.substring(0, 12)}...
                            </span>
                            <span class="search-result-subtitle">Artwork ID</span>
                          </div>
                        {/if}
                      </button>
                    </li>
                  {/each}
                  {#if searchResults.length >= 10}
                    <li class="search-result-more">
                      <a href={`/search?q=${encodeURIComponent(searchInputValue)}`} class="search-results-more-link">
                        View all results
                      </a>
                    </li>
                  {/if}
                </ul>
              {:else}
                <div class="search-no-results">
                  No results found for "{searchInputValue}"
                </div>
              {/if}
            </div>
          </div>
        {/if}
      </div>

      <!-- Move top-bar-actions to mobile menu for mobile, show only on desktop -->
      <div class="top-bar-actions desktop-only">
        <Button 
          variant="faded-small"
          class="theme-toggle"
          on:click={toggleTheme} 
          aria-label="Toggle theme"
        >
          {#if $theme === 'light'}
            <SunIcon size="1.25em" /> 
          {:else}
            <MoonIcon size="1.25em" /> 
          {/if}
        </Button>

        {#if $userAccount}
          <Button 
            variant="secondary-medium" 
            class="connect-button"
            href={`/profile/${$userAccount}`}
          >
            Connected ({formatAccountAddress($userAccount)})
          </Button>
        {:else}
          <Button 
            variant="secondary-medium" 
            class="connect-button"
            on:click={connectWallet}
            disabled={$walletInstalled === 'not_installed'} 
          >
            {$walletInstalled === 'not_installed' ? 'Install Wallet' : 'Connect Wallet'}
          </Button>
        {/if}
      </div>
    </div>
  </div>

  <!-- Main Navigation Bar (Bottom Bar) -->
  <nav class="main-nav-bar">
    <div class="main-nav-bar-content-wrapper">
      <a href="/" class="logo-link" aria-label="Homepage">
        <img src={logoSrc} alt="PixelSnEK Logo" class="site-logo-img" />
        <span class="logo-text font-heading">P I X E L S n E K</span>
      </a>

      <nav class="desktop-nav" aria-label="Main navigation">
        <ul class="nav-list">
          <li><a href="/forsale" class:active={segment === 'forsale'}>FOR SALE</a></li>
          <li><a href="/recent" class:active={segment === 'recent'}>RECENT</a></li>
          <li><a href="/creators" class:active={segment === 'creators'}>CREATORS</a></li>
          <li class="create-button-container">
            <Button 
              variant="primary-medium" 
              href="/create"
              class="create-button"
            >
              CREATE
            </Button>
          </li>
        </ul>
      </nav>

      <!-- Mobile Menu Button -->
      <div class="mobile-menu-button-container">
        <Button 
          variant="faded-small" 
          on:click={toggleMobileMenu} 
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          {#if mobileMenuOpen}
            <CloseIcon size="1.25em" />
          {:else}
            <MenuIcon size="1.25em" />
          {/if}
        </Button>
      </div>
    </div>
  </nav>

  <!-- Mobile Menu with updated structure -->
  {#if mobileMenuOpen}
    <div class="mobile-menu" transition:slide={{ duration: 300, easing: quintOut }}>
      <!-- Add catalog link at top of mobile menu -->
      
      <nav class="mobile-nav" aria-label="Mobile navigation">
        <ul class="mobile-nav-list">
          <li><a href="/forsale" on:click={toggleMobileMenu}>FOR SALE</a></li>
          <li><a href="/recent" on:click={toggleMobileMenu}>RECENT</a></li>
          <li><a href="/creators" on:click={toggleMobileMenu}>CREATORS</a></li>
        </ul>
        <div class="mobile-create-button">
          <Button 
            variant="primary-m"
            href="/create" 
            on:click={toggleMobileMenu}
            class="create-button-mobile"
          >
            CREATE
          </Button>
        </div>
      </nav>
      
      <!-- Move theme toggle to mobile menu -->
      <div class="mobile-theme-toggle">
        <Button 
          variant="faded-small"
          on:click={() => { toggleTheme(); }} 
          aria-label="Toggle theme"
        >
          {#if $theme === 'light'}
            <SunIcon size="1.25em" /> 
            <span>Light Mode</span>
          {:else}
            <MoonIcon size="1.25em" /> 
            <span>Dark Mode</span>
          {/if}
        </Button>
      </div>
      
      <!-- Wallet connect in mobile menu -->
      <div class="mobile-menu-actions">
        {#if $userAccount}
          <Button 
            variant="secondary-medium" 
            class="connect-button-mobile"
            href={`/profile/${$userAccount}`}
            on:click={toggleMobileMenu}
          >
            Connected ({formatAccountAddress($userAccount)})
          </Button>
        {:else}
          <Button 
            variant="secondary-medium" 
            class="connect-button-mobile"
            on:click={() => { connectWallet(); toggleMobileMenu(); }}
            disabled={$walletInstalled === 'not_installed'}
          >
            {$walletInstalled === 'not_installed' ? 'Install Wallet' : 'Connect Wallet'}
          </Button>
        {/if}
      </div>
    </div>
  {/if}
</header>

<style>
  :root {
    --color-header-bg: #fafbfc;
    --color-header-border: #090d140f;
    --color-search-bg: #f3f4f6;
    --color-search-icon: #6b7280;
    --color-search-placeholder: #6b7280;
    --color-theme-toggle-bg: #e5e7eb;
    --color-theme-toggle-bg-hover: #d1d5db;
    --color-nav-link-active-border: var(--color-primary-accent);
    --font-weight-nav-link: 600;
    --color-header-shadow: rgba(0, 0, 0, 0.18);
    --color-main-nav-bg: rgba(157, 157, 157, 0.031);
    --color-mobile-menu-bg: #fafbfc;
  }

  [data-theme="dark"] {
    --color-header-bg: #262930;
    --color-header-border: #363a45;
    --color-search-bg: #1e2129;
    --color-search-icon: #9ca3af;
    --color-search-placeholder: #9ca3af;
    --color-theme-toggle-bg: #374151;
    --color-theme-toggle-bg-hover: #4b5563;
    --color-header-shadow: rgba(0, 0, 0, 0.45);
    --color-main-nav-bg: rgba(227, 227, 227, 0.479);
    --color-mobile-menu-bg: #20232a;
  }

  .main-header {
    background-color: var(--color-background-secondary);
    padding: 0;
    position: sticky;
    top: 0;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    box-shadow: 0 6px 30px var(--color-header-shadow);
  }

  .top-bar-content-wrapper,
  .main-nav-bar-content-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    gap: var(--space-md);
  }

  .top-bar {
    padding: var(--space-sm) var(--space-lg);
    border-bottom: 1px solid var(--color-header-border);
    background-color: transparent;
    height: 5rem;
  }
  .top-bar-content-wrapper {
     gap: var(--space-lg);
  }

  .catalog-link {
    text-decoration: none;
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    white-space: nowrap;
    text-transform: uppercase;
    margin-right: var(--space-md);
    letter-spacing: var(--letter-spacing-wide);
  }
  .catalog-link:hover {
    color: var(--color-primary-accent);
  }
  
  .mobile-catalog-link {
    display: block;
    text-decoration: none;
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing-wide);
    padding: var(--space-sm) 0;
    margin-bottom: var(--space-md);
    text-align: center;
    border-bottom: 1px solid var(--color-header-border);
  }

  .search-container {
    position: relative;
    flex-grow: 1;
    min-width: 200px; 
    max-width: 700px;
    width: 70%;
  }

  .top-bar-actions {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    flex-shrink: 0;
  }

  .main-nav-bar {
    padding: var(--space-md) var(--space-lg);
    background-color: transparent;
    border-bottom: 1px solid var(--color-header-border);
  }

  .logo-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-sm);
    text-decoration: none;
    color: var(--color-text-primary);
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-lg);
    flex-shrink: 0;
  }

  .site-logo-img {
    height: 48px;
    width: auto;
  }
  
  .logo-text {
    color: var(--color-primary-accent);
    font-family: var(--font-family-sans);
    letter-spacing: 0.15em;
    font-size: 1.5rem;
    text-transform: uppercase;
  }
  
  /* Hide logo text on small screens */
  @media (max-width: 600px) {
    .logo-text {
      display: none;
    }
  }

  .desktop-nav {
    display: none; 
    flex-grow: 1;
    justify-content: flex-end;
  }
  .desktop-nav .nav-list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: var(--space-md);
    justify-content: flex-end;
    width: 100%;
  }

  .nav-list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: var(--space-md);
  }
  .nav-list a {
    text-decoration: none;
    color: var(--color-nav-link-text);
    font-size: calc(var(--font-size-sm) - 0.05rem);
    font-weight: var(--font-weight-nav-link);
    padding: var(--space-xs) 0;
    border-bottom: 2px solid transparent;
    transition: color 0.2s ease, border-color 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.09em;
  }
  .nav-list a:hover {
    color: var(--color-primary-accent-hover);
  }
  .nav-list a.active {
    color: var(--color-nav-link-active-border);
    border-bottom-color: var(--color-nav-link-active-border);
  }
   .nav-list a:focus-visible {
      outline: 2px solid var(--color-primary-accent);
      outline-offset: 2px;
      border-radius: 0;
   }

  /* Mobile Menu Button Styling */
  .mobile-menu-button-container {
    display: block;
  }
  
  .mobile-menu-button-container :global(button) {
    background-color: transparent;
  }
  
  [data-theme="dark"] .mobile-menu-button-container :global(button) {
    background-color: transparent;
  }

  /* Mobile menu styles */
  .mobile-menu {
    position: absolute;
    top: 100%; 
    left: 0;
    right: 0;
    background-color: var(--color-mobile-menu-bg) !important;
    border-top: 1px solid var(--color-border-secondary);
    box-shadow: var(--shadow-md);
    padding: var(--space-lg);
    z-index: 999;
  }
  .mobile-nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
  }
  .mobile-nav-list a {
     text-decoration: none;
     color: var(--color-text-primary);
     font-size: calc(var(--font-size-lg) - 0.1rem);
     display: block;
     padding: var(--space-sm);
     border-radius: 6px;
     letter-spacing: 0.04em;
  }
  .mobile-nav-list a:hover {
     background-color: var(--color-background-tertiary);
  }
  
  .mobile-menu-actions {
     border-top: 1px solid var(--color-border-secondary);
     padding-top: var(--space-lg);
     display: flex;
     justify-content: center;
  }
  
  .mobile-theme-toggle {
    margin: var(--space-md) 0;
    display: flex;
    justify-content: center;
  }
  
  .mobile-theme-toggle :global(button) {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    background-color: var(--color-theme-toggle-bg);
    padding: var(--space-sm) var(--space-lg);
    border-radius: 6px;
  }
  
  .mobile-theme-toggle span {
    font-size: var(--font-size-sm);
  }
  
  .connect-button-mobile {
      width: 100%;
      max-width: 300px;
  }

  /* Full screen search results */
  .search-results-overlay {
    position: fixed;
    top: 5rem; /* Height of the top bar */
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color-background-primary);
    z-index: 1100;
    overflow-y: auto;
  }
  
  .search-results-container {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--space-lg);
  }

  /* Desktop/mobile visibility control */
  .desktop-only {
    display: none;
  }

  /* --- Responsive Design Adjustments --- */
  @media (min-width: 900px) {
    .desktop-nav {
      display: flex;
    }
    .mobile-menu-button-container {
      display: none;
    }
    .desktop-only {
      display: flex;
    }
  }

  :global(.header-search-input) {
    color: var(--color-text-primary) !important;
    background-color: rgba(117, 117, 117, 0.03) !important;
  }
  
  [data-theme="dark"] :global(.header-search-input) {
    background-color: rgba(51, 51, 68, 0.7) !important;
  }

  :global(.header-search-input::placeholder) {
    color: var(--color-search-placeholder);
    opacity: 1;
  }

  .theme-toggle.btn-faded-small {
    padding: var(--space-xs);
    background-color: var(--color-theme-toggle-bg);
    color: var(--color-text-primary);
    border-radius: 0;
    box-shadow: none;
  }
  .theme-toggle.btn-faded-small:hover {
    background-color: var(--color-theme-toggle-bg-hover);
  }
  .theme-toggle :global(svg) {
      color: var(--color-text-button-icon, var(--color-text-primary)); 
  }
  [data-theme="dark"] .theme-toggle :global(svg) {
      color: var(--color-text-button-icon-dark, var(--color-primary-accent));
  }

  .btn:focus-visible {
    outline: 2px solid var(--color-primary-accent);
    outline-offset: 2px;
    border-radius: 0;
  }

  .create-button-container {
    margin-left: 5px;
  }
  
  .create-button :global(button) {
    min-width: 100px;
  }
  
  .mobile-create-button {
    margin-top: var(--space-md);
    display: flex;
    justify-content: center;
  }
  
  .create-button-mobile {
    width: 100%;
    max-width: 300px;
  }

  /* Search Results Styles */
  .search-results-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .search-result-item {
    display: flex;
    align-items: center;
    padding: var(--space-md);
    border: none;
    background: transparent;
    text-align: left;
    width: 100%;
    cursor: pointer;
    color: var(--color-text-primary);
    border-bottom: 1px solid var(--color-border-secondary);
  }
  
  .search-result-item:hover {
    background-color: var(--color-background-hover);
  }
  
  .search-result-icon {
    flex-shrink: 0;
    margin-right: var(--space-md);
    font-size: 1.5rem;
  }
  
  .search-result-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  
  .search-result-title {
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-md);
  }
  
  .search-result-subtitle {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin-top: var(--space-xs);
  }
  
  .search-no-results, 
  .search-loading,
  .search-too-short {
    padding: var(--space-xl);
    text-align: center;
    color: var(--color-text-secondary);
    font-size: var(--font-size-md);
  }
  
  .search-result-more {
    padding: var(--space-md);
    text-align: center;
    border-top: 1px solid var(--color-border-secondary);
  }
  
  .search-results-more-link {
    color: var(--color-primary-accent);
    text-decoration: none;
    font-weight: var(--font-weight-medium);
    font-size: var(--font-size-md);
    padding: var(--space-sm) var(--space-lg);
    display: inline-block;
    border: 1px solid var(--color-primary-accent);
    border-radius: 4px;
  }
  
  .search-results-more-link:hover {
    background-color: var(--color-primary-accent);
    color: white;
  }
  
  .loading-spinner {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-left-color: var(--color-primary-accent);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: var(--space-md);
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  [data-theme="dark"] .loading-spinner {
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-left-color: var(--color-primary-accent);
  }

  .search-go-button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    margin-right: 0.5rem;
    color: var(--color-search-icon, #555);
    border-radius: 50%;
    transition: background-color 0.2s ease;
  }
  
  .search-go-button:hover {
    background-color: var(--color-background-tertiary, rgba(0, 0, 0, 0.05));
  }
  
  [data-theme="dark"] .search-go-button:hover {
    background-color: var(--color-background-tertiary, rgba(255, 255, 255, 0.1));
  }

  @media (max-width: 600px) {
    .top-bar {
      height: 4rem;
      padding: var(--space-xs) var(--space-md);
    }
    
    .top-bar-content-wrapper {
      gap: var(--space-xs);
    }
    
    .search-container {
      width: 100%;
      max-width: none;
    }
    
    .main-nav-bar {
      padding: var(--space-xs) var(--space-md);
    }
    
    .site-logo-img {
      height: 36px;
    }
    
    .search-results-overlay {
      top: 4rem;
    }
    
    .search-results-container {
      padding: var(--space-md);
    }
  }

  /* Add direct dark mode override as well */
  :global([data-theme="dark"]) .mobile-menu {
    background-color: #20232a !important;
  }
</style> 