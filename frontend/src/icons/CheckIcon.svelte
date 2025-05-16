<script>
  export let size = '1em';
  export let color = 'currentColor';
  export let customClass = '';
  export let title = 'Check Icon';
</script>

<svg 
  width={size} 
  height={size} 
  viewBox="0 0 16 16" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg" 
  class="svelte-icon check-icon {customClass}"
  aria-label={title}
  role="img"
>
  <g fill-rule="evenodd">
    <path d="M0 0h16v16H0z" fill="none"/>
    <path 
      d="M6 10.78 3.687 8.467a.664.664 0 1 0-.94.94l2.786 2.786c.26.26.68.26.94 0l7.054-7.053a.664.664 0 1 0-.94-.94L6 10.78z" 
      fill={color}
      fill-rule="nonzero"
    />
  </g>
</svg>

<style>
  .svelte-icon {
    display: inline-block;
    vertical-align: middle;
  }
</style> 