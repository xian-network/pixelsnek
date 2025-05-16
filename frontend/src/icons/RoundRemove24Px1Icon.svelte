<script>
  export let size = '1em';
  export let color = 'currentColor';
  export let customClass = '';
  export let title = 'Remove Icon';
</script>

<svg 
  width={size} 
  height={size} 
  viewBox="0 0 24 24" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg" 
  class="svelte-icon round-remove-icon {customClass}"
  aria-label={title}
  role="img"
>
  <g fill-rule="evenodd">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path 
      d="M18 13H6c-.55 0-1-.45-1-1s.45-1 1-1h12c.55 0 1 .45 1 1s-.45 1-1 1z" 
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