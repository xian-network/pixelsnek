<script>
  import '../lib/styles/theme.css';
  import { theme, toggleTheme } from '$lib/stores/theme.js'; // For potential direct use in layout if needed
</script>

<div style="padding: 1rem; background-color: var(--color-background-tertiary); text-align: center;">
  <a href="/components-showcase" style="color: var(--color-text-link); font-weight: bold; text-decoration: underline;">
    --&gt; Navigate to Component Showcase &lt;--
  </a>
</div>

<slot />

<style>
  /* You can add layout-specific global styles here if necessary */
</style> 