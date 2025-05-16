<script>
  export let size = '1em';
  export let color = 'currentColor';
  export let customClass = '';
  export let title = 'Arrow Left Icon'; // Name implies forward, but glyph is backward
</script>

<svg 
  width={size} 
  height={size} 
  viewBox="0 0 24 24" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg" 
  class="svelte-icon round-arrow-left-icon {customClass}"
  aria-label={title}
  role="img"
>
  <g fill-rule="evenodd" opacity=".4">
    <path d="M24 0H0v24h24z" fill="none"/>
    <path 
      d="M19 13H7.83l4.88 4.88c.39.39.39 1.03 0 1.42a.996.996 0 0 1-1.41 0l-6.59-6.59a.996.996 0 0 1 0-1.41l6.58-6.6a.996.996 0 1 1 1.41 1.41L7.83 11H19c.55 0 1 .45 1 1s-.45 1-1 1z" 
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