<script>
  export let size = '1em';
  export let color = 'currentColor'; // Default to currentColor for easy styling via CSS
  export let customClass = ''; // Renamed to avoid conflict with Svelte's class directive
  export let title = 'Search Icon'; // For accessibility
</script>

<svg 
  width={size} 
  height={size} 
  viewBox="0 0 24 24"
  fill="none" 
  xmlns="http://www.w3.org/2000/svg" 
  class="svelte-icon search-icon {customClass}"
  aria-label={title}
  role="img"
>
  <g opacity=".6">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path 
      d="M18.195 19.836c.758 0 1.328-.594 1.328-1.344 0-.351-.117-.687-.382-.953l-3.188-3.195a6.158 6.158 0 0 0 1.031-3.43c0-3.437-2.812-6.258-6.25-6.258-3.437 0-6.257 2.813-6.257 6.258 0 3.438 2.82 6.258 6.257 6.258a6.18 6.18 0 0 0 3.274-.938l3.219 3.22c.257.257.609.382.968.382zm-7.46-4.57c-2.4 0-4.36-1.961-4.36-4.352 0-2.39 1.96-4.351 4.36-4.351 2.39 0 4.35 1.96 4.35 4.351 0 2.39-1.96 4.352-4.35 4.352z" 
      fill={color}
      fill-rule="nonzero"
    />
  </g>
</svg>

<style>
  .svelte-icon {
    display: inline-block;
    vertical-align: middle;
    /* Add any other base styles for all icons if needed */
  }
</style> 