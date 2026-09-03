(() => {
  const STORAGE_KEY = 'luma-cart';
  const readCart = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return { snacks: Array.isArray(saved?.snacks) ? saved.snacks : [], seats: Array.isArray(saved?.seats) ? saved.seats : [] };
    } catch {
      return { snacks: [], seats: [] };
    }
  };

  const drawerMarkup = `
    <div class="cart-backdrop" aria-hidden="true"></div>
    <aside class="cart-drawer" aria-hidden="true" aria-labelledby="cart-title">
      <div class="cart-drawer-header"><div><p class="drawer-eyebrow">YOUR SELECTION</p><h2 id="cart-title">Your cart</h2></div><span class="drawer-total">0 items</span></div>
      <div class="shared-cart-items" aria-live="polite"></div>
      <a class="checkout-link" href="${window.location.pathname.includes('/pages/') ? 'payment.html' : 'pages/payment.html'}" hidden>Check out</a>
    </aside>`;

  const render = () => {
    const cart = readCart();
    const itemCount = cart.snacks.reduce((sum, item) => sum + item.quantity, 0) + cart.seats.length;
    const count = document.querySelector('.cart-count');
    const total = document.querySelector('.drawer-total');
    const items = document.querySelector('.shared-cart-items');
    const checkout = document.querySelector('.checkout-link');
    if (!count || !total || !items) return;

    count.textContent = itemCount;
    count.hidden = itemCount === 0;
    total.textContent = `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;
    checkout.hidden = itemCount === 0;
    items.innerHTML = itemCount === 0 ? '<p class="empty-cart">Your cart is empty.</p>' : [
      ...cart.seats.map(seat => `<div class="cart-line cart-seat-line"><button class="selected-seat" type="button" data-cart-action="remove-seat" data-seat-label="${seat.label}" aria-label="Remove seat ${seat.label}">${seat.label}</button></div>`),
      ...cart.snacks.map(item => `<div class="cart-line cart-snack-line"><div><strong>${item.name}</strong><span>${item.price * item.quantity} EGP</span></div><div class="cart-item-actions"><button type="button" data-cart-action="decrease-snack" data-snack-id="${item.id}" aria-label="Decrease ${item.name}">-</button><span>${item.quantity}</span><button type="button" data-cart-action="increase-snack" data-snack-id="${item.id}" aria-label="Increase ${item.name}">+</button><button class="cart-delete" type="button" data-cart-action="delete-snack" data-snack-id="${item.id}" aria-label="Remove ${item.name}">&#215;</button></div></div>`)
    ].join('');
  };

  const save = cart => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('luma-cart-updated'));
  };

  const vibrate = () => {
    const button = document.querySelector('.cart-btn');
    if (!button) return;
    button.classList.remove('vibrate');
    void button.offsetWidth;
    button.classList.add('vibrate');
  };

  window.LumaCart = { read: readCart, save, render, vibrate };

  document.addEventListener('DOMContentLoaded', () => {
    const navRight = document.querySelector('.nav-right');
    if (navRight && !navRight.querySelector('.cart-btn')) {
      navRight.insertAdjacentHTML('beforeend', `<button class="cart-btn" type="button" aria-label="Open cart" aria-expanded="false">
        <svg class="cart-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="20" r="1"></circle><circle cx="19" cy="20" r="1"></circle><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6"></path></svg>
        <svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg>
        <span class="cart-count" aria-live="polite" hidden>0</span>
      </button>`);
    }
    const cartButton = navRight?.querySelector('.cart-btn');
    const profileButton = navRight?.querySelector('.profile-btn');
    if (cartButton && profileButton) profileButton.insertAdjacentElement('afterend', cartButton);
    document.querySelector('.cart-drawer')?.remove();
    document.querySelector('.cart-backdrop')?.remove();
    document.body.insertAdjacentHTML('beforeend', drawerMarkup);
    const button = document.querySelector('.cart-btn');
    const drawer = document.querySelector('.cart-drawer');
    const backdrop = document.querySelector('.cart-backdrop');
    const setOpen = open => {
      document.body.classList.toggle('cart-open', open);
      button.setAttribute('aria-expanded', open);
      drawer.setAttribute('aria-hidden', !open);
      backdrop.setAttribute('aria-hidden', !open);
    };
    button?.addEventListener('click', () => setOpen(!document.body.classList.contains('cart-open')));
    backdrop?.addEventListener('click', () => setOpen(false));
    drawer?.addEventListener('click', event => {
      event.stopPropagation();
      const control = event.target.closest('[data-cart-action]');
      if (!control) return;
      const cart = readCart();
      const snack = cart.snacks.find(item => item.id === control.dataset.snackId);
      if (control.dataset.cartAction === 'remove-seat') {
        cart.seats = cart.seats.filter(seat => seat.label !== control.dataset.seatLabel);
        document.querySelectorAll('.seat-grid .seat').forEach(seat => {
          const row = seat.closest('.row')?.querySelector('.row-label')?.textContent;
          const number = Array.from(seat.parentElement?.querySelectorAll('.seat') || []).indexOf(seat) + 1;
          if (`${row}${number}` === control.dataset.seatLabel) seat.classList.remove('selected');
        });
      } else if (snack) {
        if (control.dataset.cartAction === 'delete-snack') snack.quantity = 0;
        else {
          const increasing = control.dataset.cartAction === 'increase-snack';
          snack.quantity += increasing ? 1 : -1;
          if (increasing) vibrate();
        }
        cart.snacks = cart.snacks.filter(item => item.quantity > 0);
      }
      save(cart);
    });
    window.addEventListener('luma-cart-updated', render);
    render();
  });
})();
