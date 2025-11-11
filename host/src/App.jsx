import { useState, useEffect, Suspense, lazy } from 'react'
import './App.css'

// Lazy load mikrofrontendów
const ProductList = lazy(() => import('products/ProductList'))

function App() {
  const [cartLoaded, setCartLoaded] = useState(false)

  useEffect(() => {
    // Załaduj komponent koszyka (Svelte) i zamontuj go
    const loadCart = async () => {
      try {
        const cartModule = await import('cart/Cart')
        
        // Stwórz kontener dla komponentu Svelte
        const cartContainer = document.createElement('div')
        cartContainer.id = 'cart-container'
        document.body.appendChild(cartContainer)
        
        // Zamontuj komponent Svelte
        new cartModule.default({
          target: cartContainer,
        })
        
        setCartLoaded(true)
      } catch (err) {
        console.error('Failed to load cart:', err)
      }
    }

    loadCart()

    return () => {
      const cartContainer = document.getElementById('cart-container')
      if (cartContainer) {
        cartContainer.remove()
      }
    }
  }, [])

  return (
    <div className="app">
      <header>
        <h1>🛍️ Sklep - Host Application</h1>
        <p>Mikrofrontendy: Products (React) + Cart (Svelte)</p>
      </header>

      <main>
        <Suspense fallback={<div className="loading">Ładowanie produktów...</div>}>
          <ProductList />
        </Suspense>
      </main>

      {cartLoaded && (
        <div className="cart-status">
          ✅ Koszyk załadowany
        </div>
      )}
    </div>
  )
}

export default App