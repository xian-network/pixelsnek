<script>
  export let size = '1em';
  export let color = 'currentColor';
  export let customClass = '';
  export let title = 'Credit Card Icon';
</script>

<svg 
  width={size} 
  height={size} 
  viewBox="0 0 24 24" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg" 
  class="svelte-icon credit-card-icon {customClass}"
  aria-label={title}
  role="img"
>
  <g fill-rule="evenodd">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path 
      d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm-1 14H5c-.55 0-1-.45-1-1v-6h16v6c0 .55-.45 1-1 1zm1-9H4V6h16v3z" 
      fill={color}
      fill-rule="nonzero" 
      opacity=".6"
    />
  </g>
</svg>

<style>
  .svelte-icon {
    display: inline-block;
    vertical-align: middle;
  }
</style> 