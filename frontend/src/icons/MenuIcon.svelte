<script>
  export let size = '1em';
  export let color = 'currentColor';
  export let customClass = '';
  export let title = 'Menu Icon';
</script>

<svg 
  width={size} 
  height={size} 
  viewBox="0 0 24 24" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg" 
  class="svelte-icon menu-icon {customClass}"
  aria-label={title}
  role="img"
>
  <g fill-rule="evenodd">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path 
      d="M19.297 9.555a.817.817 0 0 0 .805-.82.807.807 0 0 0-.805-.82H4.703a.812.812 0 0 0-.805.82c0 .437.36.82.805.82h14.594zm0 3.633a.817.817 0 0 0 .805-.82.807.807 0 0 0-.805-.821H4.703a.812.812 0 0 0-.805.82c0 .438.36.82.805.82h14.594zm0 3.64c.445 0 .805-.383.805-.828a.807.807 0 0 0-.805-.82H4.703a.812.812 0 0 0-.805.82c0 .438.36.828.805.828h14.594z" 
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