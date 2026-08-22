document.addEventListener('DOMContentLoaded', () => {
	const MAX_AMOUNT = 100;
	const snacks = [
		{ id: 'double-feature', name: 'Double Feature Combo', type: 'combos', price: 185, image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=800&q=85' },
		{ id: 'movie-night', name: 'Movie Night Combo', type: 'combos', price: 240, image: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?auto=format&fit=crop&w=800&q=85' },
		{ id: 'classic-popcorn', name: 'Classic Salted Popcorn', type: 'popcorn', price: 95, image: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?auto=format&fit=crop&w=800&q=85' },
		{ id: 'caramel-popcorn', name: 'Caramel Popcorn', type: 'popcorn', price: 120, image: 'https://images.unsplash.com/photo-1624427314476-7b1f2b2c2f11?auto=format&fit=crop&w=800&q=85' },
		{ id: 'cheese-nachos', name: 'Cheese Nachos', type: 'nachos', price: 135, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=85' },
		{ id: 'spicy-nachos', name: 'Spicy Jalapeno Nachos', type: 'nachos', price: 155, image: 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?auto=format&fit=crop&w=800&q=85' },
		{ id: 'cola', name: 'Cola', type: 'beverages', price: 55, image: 'https://images.unsplash.com/photo-1629203849820-fdd70d49c38e?auto=format&fit=crop&w=800&q=85' },
		{ id: 'lemonade', name: 'Fresh Lemonade', type: 'beverages', price: 75, image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=800&q=85' },
		{ id: 'chocolate', name: 'Dark Chocolate', type: 'candy', price: 70, image: 'https://images.unsplash.com/photo-1548907040-4d42cfcaa6b2?auto=format&fit=crop&w=800&q=85' },
		{ id: 'gummies', name: 'Cinema Gummies', type: 'candy', price: 65, image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=800&q=85' }
	];
	const cart = new Map();
	const grid = document.querySelector('#snack-grid');
	const cartItems = document.querySelector('#snack-cart-items');
	const cartButton = document.querySelector('.cart-btn');
	const cartCount = document.querySelector('.cart-count');
	const drawer = document.querySelector('.cart-drawer');
	const backdrop = document.querySelector('.cart-backdrop');
	const total = document.querySelector('.drawer-total');
	const quantityTotal = () => [...cart.values()].reduce((sum, item) => sum + item.quantity, 0);
	const showLimitMessage = () => window.alert('MAX AMOUNT REACHED');
	const changeQuantity = (snack, delta) => {
		const current = cart.get(snack.id)?.quantity || 0;
		if (delta > 0 && quantityTotal() >= MAX_AMOUNT) return showLimitMessage();
		const next = Math.max(0, current + delta);
		if (next === 0) cart.delete(snack.id);
		else cart.set(snack.id, { snack, quantity: next });
	};
	const renderGrid = type => {
		grid.innerHTML = snacks.filter(snack => type === 'all' || snack.type === type).map(snack => `
			<article class="snack-card"><div class="snack-image"><img src="${snack.image}" alt="${snack.name}" loading="lazy"></div>
				<div class="snack-card-content"><h2>${snack.name}</h2><div class="snack-card-footer"><span class="snack-price">${snack.price} EGP</span>
					<div class="quantity-control"><button type="button" data-action="decrease" data-id="${snack.id}" aria-label="Decrease ${snack.name}">-</button><span data-quantity="${snack.id}">0</span><button type="button" data-action="increase" data-id="${snack.id}" aria-label="Increase ${snack.name}">+</button></div>
				</div></div><button class="add-snack" type="button" data-action="increase" data-id="${snack.id}" aria-label="Add ${snack.name} to cart">&#8593;</button></article>`).join('');
		renderGridQuantities();
	};
	const renderGridQuantities = () => document.querySelectorAll('[data-quantity]').forEach(element => { element.textContent = cart.get(element.dataset.quantity)?.quantity || 0; });
	const renderCart = () => {
		const count = quantityTotal();
		cartCount.textContent = count;
		cartCount.hidden = count === 0;
		total.textContent = `${count} ${count === 1 ? 'item' : 'items'}`;
		cartItems.innerHTML = count === 0 ? '<p class="empty-cart">Your cart is empty.</p>' : [...cart.values()].map(({ snack, quantity }) => `
			<div class="cart-snack"><img src="${snack.image}" alt=""><div class="cart-snack-info"><h3>${snack.name}</h3><span>${snack.price * quantity} EGP</span></div>
				<div class="cart-snack-actions"><button type="button" data-action="decrease" data-id="${snack.id}" aria-label="Decrease ${snack.name}">-</button><span>${quantity}</span><button type="button" data-action="increase" data-id="${snack.id}" aria-label="Increase ${snack.name}">+</button><button class="delete-snack" type="button" data-action="delete" data-id="${snack.id}" aria-label="Remove ${snack.name}">&#215;</button></div></div>`).join('');
		renderGridQuantities();
	};
	const setDrawer = open => { document.body.classList.toggle('cart-open', open); cartButton.setAttribute('aria-expanded', open); drawer.setAttribute('aria-hidden', !open); backdrop.setAttribute('aria-hidden', !open); };
	document.querySelectorAll('input[name="snack-type"]').forEach(input => input.addEventListener('change', () => renderGrid(input.value)));
	document.addEventListener('click', event => {
		const button = event.target.closest('[data-action]');
		if (!button) return;
		const snack = snacks.find(item => item.id === button.dataset.id);
		if (button.dataset.action === 'delete') cart.delete(snack.id);
		else changeQuantity(snack, button.dataset.action === 'increase' ? 1 : -1);
		renderCart();
	});
	cartButton.addEventListener('click', () => setDrawer(!document.body.classList.contains('cart-open')));
	backdrop.addEventListener('click', () => setDrawer(false));
	renderGrid('all');
	renderCart();
});
