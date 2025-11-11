<script>
  import { writable } from 'svelte/store'

  // Store dla koszyka - może być eksportowany do użycia przez inne komponenty
  export const cartStore = writable([])

  let cartItems = $state([])
  let isOpen = $state(false)

  // Nasłuchuj zmian w store
  cartStore.subscribe(value => {
    cartItems = value
  })

  // Funkcja dodawania produktu do koszyka (będzie eksportowana dla Module Federation)
  export function addToCart(product) {
    const existingItem = cartItems.find(item => item.id === product.id)
    
    if (existingItem) {
      cartStore.update(items => 
        items.map(item => 
          item.id === product.id 
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        )
      )
    } else {
      cartStore.update(items => [...items, { ...product, cartQuantity: 1 }])
    }
  }

  function removeFromCart(productId) {
    cartStore.update(items => items.filter(item => item.id !== productId))
  }

  function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    cartStore.update(items =>
      items.map(item =>
        item.id === productId
          ? { ...item, cartQuantity: newQuantity }
          : item
      )
    )
  }

  function clearCart() {
    cartStore.set([])
  }

  function toggleCart() {
    isOpen = !isOpen
  }

  // Obliczenia z użyciem $derived (Svelte 5 runes)
  let totalItems = $derived(cartItems.reduce((sum, item) => sum + item.cartQuantity, 0))
  let totalPrice = $derived(cartItems.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0))
</script>

<div class="cart-widget">
  <!-- Przycisk koszyka -->
  <button class="cart-button" onclick={toggleCart}>
    🛒 Koszyk ({totalItems})
    {#if totalItems > 0}
      <span class="badge">{totalItems}</span>
    {/if}
  </button>

  <!-- Panel koszyka -->
  {#if isOpen}
    <div class="cart-panel">
      <div class="cart-header">
        <h2>Twój koszyk</h2>
        <button class="close-button" onclick={toggleCart}>✕</button>
      </div>

      <div class="cart-content">
        {#if cartItems.length === 0}
          <div class="empty-cart">
            <p>Koszyk jest pusty</p>
            <span class="empty-icon">🛒</span>
          </div>
        {:else}
          <div class="cart-items">
            {#each cartItems as item (item.id)}
              <div class="cart-item">
                <div class="item-info">
                  <h4>{item.name}</h4>
                  <p class="item-price">{item.price.toFixed(2)} PLN</p>
                </div>
                
                <div class="item-controls">
                  <div class="quantity-controls">
                    <button 
                      class="qty-btn"
                      onclick={() => updateQuantity(item.id, item.cartQuantity - 1)}
                    >
                      −
                    </button>
                    <span class="quantity">{item.cartQuantity}</span>
                    <button 
                      class="qty-btn"
                      onclick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                      disabled={item.cartQuantity >= item.quantity}
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    class="remove-btn"
                    onclick={() => removeFromCart(item.id)}
                  >
                    🗑️
                  </button>
                </div>
                
                <div class="item-total">
                  Razem: {(item.price * item.cartQuantity).toFixed(2)} PLN
                </div>
              </div>
            {/each}
          </div>

          <div class="cart-footer">
            <div class="cart-summary">
              <div class="summary-row">
                <span>Produkty ({totalItems}):</span>
                <span class="total-price">{totalPrice.toFixed(2)} PLN</span>
              </div>
              <div class="summary-row total">
                <span>Suma:</span>
                <span class="total-price">{totalPrice.toFixed(2)} PLN</span>
              </div>
            </div>
            
            <div class="cart-actions">
              <button class="clear-btn" onclick={clearCart}>
                Wyczyść koszyk
              </button>
              <button class="checkout-btn">
                Przejdź do kasy
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>
    
    <!-- Overlay -->
    <div class="overlay" onclick={toggleCart}></div>
  {/if}
</div>

<style>
  .cart-widget {
    position: relative;
  }

  .cart-button {
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #646cff;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s;
    z-index: 1000;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .cart-button:hover {
    background-color: #535bf2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(100, 108, 255, 0.4);
  }

  .badge {
    background-color: #ff3e00;
    color: white;
    border-radius: 50%;
    padding: 0.2rem 0.5rem;
    font-size: 0.75rem;
    font-weight: bold;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1001;
    animation: fadeIn 0.3s;
  }

  .cart-panel {
    position: fixed;
    top: 0;
    right: 0;
    width: 450px;
    max-width: 90vw;
    height: 100vh;
    background-color: #1a1a1a;
    box-shadow: -4px 0 12px rgba(0, 0, 0, 0.3);
    z-index: 1002;
    display: flex;
    flex-direction: column;
    animation: slideIn 0.3s;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #333;
  }

  .cart-header h2 {
    margin: 0;
    color: #646cff;
    font-size: 1.5rem;
  }

  .close-button {
    background: none;
    border: none;
    color: #888;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    width: auto;
    transition: color 0.3s;
  }

  .close-button:hover {
    color: #fff;
  }

  .cart-content {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    color: #888;
    padding: 2rem;
  }

  .empty-icon {
    font-size: 4rem;
    opacity: 0.3;
    margin-top: 1rem;
  }

  .cart-items {
    flex: 1;
    padding: 1rem;
  }

  .cart-item {
    background-color: #242424;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid #333;
  }

  .item-info h4 {
    margin: 0 0 0.5rem 0;
    color: #fff;
    font-size: 1rem;
  }

  .item-price {
    color: #646cff;
    font-weight: bold;
    margin: 0;
  }

  .item-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }

  .quantity-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .qty-btn {
    background-color: #333;
    border: 1px solid #444;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
    padding: 0;
  }

  .qty-btn:hover:not(:disabled) {
    background-color: #444;
    border-color: #646cff;
  }

  .qty-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .quantity {
    min-width: 30px;
    text-align: center;
    font-weight: bold;
  }

  .remove-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    padding: 0.5rem;
    transition: transform 0.2s;
    width: auto;
  }

  .remove-btn:hover {
    transform: scale(1.2);
  }

  .item-total {
    text-align: right;
    margin-top: 0.5rem;
    color: #888;
    font-size: 0.9rem;
  }

  .cart-footer {
    border-top: 1px solid #333;
    padding: 1.5rem;
    background-color: #1a1a1a;
  }

  .cart-summary {
    margin-bottom: 1rem;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    color: #888;
  }

  .summary-row.total {
    font-size: 1.2rem;
    font-weight: bold;
    color: #fff;
    padding-top: 0.5rem;
    border-top: 1px solid #333;
  }

  .total-price {
    color: #646cff;
  }

  .cart-actions {
    display: flex;
    gap: 0.5rem;
  }

  .clear-btn,
  .checkout-btn {
    flex: 1;
    padding: 0.8rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    border: none;
  }

  .clear-btn {
    background-color: #333;
    color: white;
  }

  .clear-btn:hover {
    background-color: #444;
  }

  .checkout-btn {
    background-color: #646cff;
    color: white;
  }

  .checkout-btn:hover {
    background-color: #535bf2;
  }

  @media (prefers-color-scheme: light) {
    .cart-panel {
      background-color: #ffffff;
    }

    .cart-header {
      border-bottom-color: #e0e0e0;
    }

    .cart-header h2 {
      color: #646cff;
    }

    .close-button {
      color: #666;
    }

    .close-button:hover {
      color: #000;
    }

    .cart-item {
      background-color: #f9f9f9;
      border-color: #e0e0e0;
    }

    .item-info h4 {
      color: #213547;
    }

    .qty-btn {
      background-color: #f0f0f0;
      border-color: #ddd;
      color: #213547;
    }

    .qty-btn:hover:not(:disabled) {
      background-color: #e0e0e0;
    }

    .cart-footer {
      background-color: #ffffff;
      border-top-color: #e0e0e0;
    }

    .summary-row.total {
      color: #213547;
      border-top-color: #e0e0e0;
    }

    .clear-btn {
      background-color: #e0e0e0;
      color: #213547;
    }

    .clear-btn:hover {
      background-color: #d0d0d0;
    }
  }
</style>