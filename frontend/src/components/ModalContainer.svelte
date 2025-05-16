<script>
  import { showModal } from '../js/stores.js';
  import Modal from './Modal.svelte';

  // Default is to render Modal with the content generated from the component in modalData
  $: modalComponent = $showModal?.modalData?.modal;
  $: modalIsOpen = $showModal?.show || false;

  function closeModal() {
    showModal.set({show: false, modalData: {}});
  }
</script>

{#if modalIsOpen && modalComponent}
  <Modal isOpen={modalIsOpen} on:close={closeModal} showCloseButton={true}>
    <svelte:component this={modalComponent} />
  </Modal>
{/if} 