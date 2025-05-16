<script>
  export let name = ''; // Could be an identifier for a predefined SVG or a direct path data
  export let path = ''; // SVG path data (the 'd' attribute value)
  export let size = '1em'; // Default to current font size, can be any CSS unit (24px, 1.5rem, etc.)
  export let color = 'currentColor'; // Default to inherit text color
  export let viewBox = '0 0 24 24'; // Common default, make it a prop for flexibility

  // If we had a library of predefined icons referenced by 'name'
  // const iconRegistry = {
  //   'cart': 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
  //   'search': 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  //   // ... more icons
  // };
  // $: svgPath = path || iconRegistry[name] || '';

  $: svgPath = path || ''; // For now, we primarily use direct path data

</script>

{#if svgPath}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill={color}
    viewBox={viewBox}    
    class="icon {$$props.class || ''}"
    aria-hidden="true" 
    focusable="false" 
  >
    <path d={svgPath} />
  </svg>
{:else}
  <!-- Optional: Render a placeholder or warning if no path/name is provided -->
  <!-- <span style="color: red; font-size: 0.8em;">Icon not found</span> -->
{/if}

<style>
  .icon {
    display: inline-block;
    vertical-align: middle; /* Helps align with text if used inline */
    /* No fill or stroke here, should be controlled by props or parent CSS if not `currentColor` */
  }
</style> 