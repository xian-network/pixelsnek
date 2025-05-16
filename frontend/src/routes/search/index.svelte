<script>
  import { onMount } from 'svelte';
  import { getSearchResultsQuery, processSearchResults, constructValuesQuery } from '../../js/graphqlQueries.js';
  import { config } from '../../js/config.js'; // Import config
  import { getContext } from 'svelte';
  import NFTCard from '../../components/cards/NFTCard.svelte';
  import Button from '../../components/Button.svelte';
  import Spinner from '../../components/Spinner.svelte';
  import { fetchValues, fetchThings } from '../../js/processGraphql.js';
  import { formatThings, updateInfo } from "../../js/utils";
  
  // Context and app functions
  const appFunctions = getContext('app_functions');
  let graphqlEndpoint = config.graphqlEndpoint; // Use config directly
  
  // Search state
  let searchQuery = '';
  let searchResults = [];
  let formattedArtworks = [];
  let isSearching = false;
  let noResults = false;
  
  // Track detailed artwork data
  let artworkDetails = new Map();
  
  // Pagination
  let offset = 0;
  let take = 20;
  let hasMore = false;
  
  onMount(async () => {
    console.log("Search page mounted");
    console.log("Using GraphQL endpoint from config:", graphqlEndpoint);
    
    // Get query param from URL
    const urlParams = new URLSearchParams(window.location.search);
    searchQuery = urlParams.get('q') || '';
    console.log("Search query from URL:", searchQuery);
    
    if (searchQuery) {
      await performSearch();
    }
  });
  
  async function performSearch() {
    if (!searchQuery) {
      searchResults = [];
      formattedArtworks = [];
      noResults = true;
      return;
    }
    
    // Check minimum length requirement
    if (searchQuery.length < 2) {
      searchResults = [];
      formattedArtworks = [];
      noResults = false; // Not really "no results" but a special condition
      isSearching = false;
      return; // Don't perform the search yet
    }
    
    isSearching = true;
    noResults = false;
    
    try {
      // Use the endpoint from config
      console.log("Search page using endpoint:", graphqlEndpoint);
      
      const query = getSearchResultsQuery(searchQuery, offset, take);
      const response = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      const data = await response.json();
      console.log("Search page results:", data);
      
      if (data && data.data) {
        const newResults = processSearchResults(data.data);
        searchResults = offset > 0 ? [...searchResults, ...newResults] : newResults;
        hasMore = newResults.length === take;
        noResults = searchResults.length === 0;
        
        // Get details for artwork results
        const artworkUids = searchResults
          .filter(result => result.type === 'artwork' || result.type === 'uid')
          .map(result => result.uid);
        
        if (artworkUids.length > 0) {
          console.log("Fetching artwork details for UIDs:", artworkUids);
          // Use fetchValues like Recent.svelte does
          const valuesQuery = constructValuesQuery(artworkUids);
          const artworkData = await fetchValues(valuesQuery);
          console.log("Artwork data from fetchValues:", artworkData);
          
          // Format the artwork data same as in Recent.svelte
          const newFormattedArtworks = formatThings(artworkData);
          console.log("Formatted artworks:", newFormattedArtworks);
          
          formattedArtworks = offset > 0 ? 
            [...formattedArtworks, ...newFormattedArtworks] : 
            newFormattedArtworks;
        }
      } else {
        searchResults = [];
        formattedArtworks = [];
        noResults = true;
      }
    } catch (error) {
      console.error('Search error:', error);
      searchResults = [];
      formattedArtworks = [];
      noResults = true;
    } finally {
      isSearching = false;
    }
  }
  
  async function loadArtworkDetails(uids) {
    try {
      // Construct query to get details for multiple UIDs
      const valuesQuery = `
        query GetArtworkDetails {
          ${uids.map((uid, index) => `
            artwork_${index}: allStates(filter: {key: {startsWith: "${config.infoContract}.S:${uid}"}}) {
              nodes {
                key
                value
              }
            }
          `).join('')}
        }
      `;
      
      const response = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: valuesQuery }),
      });
      
      const data = await response.json();
      
      if (data && data.data) {
        // Process the artwork details
        uids.forEach((uid, index) => {
          const nodes = data.data[`artwork_${index}`]?.nodes || [];
          if (nodes.length > 0) {
            // Extract artwork details from nodes
            const details = processArtworkNodes(nodes, uid);
            artworkDetails.set(uid, details);
          }
        });
        
        // Force reactivity update
        artworkDetails = artworkDetails;
      }
    } catch (error) {
      console.error('Error loading artwork details:', error);
    }
  }
  
  function processArtworkNodes(nodes, uid) {
    const details = {
      uid,
      title: 'Untitled',
      description: '',
      creator: '',
      owner: '',
      price_amount: 0,
      pixels: []
    };
    
    nodes.forEach(node => {
      const { key, value } = node;
      const parts = key.split(':');
      const field = parts[parts.length - 1];
      
      switch (field) {
        case 'title':
          details.title = value;
          break;
        case 'description':
          details.description = value;
          break;
        case 'creator':
          details.creator = value;
          break;
        case 'owner':
          details.owner = value;
          break;
        case 'amount': // price amount
          details.price_amount = parseFloat(value) || 0;
          break;
        case 'thing': // pixels data
          try {
            details.pixels = JSON.parse(value);
          } catch (e) {
            console.error('Error parsing pixels data:', e);
          }
          break;
      }
    });
    
    return details;
  }
  
  function loadMore() {
    offset += take;
    performSearch();
  }
  
  // Helper function to format addresses
  function formatAccountAddress(address) {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }
</script>

<svelte:head>
  <title>Search Results | PixelSnEK</title>
</svelte:head>

<div class="search-page">
  <div class="search-header">
    <h1>Search Results</h1>
    
    {#if searchQuery}
      <div class="search-meta">
        <p>Showing results for: <strong>"{searchQuery}"</strong></p>
      </div>
    {/if}
  </div>
  
  {#if isSearching && searchResults.length === 0}
    <div class="search-loading">
      <Spinner size="lg" />
      <p>Searching...</p>
    </div>
  {:else if searchQuery && searchQuery.length < 2}
    <div class="search-min-length">
      <p>Please enter at least 2 characters to search</p>
    </div>
  {:else if noResults}
    <div class="search-no-results">
      <p>No results found for "{searchQuery}"</p>
      <p>Try using different keywords or check your spelling.</p>
    </div>
  {:else}
    <div class="search-results-grid">
      <!-- Display artwork results -->
      {#each formattedArtworks as thingInfo, index}
        <div class="nft-card-wrapper">
          <NFTCard
            pixels={thingInfo.frames}
            pixelSize={7}
            title={thingInfo.name || 'Untitled NFT'}
            description={thingInfo.description || ''}
            creatorName={thingInfo.creator || 'Unknown Creator'}
            ownerName={thingInfo.owner}
            currentBid={thingInfo.price_amount || 0}
            currencySymbol={config.currencySymbol}
            updateInfo={(updates) => {
              updateInfo(formattedArtworks[index], updates);
              formattedArtworks = [...formattedArtworks];
            }}
            href={`/frames/${thingInfo.uid}`}
            {thingInfo}
          />
        </div>
      {/each}
      
      <!-- Display wallet results -->
      {#each searchResults.filter(result => result.type === 'wallet') as result}
        <a href={`/profile/${result.address}`} class="search-result-item">
          <div class="search-result-card">
            <div class="result-icon">👤</div>
            <div class="result-content">
              <h3>Wallet</h3>
              <p class="result-subtitle">{formatAccountAddress(result.address)}</p>
            </div>
          </div>
        </a>
      {/each}
    </div>
    
    {#if hasMore}
      <div class="load-more-container">
        <Button 
          variant="secondary-medium" 
          on:click={loadMore} 
          disabled={isSearching}
        >
          {isSearching ? 'Loading...' : 'Load More Results'}
        </Button>
      </div>
    {/if}
  {/if}
</div>

<style>
  .search-page {
    padding: var(--space-lg, 1.5rem);
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .search-header {
    margin-bottom: var(--space-xl, 2rem);
  }
  
  .search-header h1 {
    font-size: var(--font-size-2xl, 1.875rem);
    margin-bottom: var(--space-md, 1rem);
  }
  
  .search-meta {
    margin-bottom: var(--space-lg, 1.5rem);
    font-size: var(--font-size-sm, 0.875rem);
    color: var(--color-text-secondary, #6b7280);
  }
  
  .search-loading,
  .search-no-results,
  .search-min-length {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-xl, 2rem);
    text-align: center;
    color: var(--color-text-secondary, #6b7280);
  }
  
  .search-min-length {
    background-color: var(--color-background-tertiary, #f3f4f6);
    border-radius: var(--border-radius-md, 6px);
    border: 1px solid var(--color-border-secondary, #e5e7eb);
  }
  
  .search-results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--space-lg, 1.5rem);
  }
  
  .nft-card-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
  }
  
  .search-result-item {
    text-decoration: none;
    color: inherit;
    display: block;
  }
  
  .search-result-card {
    background-color: var(--color-background-secondary, #f9fafb);
    border: 1px solid var(--color-border-secondary, #e5e7eb);
    border-radius: var(--border-radius-md, 6px);
    padding: var(--space-md, 1rem);
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .search-result-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06));
  }
  
  .result-icon {
    font-size: 2rem;
    margin-bottom: var(--space-sm, 0.5rem);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    background-color: var(--color-background-tertiary, #f3f4f6);
    border-radius: var(--border-radius-sm, 4px);
  }
  
  .result-content {
    padding: var(--space-sm, 0.5rem) 0;
  }
  
  .result-content h3 {
    margin: 0;
    font-size: var(--font-size-lg, 1.125rem);
    margin-bottom: var(--space-xs, 0.25rem);
  }
  
  .result-subtitle {
    margin: 0;
    color: var(--color-text-secondary, #6b7280);
    font-size: var(--font-size-sm, 0.875rem);
  }
  
  .load-more-container {
    margin-top: var(--space-xl, 2rem);
    display: flex;
    justify-content: center;
  }
  
  @media (max-width: 768px) {
    .search-results-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: var(--space-md, 1rem);
    }
    
    .result-icon {
      height: 80px;
      font-size: 1.5rem;
    }
    
    .result-content h3 {
      font-size: var(--font-size-md, 1rem);
    }
    
    .search-page {
      padding: var(--space-md, 1rem);
    }
  }
</style> 