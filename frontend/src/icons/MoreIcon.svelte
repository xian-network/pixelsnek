<script>
  export let size = '1em';
  export let color = 'currentColor';
  export let customClass = '';
  export let title = 'More Icon';
</script>

<svg 
  width={size} 
  height={size} 
  viewBox="0 0 24 24" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg" 
  class="svelte-icon more-icon {customClass}"
  aria-label={title}
  role="img"
>
  <g fill-rule="evenodd">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path 
      d="M6.137 14.102c.945 0 1.742-.797 1.742-1.735 0-.976-.758-1.734-1.742-1.734-.953 0-1.735.773-1.735 1.734a1.75 1.75 0 0 0 1.735 1.735zm5.86 0c.944 0 1.733-.797 1.733-1.735 0-.976-.757-1.734-1.734-1.734-.953 0-1.726.773-1.726 1.734 0 .938.773 1.735 1.726 1.735zm5.866 0c.938 0 1.735-.797 1.735-1.735 0-.976-.758-1.734-1.735-1.734-.96 0-1.742.773-1.742 1.734 0 .938.781 1.735 1.742 1.735z" 
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