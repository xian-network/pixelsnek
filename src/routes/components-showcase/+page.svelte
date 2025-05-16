<script>
  import Button from '../../lib/components/Button.svelte';
  import Icon from '../../lib/components/Icon.svelte';
  import Input from '../../lib/components/Input.svelte';
  import Tabs from '../../lib/components/Tabs.svelte';
  import Disclosure from '../../lib/components/Disclosure.svelte';
  import Dropdown from '../../lib/components/Dropdown.svelte';
  import Modal from '../../lib/components/Modal.svelte';
  import NFTCard from '../../lib/components/cards/NFTCard.svelte';
  import NFTItemPreviewCard from '../../lib/components/cards/NFTItemPreviewCard.svelte';
  import NFTPixelCard from '../../components/cards/NFTPixelCard.svelte';
  import NFTPixelPreviewCard from '../../components/cards/NFTPixelPreviewCard.svelte';
  import NFTFrameCard from '../../components/cards/NFTFrameCard.svelte';
  import MelodicaButton from './MelodicaButton.svelte';

  import { theme, toggleTheme } from '../../lib/stores/theme.js';
  import { onMount } from 'svelte';
  import { fetchThings } from '../../js/processGraphql.js';
  import { getRecentUidsQuery } from '../../js/graphqlQueries.js';
  import { config } from '../../js/config.js';

  // Import showcase-specific styles
  import './showcase-styles.css';

  // --- Props for Components ---

  // Icon paths (examples - replace with actual relevant icons later)
  const heartIconPath = "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z";
  const searchIconPath = "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z";
  const settingsIconPath = "M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.23,5.08c-0.59,0.24-1.13,0.57-1.62,0.94l-2.39-0.96c-0.22-0.08-0.47,0-0.59,0.22L2.71,8.58c-0.12,0.21-0.07,0.47,0.12,0.61l2.03,1.58C4.8,11.36,4.78,11.68,4.78,12s0.02,0.64,0.07,0.94l-2.03,1.58c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.27c0.04,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.27c0.59-0.24,1.13-0.57,1.62-0.94l2.39,0.96c0.22,0.08,0.47,0,0.59,0.22l1.92-3.32c0.12-0.21,0.07-0.47-0.12-0.61L19.14,12.94z M12,15c-1.66,0-3-1.34-3-3s1.34-3,3-3s3,1.34,3,3S13.66,15,12,15z";

  // Input
  let inputValue = 'Some text';
  let searchInputValue = '';

  // Tabs
  let tabItems = [
    { id: 'profile', label: 'Profile' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'settings', label: 'Settings' },
  ];
  let activeTab = tabItems[0].id;

  // Disclosure
  let disclosureInitiallyOpen = false;

  // Dropdown
  let dropdownItems = [
    { id: '1', label: 'Option 1' },
    { id: '2', label: 'Option 2' },
    { id: '3', label: 'Option 3 (long)' },
    { id: '4', label: 'Another Option' },
  ];
  let selectedDropdownId = null;

  // Modal
  let isModalOpen = false;
  function openModal() { isModalOpen = true; }
  function closeModalHandler() { isModalOpen = false; }

  // Pixel art data for the new NFT components
  // A simple example pattern of 16x16 pixels
  const samplePixels1 = Array(256).fill('').map((_, i) => {
    // Create a simple pattern - checkerboard with different colors
    const row = Math.floor(i / 16);
    const col = i % 16;
    
    if ((row < 8 && col < 8) || (row >= 8 && col >= 8)) {
      return '#4a148c'; // Purple
    } else if (row < 8) {
      return '#e91e63'; // Pink
    } else {
      return '#2196f3'; // Blue
    }
  });

  const samplePixels2 = Array(256).fill('').map((_, i) => {
    // Create a simple pattern - gradients
    const row = Math.floor(i / 16);
    const col = i % 16;
    
    // Make a circular pattern
    const distanceFromCenter = Math.sqrt(Math.pow(row - 7.5, 2) + Math.pow(col - 7.5, 2));
    
    if (distanceFromCenter < 3) {
      return '#ff9800'; // Orange center
    } else if (distanceFromCenter < 6) {
      return '#4caf50'; // Green middle ring
    } else {
      return '#9c27b0'; // Purple outer ring
    }
  });

  // Create two example cards with pixel art
  const pixelCardData1 = {
    pixels: samplePixels1,
    pixelSize: 4,
    title: 'Pixel Art #001',
    collectionName: 'Pixelated Collection',
    creatorName: 'PixelMaster',
    currentBid: 1.5678,
    currencySymbol: 'XIAN',
    timeLeft: '05:45:32',
    href: '#pixel1',
    onBidClick: () => console.log('Bid clicked on Pixel NFT 1'),
    onInfoClick: () => console.log('Info clicked on Pixel NFT 1')
  };

  const pixelCardData2 = {
    pixels: samplePixels2,
    pixelSize: 4,
    title: 'Circle Pattern #042',
    creatorName: 'ArtBot3000',
    currentBid: 2.9012,
    currencySymbol: 'XIAN',
    timeLeft: '03:20:15',
    href: '#pixel2',
    onBidClick: () => console.log('Bid clicked on Pixel NFT 2')
  };

  // Placeholder data for Pixel Preview Cards
  const pixelPreviewData = [
    { pixels: samplePixels1, pixelSize: 3, title: 'Pattern 1', linkUrl: '#pattern1' },
    { pixels: samplePixels2, pixelSize: 3, title: 'Pattern 2', linkUrl: '#pattern2' }
  ];

  // Create animation frames data for NFTFrameCard
  const frame1 = Array(256).fill('').map((_, i) => {
    // Simple smile face - first frame
    const row = Math.floor(i / 16);
    const col = i % 16;
    
    // Background
    let color = '#222222';
    
    // Yellow circle
    const distanceFromCenter = Math.sqrt(Math.pow(row - 7.5, 2) + Math.pow(col - 7.5, 2));
    if (distanceFromCenter < 7) {
      color = '#FFCC00';
    }
    
    // Eyes
    if ((row === 5 && (col === 5 || col === 10))) {
      color = '#000000';
    }
    
    // Smile - straight mouth
    if (row === 10 && col >= 5 && col <= 10) {
      color = '#000000';
    }
    
    return color;
  });

  const frame2 = Array(256).fill('').map((_, i) => {
    // Simple smile face - second frame
    const row = Math.floor(i / 16);
    const col = i % 16;
    
    // Background
    let color = '#222222';
    
    // Yellow circle
    const distanceFromCenter = Math.sqrt(Math.pow(row - 7.5, 2) + Math.pow(col - 7.5, 2));
    if (distanceFromCenter < 7) {
      color = '#FFCC00';
    }
    
    // Eyes
    if ((row === 5 && (col === 5 || col === 10))) {
      color = '#000000';
    }
    
    // Smile - happy mouth
    if ((row === 9 && col >= 5 && col <= 10) || 
        (row === 10 && (col === 5 || col === 10)) ||
        (row === 11 && col >= 6 && col <= 9)) {
      color = '#000000';
    }
    
    return color;
  });

  // Frame animation logic
  let currentFrameIndex = 0;
  let animationFrames = [frame1, frame2];
  let animationInterval;

  onMount(() => {
    // Start animation
    animationInterval = setInterval(() => {
      currentFrameIndex = (currentFrameIndex + 1) % animationFrames.length;
    }, 500); // Switch every 500ms
    
    return () => {
      clearInterval(animationInterval);
    };
  });

  // State for animated NFTs
  let animatedNFTs = [];
  let loadingNFTs = true;
  let errorNFTs = null;

  onMount(async () => {
    console.log("ONMOUNT CALLED")
    try {
      loadingNFTs = true;
      console.log('Starting NFT fetch...');
      console.log('GraphQL endpoint:', config.graphqlEndpoint);
      console.log('Info contract:', config.infoContract);
      
      const query = `
        query MyQuery {
          allStates(
            filter: {key: {startsWith: "${config.infoContract}.S", endsWith: "thing"}}
            orderBy: UPDATED_DESC
            first: 10
          ) {
            nodes {
              key
              value
            }
          }
        }
      `;
      console.log('GraphQL query:', query);

      const response = await fetch(config.graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      console.log('Raw response:', json);

      if (json.errors) {
        console.error('GraphQL errors:', json.errors);
        throw new Error(json.errors[0].message);
      }

      if (!json.data || !json.data.allStates || !json.data.allStates.nodes) {
        console.error('Unexpected response structure:', json);
        throw new Error('Invalid response structure');
      }

      console.log('Number of nodes:', json.data.allStates.nodes.length);

      // Process the NFT data
      const nfts = json.data.allStates.nodes.map((node, index) => {
        console.log(`Processing node ${index}:`, node);
        const uid = node.key.split(':')[1];
        console.log(`Extracted UID: ${uid}`);
        
        try {
          console.log(`Raw value for ${uid}:`, node.value);
          const thing = JSON.parse(node.value);
          console.log(`Parsed thing for ${uid}:`, thing);
          
          // Ensure thing is an array of frames
          if (!Array.isArray(thing)) {
            console.warn(`NFT ${uid} thing is not an array:`, thing);
            return null;
          }

          // Ensure each frame is a valid array of colors
          const validFrames = thing.every(frame => 
            Array.isArray(frame) && 
            frame.length === 256 && 
            frame.every(color => typeof color === 'string')
          );

          if (!validFrames) {
            console.warn(`NFT ${uid} has invalid frames:`, thing);
            return null;
          }
          
          return {
            uid,
            thing,
            title: `NFT #${uid.slice(0, 8)}`,
            collectionName: 'Pixel Collection',
            creatorName: 'Pixel Artist',
            currentBid: 0,
            timeLeft: '00:00:00'
          };
        } catch (e) {
          console.error(`Error parsing NFT data for ${uid}:`, e);
          return null;
        }
      }).filter(nft => nft && nft.thing);

      console.log('Final processed NFTs:', nfts);
      animatedNFTs = nfts;
    } catch (error) {
      console.error('Error in NFT fetch:', error);
      errorNFTs = error.message;
    } finally {
      loadingNFTs = false;
    }
  });

</script>

<div class="component-showcase">
  <header class="showcase-header">
    <h1>Component Showcase</h1>
    <div style="display: flex; gap: 10px;">
      <MelodicaButton on:click={toggleTheme} variant="primary-medium">
        Toggle Theme ({$theme})
      </MelodicaButton>
      <button 
        class="raw-melodica-btn"
        style="font-family: 'Medodica', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important; 
             background-color: var(--color-primary-accent); color: white; border: none; padding: 8px 16px; 
             border-radius: 8px; cursor: pointer;">
        Melodica Button
      </button>
    </div>
  </header>

  <div class="important-notice">
    <p><strong>Note:</strong> To use Melodica font on buttons, you need to either:</p>
    <ol>
      <li>Use the custom MelodicaButton component</li>
      <li>Use raw HTML button with inline style</li>
      <li>Override the global font styles in fonts.css</li>
    </ol>
    <p>The default buttons use Raster Forge font as specified in the global styles.</p>
  </div>

  <section class="font-comparison-section">
    <h2>Font Comparison</h2>
    <div class="component-group">
      <div class="font-sample">
        <p>Melodica Font Button (Custom Component):</p>
        <MelodicaButton variant="primary-m">Melodica Button (Custom)</MelodicaButton>
      </div>
      <div class="font-sample">
        <p>Button with fontFamily="melodica":</p>
        <Button fontFamily="melodica" variant="primary-m">Regular Button</Button>
      </div>
      <div class="font-sample">
        <p>Raw HTML Button with inline style:</p>
        <button 
          style="font-family: 'Medodica', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important; 
                background-color: var(--color-primary-accent); color: white; border: none; padding: 8px 16px; 
                border-radius: 8px; cursor: pointer;">
          Raw HTML Button
        </button>
      </div>
      <div class="font-sample">
        <p>Raster Forge Font:</p>
        <div class="font-raster">
          <p>The quick brown fox jumps over the lazy dog.</p>
          <Button fontFamily="raster" variant="primary-m">Raster Button</Button>
        </div>
      </div>
    </div>
  </section>

  <section>
    <h2>Icons</h2>
    <div class="icon-grid">
      <Icon path={heartIconPath} size="2em" color="var(--color-primary-accent)" />
      <Icon path={searchIconPath} size="2em" />
      <Icon path={settingsIconPath} size="2em" />
    </div>
  </section>

  <section>
    <h2>Buttons</h2>
    <div class="button-grid">
      <div><strong>Primary M:</strong> <Button fontFamily="melodica" variant="primary-m">Primary M</Button></div>
      <div><strong>Primary M (Icon Left):</strong> <Button fontFamily="melodica" variant="primary-m" iconLeft={heartIconPath}>With Icon</Button></div>
      <div><strong>Primary Medium:</strong> <Button fontFamily="melodica" variant="primary-medium">Primary Medium</Button></div>
      <div><strong>Primary Icon:</strong> <Button fontFamily="melodica" variant="primary-icon" iconLeft={settingsIconPath} /></div>
      <div><strong>Faded Small:</strong> <Button fontFamily="melodica" variant="faded-small" iconLeft={searchIconPath} /></div>
      <div><strong>Text:</strong> <Button fontFamily="melodica" variant="text">Text Button</Button></div>
      <div><strong>Disabled Primary:</strong> <Button fontFamily="melodica" variant="primary-m" disabled>Disabled</Button></div>
      <div><strong>Link Button:</strong> <Button fontFamily="melodica" href="#" variant="primary-m">Link</Button></div>
    </div>
  </section>

  <section>
    <h2>Inputs</h2>
    <div class="input-grid">
      <Input label="Standard Input" placeholder="Enter text here..." bind:value={inputValue} />
      <Input label="Search Input" type="search" placeholder="Search..." iconLeft={searchIconPath} bind:value={searchInputValue}/>
      <Input label="Disabled Input" placeholder="Cannot edit" disabled value="Disabled Text"/>
      <Input label="Readonly Input" readonly value="Readonly Text" iconRight={settingsIconPath} />
    </div>
  </section>

  <section>
    <h2>Tabs</h2>
    <Tabs items={tabItems} bind:activeTabId={activeTab} let:activeItem>
      {#if activeItem}
        <div class="tab-content-example">
          <h3>Content for {activeItem.label}</h3>
          <p>This is the content area for the tab with ID: {activeItem.id}</p>
        </div>
      {/if}
    </Tabs>
  </section>

  <section>
    <h2>Disclosure (Accordion)</h2>
    <Disclosure title="Section 1 - Click to expand (Default Closed)">
      <p>This is the content for the first disclosure. It can contain any markup or components.</p>
    </Disclosure>
    <Disclosure title="Section 2 - Initially Open" initiallyOpen={true}>
      <p>This disclosure starts open. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
      <Button fontFamily="melodica" variant="primary-m">Button inside disclosure</Button>
    </Disclosure>
  </section>

  <section>
    <h2>Dropdown</h2>
    <Dropdown items={dropdownItems} bind:selectedId={selectedDropdownId} placeholder="Choose an item..." />
    <p>Selected ID: {selectedDropdownId || 'None'}</p>
  </section>

  <section>
    <h2>Modal</h2>
    <Button fontFamily="melodica" on:click={openModal} variant="primary-m">Open Modal</Button>
    <Modal bind:isOpen={isModalOpen} on:close={closeModalHandler} title="Sample Modal Title">
      <p>This is the main content of the modal. You can put any Svelte components or HTML here.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam quis risus eget urna mollis ornare vel eu leo.</p>
      <Input label="Input inside modal" placeholder="Test focus trapping..." />
      <svelte:fragment slot="footer">
        <Button fontFamily="melodica" on:click={closeModalHandler} variant="text">Cancel</Button>
        <Button fontFamily="melodica" on:click={closeModalHandler} variant="primary-m">Confirm Action</Button>
      </svelte:fragment>
    </Modal>
  </section>

  <section>
    <h2>NFT Card</h2>
    <div class="nft-card-grid">
      <NFTCard {...nftCardData1} />
      <NFTCard {...nftCardData2} />
      <NFTCard title="Card with No Image" currentBid={10.0} timeLeft="2 days" creatorName="Anon" onInfoClick={() => alert('Info!')} />
    </div>
  </section>

  <section>
    <h2>NFT Pixel Card</h2>
    <div class="nft-card-grid">
      <NFTPixelCard {...pixelCardData1} />
      <NFTPixelCard {...pixelCardData2} />
    </div>
  </section>

  <section>
    <h2>NFT Item Preview Card</h2>
    <div class="nft-preview-card-grid">
      {#each nftPreviewData as item}
        <NFTItemPreviewCard {...item} />
      {/each}
    </div>
  </section>

  <section>
    <h2>NFT Pixel Preview Card</h2>
    <div class="nft-preview-card-grid">
      {#each pixelPreviewData as item}
        <NFTPixelPreviewCard {...item} />
      {/each}
    </div>
  </section>

  <section class="component-section">
    <h2 class="section-title">Live Animated NFTs</h2>
    <div class="nft-frame-card-grid">
      {#if loadingNFTs}
        <div class="loading">Loading NFTs...</div>
      {:else if errorNFTs}
        <div class="error">Error: {errorNFTs}</div>
      {:else if animatedNFTs.length === 0}
        <div class="empty-state">No animated NFTs found</div>
      {:else}
        {#each animatedNFTs as nft}
          {#if nft.thing}
            {@debug nft}
            <NFTFrameCard
              pixels={nft.thing}
              pixelSize={5}
              frameNum={0}
              title={nft.title || 'Untitled NFT'}
              collectionName={nft.collection || 'Pixel Collection'}
              creatorName={nft.creator || 'Unknown Creator'}
              currentBid={nft.currentBid || 0}
              currencySymbol="XIAN"
              timeLeft={nft.timeLeft || '00:00:00'}
              href={`/nft/${nft.uid}`}
              onBidClick={() => console.log('Bid clicked for NFT:', nft.uid)}
              onInfoClick={() => console.log('Info clicked for NFT:', nft.uid)}
            />
          {/if}
        {/each}
      {/if}
    </div>
  </section>

  <section>
    <h2>SVG Icon Components (from /src/icons/)</h2>
    <div class="icon-catalog-grid svelte-icon-catalog">
      {#each iconComponents as icon}
        <div class="icon-catalog-item">
          <svelte:component this={icon.component} size="2.5em" title={icon.name} />
          <p class="icon-name">{icon.name}.svelte</p>
        </div>
      {/each}
    </div>
  </section>

</div>

<style>
  .component-showcase {
    padding: var(--space-xl);
    max-width: 1000px;
    margin: 0 auto;
  }
  .showcase-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-xxl);
    padding-bottom: var(--space-lg);
    border-bottom: 1px solid var(--color-border-secondary);
  }
  .showcase-header h1 {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
  }
  section {
    margin-bottom: var(--space-xxl);
  }
  section h2 {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-semibold);
    margin-bottom: var(--space-lg);
    padding-bottom: var(--space-sm);
    border-bottom: 1px solid var(--color-border-secondary);
  }
  .icon-grid,
  .button-grid,
  .input-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--space-lg);
    align-items: start;
  }
  .icon-grid > div, .button-grid > div, .input-grid > div {
    padding: var(--space-sm);
    border: 1px dashed var(--color-border-primary);
    border-radius: var(--space-xs);
  }
  .tab-content-example {
    padding: var(--space-md);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--space-xs);
    margin-top: var(--space-sm);
  }

  /* Make sure page uses theme transitions */
  :global(body) {
    background-color: var(--color-background-primary);
    color: var(--color-text-primary);
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .icon-name {
    margin-top: var(--space-xs);
    font-size: var(--font-size-xs);
  }

  .note {
    margin-top: var(--space-md);
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    font-style: italic;
  }

  .nft-frame-card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: var(--space-lg);
    margin-top: var(--space-md);
  }
</style> 