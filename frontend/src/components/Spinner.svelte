<script>
  // Size options: "sm", "md", "lg", "xl"
  export let size = "md";
  export let color = null;
  
  // Convert size to pixel values
  const sizeMap = {
    "sm": "16px",
    "md": "24px",
    "lg": "32px",
    "xl": "48px"
  };
  
  const spinnerSize = sizeMap[size] || sizeMap.md;
  
  // Set color (use custom or fallback to CSS variable)
  let spinnerColor = color || "var(--color-primary-accent)";
</script>

<div class="spinner" style="width: {spinnerSize}; height: {spinnerSize}; border-color: {spinnerColor} transparent transparent transparent;">
</div>

<style>
  .spinner {
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border-style: solid;
    border-width: 2px;
    animation: spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: var(--color-primary-accent) transparent transparent transparent;
  }
  
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style> 