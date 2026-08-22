document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const seats = document.querySelectorAll('.seat-grid .seat');
  const cartButton = document.querySelector('.cart-btn');
  const cartCount = document.querySelector('.cart-count');
  const cartDrawer = document.querySelector('.cart-drawer');
  const cartBackdrop = document.querySelector('.cart-backdrop');
  const selectedSeats = document.querySelector('.selected-seats');
  const drawerTotal = document.querySelector('.drawer-total');
  const checkoutLink = document.querySelector('.checkout-link');

  navLinks.forEach(link => {
    const linkPath = new URL(link.href, window.location.href).pathname;
    const currentPath = window.location.pathname;
    const isCurrentPage = linkPath === currentPath || linkPath.endsWith(currentPath);

    link.classList.toggle('active', isCurrentPage);
    if (isCurrentPage) {
      link.setAttribute('aria-current', 'page');
    }

    link.addEventListener('click', () => {
      navLinks.forEach(navLink => {
        navLink.classList.remove('active');
        navLink.removeAttribute('aria-current');
      });
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    });
  });

  const updateCart = () => {
    const selected = document.querySelectorAll('.seat-grid .seat.selected');
    cartCount.textContent = selected.length;
    cartCount.hidden = selected.length === 0;
    drawerTotal.textContent = `${selected.length} ${selected.length === 1 ? 'seat' : 'seats'}`;
    checkoutLink.hidden = selected.length === 0;

    if (selected.length === 0) {
      selectedSeats.innerHTML = '<p class="empty-cart">No seats selected yet.</p>';
      return;
    }

    selectedSeats.innerHTML = Array.from(selected, seat => {
      const row = seat.closest('.row').querySelector('.row-label').textContent;
      const seatNumber = Array.from(seat.parentElement.querySelectorAll('.seat')).indexOf(seat) + 1;
      return `<span class="selected-seat">${row}${seatNumber}</span>`;
    }).join('');
  };

  const setDrawerState = isOpen => {
    document.body.classList.toggle('cart-open', isOpen);
    cartButton.setAttribute('aria-expanded', isOpen);
    cartDrawer.setAttribute('aria-hidden', !isOpen);
    cartBackdrop.setAttribute('aria-hidden', !isOpen);
  };

  seats.forEach(seat => {
    seat.addEventListener('click', () => {
      seat.classList.toggle('selected');
      updateCart();
      cartButton.classList.remove('bounce');
      void cartButton.offsetWidth;
      cartButton.classList.add('bounce');
    });
  });

  cartButton.addEventListener('click', () => {
    setDrawerState(!document.body.classList.contains('cart-open'));
  });

  cartBackdrop.addEventListener('click', () => setDrawerState(false));
  cartDrawer.addEventListener('click', event => event.stopPropagation());
});