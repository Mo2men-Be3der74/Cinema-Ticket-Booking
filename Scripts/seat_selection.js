document.addEventListener('DOMContentLoaded', () => {
  const movieId = new URLSearchParams(window.location.search).get('id');
  const detailsLink = document.querySelector('.back-to-details');
  const datePicker = document.querySelector('#date-picker');
  const screeningTypes = document.querySelector('#screening-types');
  const showtimes = document.querySelector('#showtimes');
  let selectedDate = 0;
  let selectedFormat = 'Standard';
  let selectedTime = null;

  if (detailsLink && movieId) {
    detailsLink.href = `../pages/movie-details.html?id=${encodeURIComponent(movieId)}`;
  }

  const formatTime = hour => {
    const period = hour >= 12 ? 'pm' : 'am';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00${period}`;
  };

  const renderShowtimes = () => {
    const startHour = 9;
    const times = Array.from({ length: 6 }, (_, index) => startHour + index * 3);
    showtimes.innerHTML = times.map(hour => `
      <button class="showtime${selectedTime === hour ? ' active' : ''}" type="button" data-showtime="${hour}" aria-pressed="${selectedTime === hour}">
        <span>${formatTime(hour >= 24 ? hour - 24 : hour)}</span>
        <small>${selectedFormat}</small>
      </button>
    `).join('');
  };

  const renderDates = () => {
    const today = new Date();
    datePicker.innerHTML = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setHours(0, 0, 0, 0);
      date.setDate(today.getDate() + index);
      return `<button class="date-option${index === selectedDate ? ' active' : ''}" type="button" role="tab" aria-selected="${index === selectedDate}" data-date-index="${index}">
        <span>${index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(date)}</span>
        <strong>${new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(date)}</strong>
      </button>`;
    }).join('');
  };

  const loadMovie = async () => {
    const movie = await getMovieDetails(movieId);
    const credits = await getMovieCredits(movieId);
    const videos = await getMovieVideos(movieId);
    const keywords = await getMovieKeywords(movieId);
    if (!movie) {
      document.querySelector('#selected-movie-summary').textContent = 'Select a movie to see available screenings.';
      return;
    }

    document.title = `LUMA — ${movie.title || movie.original_title}`;
    const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'Runtime unavailable';
    const director = credits?.crew?.find(person => person.job === 'Director')?.name;
    document.querySelector('#selected-movie-title').textContent = movie.title || movie.original_title || 'Untitled';
    document.querySelector('#selected-movie-rating').textContent = `★ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} / 10`;
    document.querySelector('#selected-movie-runtime').textContent = runtime;
    document.querySelector('#selected-movie-genres').textContent = (movie.genres || []).map(genre => genre.name).join(' · ') || 'Genres unavailable';
    document.querySelector('#selected-movie-summary').textContent = movie.overview || `No story is available for this title.${director ? ` Directed by ${director}.` : ''}`;

    const trailer = videos?.results?.find(video => video.site === 'YouTube' && video.type === 'Trailer')
      || videos?.results?.find(video => video.site === 'YouTube');
    if (trailer) {
      document.querySelector('#showtime-trailer').innerHTML = `<iframe src="https://www.youtube.com/embed/${trailer.key}" title="${movie.title} trailer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }

    const searchableMovieText = `${movie.title} ${movie.overview} ${(keywords?.keywords || []).map(keyword => keyword.name).join(' ')}`.toLowerCase();
    const formats = ['Standard', 'Gold', 'MAX', ...(searchableMovieText.includes('imax') ? ['IMAX'] : []), '4DX'];
    screeningTypes.innerHTML = formats.map((format, index) => `<button class="format-option${index === 0 ? ' active' : ''}" type="button" role="tab" aria-selected="${index === 0}">${format}</button>`).join('');
    screeningTypes.addEventListener('click', event => {
      const button = event.target.closest('.format-option');
      if (!button) return;
      selectedFormat = button.textContent;
      resetSeats();
      screeningTypes.querySelectorAll('.format-option').forEach(option => {
        const active = option === button;
        option.classList.toggle('active', active);
        option.setAttribute('aria-selected', active);
      });
      renderShowtimes();
    });
  };

  renderDates();
  renderShowtimes();
  datePicker.addEventListener('click', event => {
    const button = event.target.closest('.date-option');
    if (!button) return;
    if (selectedDate === Number(button.dataset.dateIndex)) return;
    selectedDate = Number(button.dataset.dateIndex);
    resetSeats();
    renderDates();
  });
  showtimes.addEventListener('click', event => {
    const button = event.target.closest('.showtime');
    if (!button) return;
    const time = Number(button.dataset.showtime);
    if (selectedTime === time) {
      selectedTime = null;
      resetSeats();
      renderShowtimes();
      return;
    }
    selectedTime = time;
    resetSeats();
    renderShowtimes();
  });
  loadMovie();

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

  const resetSeats = () => {
    seats.forEach(seat => seat.classList.remove('selected'));
    updateCart();
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