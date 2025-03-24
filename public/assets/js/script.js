document.addEventListener('DOMContentLoaded', () => {
  loadComponents();
  initializeCart();
  setupFormHandlers();
});

// ▼▼▼ Consolidated Functions ▼▼▼
const loadComponents = () => {
  // Load navbar and footer
  ['navbar', 'footer'].forEach(component => {
      fetch(`/components/${component}.html`)
          .then(res => res.text())
          .then(html => {
              document.getElementById(`${component}-placeholder`).innerHTML = html;
              // Gérer l'affichage des liens Login/Logout après le chargement de la navbar
              if (component === 'navbar') {
                  const token = localStorage.getItem('token');
                  const loginLink = document.querySelector('a[href="login.html"]');
                  const logoutBtn = document.querySelector('button[onclick="logout()"]');
                  if (token) {
                      // Utilisateur connecté : masquer "Login", afficher "Logout"
                      if (loginLink) loginLink.style.display = 'none';
                      if (logoutBtn) logoutBtn.style.display = 'block';
                  } else {
                      // Utilisateur non connecté : afficher "Login", masquer "Logout"
                      if (loginLink) loginLink.style.display = 'block';
                      if (logoutBtn) logoutBtn.style.display = 'none';
                  }
              }
          });
  });
};

const initializeCart = () => {
  const token = localStorage.getItem('token'); // Récupérer le token
  if (!token) {
      console.error('Aucun token trouvé. L\'utilisateur est peut-être déconnecté.');
      return;
  }

  fetch('/api/cart', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
  })
  .then(res => {
      if (!res.ok) {
          throw new Error('Unauthorized');
      }
      return res.json();
  })
  .then(cart => {
      updateCartCounter(cart?.items?.length || 0);
  })
  .catch(err => {
      console.error('Erreur lors du chargement du panier :', err);
  });
};

// ▼▼▼ Unified Cart Functions ▼▼▼
const updateCartCounter = (count) => {
  const cartCounter = document.getElementById('cart-counter');
  if (cartCounter) cartCounter.textContent = count;
};

const addToCart = async (productId) => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token
    console.log('Token utilisé pour addToCart :', token); // Log pour déboguer
    if (!token) {
      showError('Veuillez vous connecter pour ajouter des articles au panier');
      return;
    }

    const headers = { 'Content-Type': 'application/json' };
    headers['Authorization'] = `Bearer ${token}`; // Ajouter le token dans les headers

    const res = await fetch('/api/cart/add', {
      method: 'POST',
      headers,
      body: JSON.stringify({ productId, quantity: 1 }),
      credentials: 'include'
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to add item');
    }
    
    const updatedCart = await res.json();
    updateCartCounter(updatedCart.items.length);
  } catch (err) {
    console.error('Erreur lors de l’ajout au panier :', err.message);
    showError('Failed to add item to cart: ' + err.message);
  }
};

// ▼▼▼ Cart Display Functions ▼▼▼
const fetchCart = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            showError('Please log in to view your cart');
            return;
        }

        const response = await fetch('/api/cart', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch cart');
        }

        const cart = await response.json();
        renderCart(cart);
    } catch (err) {
        console.error('Error fetching cart:', err);
        showError('Failed to load cart: ' + err.message);
    }
};

const renderCart = (cart) => {
    const cartItems = document.getElementById('cart-items');
    let total = 0;

    if (!cart.items || cart.items.length === 0) {
        cartItems.innerHTML = '<p class="text-center">Your cart is empty.</p>';
        return;
    }

    cartItems.innerHTML = cart.items.map(item => `
        <div class="col-md-12 mb-3">
            <div class="card">
                <div class="card-body d-flex align-items-center">
                    <img src="/assets/images/${item.product.image}" alt="${item.product.name}" class="product-img" style="width: 100px; height: 100px; object-fit: cover;">
                    <div class="ms-3 flex-grow-1">
                        <h5 class="card-title">${item.product.name}</h5>
                        <p class="card-text">Price: $${item.product.price.toFixed(2)}</p>
                        <p class="card-text">Quantity: 
                            <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.product._id}', ${item.quantity - 1})">-</button>
                            ${item.quantity}
                            <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity('${item.product._id}', ${item.quantity + 1})">+</button>
                        </p>
                        <p class="card-text">Total: $${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.product._id}')">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    document.getElementById('cart-total').textContent = total.toFixed(2);
};

// Fonction pour mettre à jour la quantité
const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/cart/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId, quantity: newQuantity }),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update quantity');
        }

        fetchCart(); // Rafraîchir le panier après mise à jour
    } catch (err) {
        console.error('Error updating quantity:', err);
        showError('Failed to update quantity: ' + err.message);
    }
};

// Fonction pour supprimer un article du panier
const removeFromCart = async (productId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/cart/remove', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId }),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to remove item');
        }

        fetchCart(); // Rafraîchir le panier après suppression
    } catch (err) {
        console.error('Error removing item:', err);
        showError('Failed to remove item: ' + err.message);
    }
};

// ▼▼▼ Logout Function ▼▼▼
const logout = async () => {
    try {
        // Optionnel : Appeler une route de déconnexion côté serveur
        const token = localStorage.getItem('token');
        if (token) {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to logout');
            }
        }

        // Supprimer le token côté client
        localStorage.removeItem('token');
        updateCartCounter(0); // Réinitialiser le compteur du panier
        window.location.href = '/login.html'; // Rediriger vers la page de connexion
    } catch (err) {
        console.error('Erreur lors de la déconnexion :', err);
        showError('Failed to logout: ' + err.message);
    }
};
window.logout = logout; // Rendre la fonction accessible globalement

// ▼▼▼ Checkout Functions ▼▼▼
const placeOrder = async (e) => {
    e.preventDefault();
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            showError('Please log in to place an order');
            return;
        }

        // Récupérer les informations de livraison
        const fullName = document.getElementById('fullName').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const zipCode = document.getElementById('zipCode').value;

        // Récupérer le panier
        const cartResponse = await fetch('/api/cart', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        if (!cartResponse.ok) {
            throw new Error('Failed to fetch cart');
        }

        const cart = await cartResponse.json();
        if (!cart.items || cart.items.length === 0) {
            showError('Your cart is empty');
            return;
        }

        // Envoyer la commande
        const orderResponse = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                items: cart.items,
                shippingInfo: { fullName, address, city, zipCode },
                total: cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
            }),
            credentials: 'include'
        });

        if (!orderResponse.ok) {
            const errorData = await orderResponse.json();
            throw new Error(errorData.message || 'Failed to place order');
        }

        // Vider le panier après la commande
        await fetch('/api/cart/clear', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        updateCartCounter(0);
        window.location.href = '/order-confirmation.html'; // Rediriger vers une page de confirmation
    } catch (err) {
        console.error('Error placing order:', err);
        showError('Failed to place order: ' + err.message);
    }
};

// ▼▼▼ Dashboard Functions ▼▼▼
const fetchOrders = async () => {
  try {
      const token = localStorage.getItem('token');
      if (!token) {
          showError('Please log in to view your orders');
          return;
      }

      const response = await fetch('/api/orders', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch orders');
      }

      const orders = await response.json();
      renderOrders(orders);
  } catch (err) {
      console.error('Error fetching orders:', err);
      showError('Failed to load orders: ' + err.message);
  }
};

const renderOrders = (orders) => {
  const orderHistory = document.getElementById('order-history');
  if (!orders || orders.length === 0) {
      orderHistory.innerHTML = '<p class="text-center">You have no orders yet.</p>';
      return;
  }

  orderHistory.innerHTML = orders.map(order => `
      <div class="col-md-12 mb-4">
          <div class="card">
              <div class="card-header">
                  <h5 class="mb-0">Order placed on ${new Date(order.createdAt).toLocaleDateString()}</h5>
                  <p class="mb-0">Status: <span class="badge bg-${order.status === 'pending' ? 'warning' : order.status === 'shipped' ? 'info' : 'success'}">${order.status}</span></p>
              </div>
              <div class="card-body">
                  <h6>Items:</h6>
                  <ul class="list-group mb-3">
                      ${order.items.map(item => `
                          <li class="list-group-item d-flex justify-content-between align-items-center">
                              <div>
                                  <strong>${item.product.name}</strong> (x${item.quantity})
                              </div>
                              <span>$${(item.product.price * item.quantity).toFixed(2)}</span>
                          </li>
                      `).join('')}
                  </ul>
                  <h6>Shipping Information:</h6>
                  <p class="mb-1"><strong>Name:</strong> ${order.shippingInfo.fullName}</p>
                  <p class="mb-1"><strong>Address:</strong> ${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.zipCode}</p>
                  <h6 class="mt-3">Total: $${order.total.toFixed(2)}</h6>
              </div>
          </div>
      </div>
  `).join('');
};
// ▼▼▼ Enhanced Auth Handlers ▼▼▼
const setupFormHandlers = () => {
  // Registration
  document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = getFormData(e.target);
    if (!validatePassword(formData)) return;

    try {
        await handleAuthRequest('/api/auth/register', formData);
        window.location.href = '/login.html';
    } catch (err) {
        showError(err.message);
    }
  });

  // Login
  document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const result = await handleAuthRequest('/api/auth/login', getFormData(e.target));
        localStorage.setItem('token', result.token);
        console.log('Token stocké après login :', result.token); // Log pour déboguer
        window.location.href = '/shop.html';
    } catch (err) {
        showError(err.message);
    }
  });

  // Password Reset
  document.getElementById('resetPasswordForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = getFormData(e.target);
    if (!validatePassword(formData)) return;

    try {
        await handleAuthRequest('/api/auth/reset-password', formData, true);
        window.location.href = '/login.html';
    } catch (err) {
        showError(err.message);
    }
  });
};

// ▼▼▼ Helper Functions ▼▼▼
const getFormData = (form) => ({
  email: form.querySelector('#email').value,
  password: form.querySelector('#password').value,
  newPassword: form.querySelector('#newPassword')?.value
});

const validatePassword = (data) => {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  if (!passwordRegex.test(data.password || data.newPassword)) {
      showError('Password must contain uppercase, lowercase, and numbers');
      return false;
  }
  return true;
};

// Mise à jour de la gestion de la requête d'authentification
const handleAuthRequest = async (endpoint, data, needsAuth = false) => {
  const headers = { 'Content-Type': 'application/json' };
  if (needsAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
      const res = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(data),
          credentials: 'include'
      });

      const text = await res.text();
      console.log("Server response:", text);

      try {
          const json = JSON.parse(text);
          if (!res.ok) throw new Error(json.message || 'Request failed');
          return json;
      } catch (error) {
          throw new Error(`Invalid JSON Response: ${text}`);
      }
  } catch (err) {
      console.error("Error in handleAuthRequest:", err.message);
      throw new Error(err.message);
  }
};

// ▼▼▼ Product Rendering ▼▼▼
const renderProducts = (products) => {
  const productGrid = document.getElementById('product-grid');
  productGrid.innerHTML = products.map(product => `
      <div class="col-lg-4 col-md-6 mb-4">
          <div class="card h-100">
              <img src="/assets/images/${product.image}" 
                   class="product-img" 
                   alt="${product.name}">
              <div class="card-body">
                  <h5 class="card-title">${product.name}</h5>
                  <p class="card-text">${product.description}</p>
                  <p class="product-price">$${product.price.toFixed(2)}</p>
                  <button class="btn btn-add-to-cart" 
                          onclick="addToCart('${product._id}')">
                      Add to Cart <i class="fas fa-shopping-cart"></i>
                  </button>
              </div>
          </div>
      </div>
  `).join('');
};

// Ajout de fetchProducts
const fetchProducts = async () => {
  try {
    const token = localStorage.getItem('token'); // Récupérer le token
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`; // Ajouter le token si présent
    }

    const response = await fetch('/api/products', {
      method: 'GET',
      headers,
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const products = await response.json();
    renderProducts(products);
  } catch (err) {
    console.error('Erreur lors de la récupération des produits :', err);
    showError('Failed to load products');
  }
};

// ▼▼▼ Error Handling ▼▼▼
const showError = (message) => {
  const errorElement = document.getElementById('error-message') || createErrorElement();
  errorElement.textContent = message;
  setTimeout(() => errorElement.remove(), 5000);
};

const createErrorElement = () => {
  const div = document.createElement('div');
  div.id = 'error-message';
  div.className = 'alert alert-danger position-fixed bottom-0 end-0 m-3';
  document.body.appendChild(div);
  return div;
};

// Initialize product loading
if (window.location.pathname.endsWith('shop.html')) {
  fetchProducts();
}

// Initialize cart loading
if (window.location.pathname.endsWith('cart.html')) {
  fetchCart();
}

// Initialize checkout page
if (window.location.pathname.endsWith('checkout.html')) {
  fetchCart(); // Charger le panier
  document.getElementById('checkoutForm')?.addEventListener('submit', placeOrder);
}
// Initialize dashboard page
if (window.location.pathname.endsWith('dashboard.html')) {
  fetchOrders(); // Charger les commandes
}