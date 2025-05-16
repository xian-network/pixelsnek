<script>
  export let size = '1em';
  export let color = 'currentColor';
  export let customClass = '';
  export let title = 'Chevron Up Icon'; // Expand More looks like Chevron Up
</script>

<svg 
  width={size} 
  height={size} 
  viewBox="0 0 20 20" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg" 
  class="svelte-icon chevron-up-icon {customClass}"
  aria-label={title}
  role="img"
>
  <g fill-rule="evenodd">
    <path opacity=".87" d="M20 0v20H0V0z" fill="none"/>
    <path 
      d="M7.742 6.767 10.975 10l-3.233 3.233a.83.83 0 1 0 1.175 1.175l3.825-3.825a.83.83 0 0 0 0-1.175L8.917 5.583a.83.83 0 0 0-1.175 0 .848.848 0 0 0 0 1.184z" 
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