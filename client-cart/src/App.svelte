<script>
  import Cart from './lib/Cart.svelte'
</script>

<main>
  <h1>Aplikacja Koszyk</h1>
  <p class="info">
    Koszyk jest gotowy do integracji z mikrofrontendem produktów
  </p>
  <Cart />
</main>

<style>
  main {
    text-align: center;
    padding: 2rem;
  }

  h1 {
    color: #646cff;
    margin-bottom: 1rem;
  }

  .info {
    color: #888;
    font-size: 0.9rem;
  }
</style>