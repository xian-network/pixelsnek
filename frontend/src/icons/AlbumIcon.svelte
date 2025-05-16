<script>
  export let size = '1em';
  export let color = 'currentColor';
  export let customClass = '';
  export let title = 'Album Icon';
</script>

<svg 
  width={size} 
  height={size} 
  viewBox="0 0 24 24" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg" 
  class="svelte-icon album-icon {customClass}"
  aria-label={title}
  role="img"
>
  <g fill-rule="evenodd">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path 
      d="M17.164 4.258c-.062-.727-.508-1.133-1.289-1.133H8.148c-.789 0-1.234.406-1.289 1.133h10.305zm1.54 2.367c-.11-.773-.517-1.234-1.4-1.234H6.712c-.883 0-1.29.46-1.39 1.234h13.382zm-.837 14.945c1.735 0 2.664-.922 2.664-2.648V10.57c0-1.718-.93-2.64-2.664-2.64H6.133c-1.735 0-2.664.922-2.664 2.64v8.352c0 1.726.93 2.648 2.664 2.648h11.734zm-.164-1.789H6.297c-.68 0-1.04-.343-1.04-1.054v-7.961c0-.711.36-1.047 1.04-1.047h11.406c.672 0 1.04.336 1.04 1.047v7.96c0 .712-.368 1.055-1.04 1.055z" 
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