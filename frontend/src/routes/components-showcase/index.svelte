<script>
  // Point to components in src/components
  import Button from '../../components/Button.svelte';
  import Icon from '../../components/Icon.svelte';
  import Input from '../../components/Input.svelte';
  import Tabs from '../../components/Tabs.svelte';
  import Disclosure from '../../components/Disclosure.svelte';
  import Dropdown from '../../components/Dropdown.svelte';
  import Modal from '../../components/Modal.svelte';
  import NFTCard from '../../components/cards/NFTCard.svelte';
  import NFTItemPreviewCard from '../../components/cards/NFTItemPreviewCard.svelte';
  import NFTFrameCard from '../../components/cards/NFTFrameCard.svelte';

  // Point to theme store in src/js/stores
  import { theme, toggleTheme } from '../../js/stores/theme.js';

  // --- Icon Component Imports for Showcase ---
  import AlbumIcon from '../../icons/AlbumIcon.svelte';
  import CheckIcon from '../../icons/CheckIcon.svelte';
  import CloseIcon from '../../icons/CloseIcon.svelte';
  import CopyIcon from '../../icons/CopyIcon.svelte';
  import CreditCardIcon from '../../icons/CreditCardIcon.svelte';
  import Group2Icon from '../../icons/Group2Icon.svelte';
  import GroupCopy11Icon from '../../icons/GroupCopy11Icon.svelte';
  import GroupIcon from '../../icons/GroupIcon.svelte';
  import LocationIcon from '../../icons/LocationIcon.svelte';
  import MenuIcon from '../../icons/MenuIcon.svelte';
  import MoonIcon from '../../icons/MoonIcon.svelte';
  import MoreIcon from '../../icons/MoreIcon.svelte';
  import PlayIcon from '../../icons/PlayIcon.svelte';
  import RoundAdd24Px2CopyIcon from '../../icons/RoundAdd24Px2CopyIcon.svelte';
  import RoundAdd24Px2Icon from '../../icons/RoundAdd24Px2Icon.svelte';
  import RoundArrowForward24PxCopyIcon from '../../icons/RoundArrowForward24PxCopyIcon.svelte';
  import RoundArrowForward24PxIcon from '../../icons/RoundArrowForward24PxIcon.svelte';
  import RoundExpandMore24Px2Icon from '../../icons/RoundExpandMore24Px2Icon.svelte';
  import RoundExpandMore24Px3Icon from '../../icons/RoundExpandMore24Px3Icon.svelte';
  import RoundExpandMore24PxCopyIcon from '../../icons/RoundExpandMore24PxCopyIcon.svelte';
  import RoundExpandMore24PxIcon from '../../icons/RoundExpandMore24PxIcon.svelte';
  import RoundPerson24PxCopy3Icon from '../../icons/RoundPerson24PxCopy3Icon.svelte';
  import RoundRemove24Px1Icon from '../../icons/RoundRemove24Px1Icon.svelte';
  import SearchIcon from '../../icons/SearchIcon.svelte';
  import UpgradeFIcon from '../../icons/UpgradeFIcon.svelte';
  import PixelCancelIcon from '../../icons/pixelCancel.svelte'; // Assuming this path
  import TrophyIcon from '../../icons/trophy.svelte';       // Assuming this path

  import { onMount } from 'svelte';
  import { config } from '../../js/config.js';
  import { fetchThings } from '../../js/processGraphql.js';
  import { getRecentUidsQuery } from '../../js/graphqlQueries.js';
  import { formatThings } from '../../js/utils.js';

  console.log("COMPONENT INITIALIZING - components-showcase/index.svelte");

  export let segment; // Ensures the component accepts the segment prop from Sapper's router/layout

  console.log("COMPONENT PROPS RECEIVED - segment:", segment);

  // --- Props for Components ---
  const heartIconPath = "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z";
  const searchIconPath_demo = "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"; // Renamed slightly to avoid conflict if needed

  let inputValue = 'Some text';
  let searchInputValue = '';
  let tabItems = [
    { id: 'profile', label: 'Profile' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'settings', label: 'Settings' },
  ];
  let activeTab = tabItems[0].id;
  let dropdownItems = [
    { id: '1', label: 'Option 1' },
    { id: '2', label: 'Option 2' },
    { id: '3', label: 'Option 3 (Very very long label to test text overflow)' },
    { id: '4', label: 'Another Option' },
  ];
  let selectedDropdownId = null;
  let isModalOpen = false;
  function openModal() { isModalOpen = true; }
  function closeModalHandler() { isModalOpen = false; }

  // Placeholder data for NFT Cards
  // const nftCardData1 = {
  //   imageUrl: 'https://via.placeholder.com/300/8A42D8/FFFFFF?text=NFT+Image+1', // Placeholder image
  //   title: 'Abstract Painting #123',
  //   collectionName: 'Modern Abstracts',
  //   creatorAvatarUrl: 'https://via.placeholder.com/24/cccccc/1D1D1F?text=A', 
  //   creatorName: 'Alice Artista',
  //   currentBid: 1.2345,
  //   currencySymbol: 'XIAN',
  //   timeLeft: '12:34:56',
  //   href: '#nft1',
  //   onBidClick: () => console.log('Bid clicked on NFT 1'),
  //   onInfoClick: () => console.log('Info clicked on NFT 1'),
  // };
  // const nftCardData2 = {
  //   imageUrl: 'https://via.placeholder.com/300/A36DFF/FFFFFF?text=NFT+Image+2',
  //   title: 'Cyber Punk Samurai',
  //   creatorAvatarUrl: 'https://via.placeholder.com/24/7C7C99/FFFFFF?text=B',
  //   creatorName: 'Bob Bytepainter',
  //   currentBid: 0.8765,
  //   currencySymbol: 'XIAN',
  //   timeLeft: '01:05:10',
  //   href: '#nft2',
  //   onBidClick: () => console.log('Bid clicked on NFT 2'),
  //   onInfoClick: null, // Example without info button
  // };

  // Placeholder data for NFT Preview Cards
  const nftPreviewData = [
    { imageUrl: 'https://via.placeholder.com/150/771796/FFFFFF?text=Preview+1', title: 'Preview Item 1', linkUrl: '#preview1' },
    { imageUrl: 'https://via.placeholder.com/150/24f0ed/FFFFFF?text=Preview+2', title: 'Preview Item 2', linkUrl: '#preview2' },
    { imageUrl: '', title: 'No Image Preview', linkUrl: '#preview3' }, // Example with no image
    { imageUrl: 'https://via.placeholder.com/150/f0f0f0/000000?text=Preview+4', linkUrl: '#preview4' }, // Example with no title
  ];

  // --- List of Icon Components for Catalog ---
  const iconComponents = [
    { name: 'AlbumIcon', component: AlbumIcon },
    { name: 'CheckIcon', component: CheckIcon },
    { name: 'CloseIcon', component: CloseIcon },
    { name: 'CopyIcon', component: CopyIcon },
    { name: 'CreditCardIcon', component: CreditCardIcon },
    { name: 'Group2Icon (Twitter?)', component: Group2Icon },
    { name: 'GroupCopy11Icon (Reddit?)', component: GroupCopy11Icon },
    { name: 'GroupIcon (Facebook?)', component: GroupIcon },
    { name: 'LocationIcon', component: LocationIcon },
    { name: 'MenuIcon', component: MenuIcon },
    { name: 'MoonIcon', component: MoonIcon },
    { name: 'MoreIcon', component: MoreIcon },
    { name: 'PlayIcon', component: PlayIcon },
    { name: 'RoundAdd24Px2CopyIcon', component: RoundAdd24Px2CopyIcon },
    { name: 'RoundAdd24Px2Icon', component: RoundAdd24Px2Icon },
    { name: 'RoundArrowForward24PxCopyIcon (Left)', component: RoundArrowForward24PxCopyIcon },
    { name: 'RoundArrowForward24PxIcon (Right)', component: RoundArrowForward24PxIcon },
    { name: 'RoundExpandMore24Px2Icon (Chevron Left)', component: RoundExpandMore24Px2Icon },
    { name: 'RoundExpandMore24Px3Icon (Chevron Down)', component: RoundExpandMore24Px3Icon },
    { name: 'RoundExpandMore24PxCopyIcon (Chevron Right)', component: RoundExpandMore24PxCopyIcon },
    { name: 'RoundExpandMore24PxIcon (Chevron Up)', component: RoundExpandMore24PxIcon },
    { name: 'RoundPerson24PxCopy3Icon (Info?)', component: RoundPerson24PxCopy3Icon },
    { name: 'RoundRemove24Px1Icon', component: RoundRemove24Px1Icon },
    { name: 'SearchIcon', component: SearchIcon },
    { name: 'UpgradeFIcon', component: UpgradeFIcon },
    { name: 'PixelCancelIcon', component: PixelCancelIcon },
    { name: 'TrophyIcon', component: TrophyIcon },
  ];

  // State for animated NFTs
  let animatedNFTs = [];
  let loadingNFTs = true;
  let errorNFTs = null;

  onMount(async () => {
    console.log('COMPONENT MOUNTED');
    console.log('CONFIG:', config);
    
    try {
      console.log('FETCHING NFTS...');
      const nfts = await fetchThings(getRecentUidsQuery(0, 10));
      console.log('FETCHED NFTS:', nfts);
      
      if (nfts && nfts.length > 0) {
        const formattedNfts = formatThings(nfts);
        console.log('FORMATTED NFTS (index.svelte):', formattedNfts);
        
        animatedNFTs = formattedNfts.map(nft => {
          console.log(`Processing NFT for animatedNFTs (index.svelte): UID: ${nft.uid}, Name: ${nft.name}, Owner: ${nft.owner}, Price Amount: ${nft.price_amount}`);
          
          // Ensure frames is an array
          const frames = Array.isArray(nft.frames) ? nft.frames : [nft.frames];
          
          return {
            id: nft.uid,
            pixels: frames,
            title: nft.name || `NFT #${nft.uid.slice(0, 8)}`,
            collectionName: 'Pixel Collection',
            creatorName: nft.creator || 'Unknown Creator',
            ownerName: nft.owner,
            currentBid: nft.price_amount || 0,
            timeLeft: '2h 30m'
          };
        });
        console.log('PROCESSED NFTS:', animatedNFTs);
      } else {
        console.log('NO NFT DATA FOUND');
        errorNFTs = 'No NFTs found';
      }
    } catch (error) {
      console.error('ERROR FETCHING NFTS:', error);
      errorNFTs = 'Error loading NFTs';
    } finally {
      loadingNFTs = false;
    }

    // Add a debug statement to check if the component is being rendered
    console.log("COMPONENT RENDERING - components-showcase/index.svelte");
    console.log("Current animatedNFTs:", animatedNFTs);
    console.log("Loading state:", loadingNFTs);
    console.log("Error state:", errorNFTs);
  });

</script>

<svelte:head>
  <title>Component Showcase</title>
</svelte:head>

<div class="component-showcase">
  <header class="showcase-header">
    <h1>Component Showcase</h1>
    <Button on:click={toggleTheme} variant="primary-medium" 
      iconLeft={$theme === 'light' 
        ? "M12 3v1m0 16v1m8.66-15.66l-.7.7m-12.02 12.02l-.7.7M3 12h-1m17 0h-1m-15.66-8.66l.7.7M12.02 20.02l.7.7" 
        : "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" 
      } 
      iconSize="1.25em">
      Toggle Theme ({$theme})
    </Button>
  </header>
  <div class="font-test-raster font-raster">This text should be in Raster Forge</div>
  <div class="font-test-melodica font-melodica">This text should be in Melodica</div>
  <!-- Font Showcase Section -->
  <section class="font-showcase">
    <h1 class="font-heading" style="font-size: 3rem; margin-bottom: 1rem;">pixerlsnek</h1>
    <p>Above header uses Raster Forge font via the <code>.font-heading</code> class</p>
    <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
      <p class="font-pixel-elegant" style="font-size: 1.5rem;">Pixelated Elegance Font (Body Text)</p>
      <p class="font-raster" style="font-size: 1.5rem;">Raster Forge Font (Headings & Buttons)</p>
      <button class="font-raster" style="font-size: 1.5rem; margin-top: 0.5rem;">Raster Forge Button Example</button>
    </div>
  </section>

  <section>
    <h2>Buttons</h2>
    <div class="component-group">
      <div><h3>Primary M</h3><Button variant="primary-m">Primary M Button</Button></div>
      <div><h3>Primary M (Icon Left)</h3><Button variant="primary-m" iconLeft={heartIconPath}>Icon Heart</Button></div>
      <div><h3>Primary M (Icon Right)</h3><Button variant="primary-m" iconRight={SearchIcon}>Search</Button></div>
      <div><h3>Primary Medium</h3><Button variant="primary-medium">Primary Medium</Button></div>
      <div><h3>Primary Icon</h3><Button variant="primary-icon" iconLeft={SearchIcon} aria-label="Search Action" /></div>
      <div><h3>Faded Small (Icon)</h3><Button variant="faded-small" iconLeft={SearchIcon} aria-label="Search Faded" /></div>
      <div><h3>Text Button</h3><Button variant="text">Text Link Here</Button></div>
      <div><h3>Disabled Primary</h3><Button variant="primary-m" disabled>Disabled Button</Button></div>
      <div><h3>Disabled Faded</h3><Button variant="faded-small" iconLeft={SearchIcon} disabled aria-label="Disabled Faded" /></div>
      <div><h3>Link Styled as Button</h3><Button href="#" variant="primary-medium">Go Somewhere</Button></div>
    </div>
    
    <hr style="margin: var(--space-lg) 0;" />

    <h3>Secondary Buttons</h3>
    <div class="component-group">
      <div><h3>Secondary M</h3><Button variant="secondary-m">Secondary M Button</Button></div>
      <div><h3>Secondary M (Icon Left)</h3><Button variant="secondary-m" iconLeft={SearchIcon}>Icon Search</Button></div>
      <div><h3>Secondary Medium</h3><Button variant="secondary-medium">Secondary Medium</Button></div>
      <div><h3>Secondary M (Icon Right)</h3><Button variant="secondary-m" iconRight={SearchIcon}>Search Icon</Button></div>
      <div><h3>Disabled Secondary M</h3><Button variant="secondary-m" disabled>Disabled Secondary</Button></div>
    </div>
  </section>

  <section>
    <h2>Inputs</h2>
    <div class="component-group" style="max-width: 400px;">
      <Input label="Your Name" placeholder="e.g., Jane Doe" bind:value={inputValue} />
      <Input label="Search Catalog" type="search" placeholder="Find NFTs..." iconLeft={searchIconPath_demo} bind:value={searchInputValue}/>
      <Input label="Password" type="password" placeholder="Enter your password" />
      <Input label="Disabled Field" placeholder="Cannot edit" disabled value="Fixed content"/>
      <Input label="Readonly Field" readonly value="You can copy this, but not change it." iconRight={SearchIcon} />
    </div>
  </section>

  <section>
    <h2>Tabs</h2>
    <Tabs items={tabItems} bind:activeTabId={activeTab} let:activeItem>
      {#if activeItem}
        <div class="tab-content-example">
          <h3>{activeItem.label} Content</h3>
          <p>This is the dynamic content area for the tab with ID: <strong>{activeItem.id}</strong>.</p>
          <p>You can put any Svelte components or HTML structure here based on the active tab.</p>
        </div>
      {/if}
    </Tabs>
  </section>

  <section>
    <h2>Disclosure (Accordion)</h2>
    <div class="component-group" style="max-width: 600px;">
      <Disclosure title="Toggle Item 1 (Default Closed)">
        <p>This is the content for the first disclosure. It was initially closed. It can contain any markup or components, like this paragraph or even another button below.</p>
        <Button variant="primary-medium" size="sm">Action inside disclosure</Button>
      </Disclosure>
      <Disclosure title="Important Information (Initially Open)" initiallyOpen={true}>
        <p>This disclosure starts open to reveal crucial details. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </Disclosure>
      <Disclosure>
        <svelte:fragment slot="title">
          Custom <em>HTML</em> Title <Icon path={heartIconPath} size="1em" style="margin-left: 8px; color: var(--color-primary-accent);" />
        </svelte:fragment>
        <p>This disclosure uses a Svelte slot to render a custom title with HTML and an icon.</p>
      </Disclosure>
    </div>
  </section>

  <section>
    <h2>Dropdown</h2>
    <div class="component-group" style="max-width: 300px;">
      <Dropdown items={dropdownItems} bind:selectedId={selectedDropdownId} placeholder="Choose an item..." />
      <p style="margin-top: 1rem;">Selected ID: <strong>{selectedDropdownId || 'None'}</strong></p>
    </div>
  </section>

  <section>
    <h2>Modal</h2>
    <Button on:click={openModal} variant="primary-m">Open Sample Modal</Button>
    <Modal bind:isOpen={isModalOpen} on:close={closeModalHandler} title="Terms and Conditions">
      <p>This is the main content of the modal. You can put any Svelte components or HTML here. Please read the following terms carefully.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras mattis consectetur purus sit amet fermentum.</p>
      <Input label="Confirm by typing your name" placeholder="Your full name" style="margin-top: 1rem;" />
      <svelte:fragment slot="footer">
        <Button on:click={closeModalHandler} variant="text">Decline</Button>
        <Button on:click={closeModalHandler} variant="primary-m">Accept Terms</Button>
      </svelte:fragment>
    </Modal>
  </section>

  <section>
    <h2>NFT Card</h2>
    <div class="card-grid">
      {#if loadingNFTs}
        <div class="loading">Loading NFTs...</div>
      {:else if errorNFTs}
        <div class="error">Error: {errorNFTs}</div>
      {:else if animatedNFTs.length === 0}
        <div class="empty-state">No animated NFTs found</div>
      {:else}
        {#each animatedNFTs as nft}
          {@debug nft}
          <NFTCard
            pixels={nft.pixels || []}
            pixelSize={5}
            frameNum={0}
            title={nft.title || 'Untitled NFT'}
            creatorAvatarUrl={nft.creatorAvatarUrl}
            creatorName={nft.creatorName || 'Unknown Creator'}
            ownerName={nft.ownerName}
            currentBid={typeof nft.currentBid === 'string' ? parseFloat(nft.currentBid) : (nft.currentBid || 0)}
            currencySymbol="XIAN"
            timeLeft={nft.timeLeft || '00:00:00'}
            onBidClick={() => console.log('Buy clicked for', nft.title)}
            onSellClick={() => console.log('Sell clicked for', nft.title)}
            href={`/nft/${nft.id}`}
          />
        {/each}
      {/if}
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

  <section class="component-section">
    <h2 class="section-title">Live Animated NFTs</h2>
    <div class="nft-preview-card-grid">
      {#if loadingNFTs}
        <div class="loading">Loading NFTs...</div>
      {:else if errorNFTs}
        <div class="error">Error: {errorNFTs}</div>
      {:else if animatedNFTs.length === 0}
        <div class="empty-state">No animated NFTs found</div>
      {:else}
        {#each animatedNFTs as nft}
          {#if nft.pixels}
            {@debug nft}
            <NFTFrameCard
              pixels={nft.pixels}
              pixelSize={5}
              frameNum={0}
              title={nft.title || 'Untitled NFT'}
              collectionName={nft.collectionName || 'Pixel Collection'}
              creatorName={nft.creatorName || 'Unknown Creator'}
              currentBid={nft.currentBid || 0}
              currencySymbol="XIAN"
              timeLeft={nft.timeLeft || '00:00:00'}
              href={`/nft/${nft.id}`}
              onBidClick={() => console.log('Bid clicked for NFT:', nft.id)}
              onInfoClick={() => console.log('Info clicked for NFT:', nft.id)}
            />
          {/if}
        {/each}
      {/if}
    </div>
  </section>

</div>

<style>
  /* Same styles as before */
  .component-showcase {
    padding: var(--space-xl) var(--space-lg);
    max-width: 1100px;
    margin: 0 auto;
    font-family: var(--font-family-body);
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
    color: var(--color-text-primary);
  }
  section {
    margin-bottom: var(--space-xxl);
  }
  section h2 {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-semibold);
    color: var(--color-text-primary);
    margin-bottom: var(--space-lg);
    padding-bottom: var(--space-md);
    border-bottom: 1px solid var(--color-border-secondary);
  }
  .component-group {
    display: flex;
    flex-direction: column; /* Stack items vertically in a group */
    gap: var(--space-lg);
    padding: var(--space-md);
    border: 1px dashed var(--color-border-primary);
    border-radius: var(--space-xs);
    margin-bottom: var(--space-lg);
  }
  .component-group > div:not(.tab-content-example) {
    /* For direct children if they need individual boxing */
  }
  .component-group h3 {
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-secondary);
    margin-bottom: var(--space-sm);
  }

  .tab-content-example {
    padding: var(--space-md);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--space-xs);
    margin-top: var(--space-sm);
    background-color: var(--color-background-secondary);
  }
  .tab-content-example h3 {
    margin-top: 0;
    color: var(--color-text-primary);
  }

  /* Ensure page background and text color respect the theme */
  :global(body.theme-showcase-active) {
    background-color: var(--color-background-primary);
    color: var(--color-text-primary);
  }

  .card-grid {
    display: grid;
    grid-template-columns: 1fr; /* Default: 1 card per row for mobile */
    gap: var(--space-md);
    width: 100%;
  }

  /* Small tablets and up: 2 cards per row */
  @media (min-width: 500px) {
    .card-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* Larger tablets/desktops and up: 4 cards per row */
  @media (min-width: 900px) {
    .card-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .nft-preview-card-grid {
    display: grid;
    /* Adjust columns for smaller cards */
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); 
    gap: var(--space-md);
  }

  .icon-catalog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: var(--space-lg);
    padding: var(--space-md);
    border-radius: var(--space-xs);
  }
  .icon-catalog-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: var(--space-sm);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--space-xs);
    color: var(--color-text-primary); /* Ensure icon inherits a visible color */
  }
  .icon-name {
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
    word-break: break-all;
    margin-top: var(--space-sm);
  }
  /* Specific background for SVG showcase to ensure visibility */
  .svelte-icon-catalog {
     background-color: var(--color-background-secondary); 
  }

  .component-section {
    margin: 2rem 0;
  }
  .section-title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  .nft-frame-card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
  .loading, .error, .empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 2rem;
    background: var(--color-background-secondary);
    border-radius: 0.5rem;
  }
  .error {
    color: var(--color-error);
  }
</style> 