document.addEventListener('DOMContentLoaded', async () => {
	const categoryTitle = document.querySelector('#category-title');
	const movieList = document.querySelector('#movie-list');
	const categoryOptions = document.querySelectorAll('input[name="screening"]');
	const heroBanner = document.querySelector('#hero-banner');
	const heroTitle = document.querySelector('#hero-title');
	const heroYear = document.querySelector('#hero-year');
	const heroRating = document.querySelector('#hero-rating');
	const heroDescription = document.querySelector('#hero-description');

	const categoryDisplayNames = {
		'not-playing': 'NOW PLAYING',
		'now-playing': 'NOW PLAYING',
		'now_playing': 'NOW PLAYING',
		'upcoming': 'UPCOMING RELEASES',
		'imax': 'IMAX & POPULAR SCREENINGS',
		'special': 'SPECIAL & TOP RATED SCREENINGS'
	};

	// Cache to prevent duplicate network calls
	const movieDataCache = {};

	// Helper to format badges (e.g., IMAX, 4K LASER, 70MM)
	const getFormatBadge = (index, category) => {
		if (category === 'imax' || index % 4 === 0) return 'IMAX 70MM';
		if (index % 4 === 1) return 'DOLBY CINEMA';
		if (index % 4 === 2) return 'THE LOUNGE';
		return '4K LASER';
	};

	// Render skeleton placeholders
	const renderSkeletons = (count = 10) => {
		if (!movieList) return;
		movieList.innerHTML = Array.from({ length: count }, () => `
			<div class="skeleton-card">
				<div class="skeleton-poster"></div>
				<div class="skeleton-line"></div>
				<div class="skeleton-line short"></div>
			</div>
		`).join('');
	};

	// Update hero banner with top movie
	const updateHeroSection = (movie) => {
		if (!movie) return;
		if (heroTitle) heroTitle.textContent = (movie.title || movie.original_title || 'DUNE: PART TWO').toUpperCase();
		if (heroDescription && movie.overview) {
			heroDescription.textContent = movie.overview.length > 220 
				? `${movie.overview.substring(0, 220)}...` 
				: movie.overview;
		}
		if (heroYear && movie.release_date) {
			heroYear.textContent = movie.release_date.split('-')[0];
		}
		if (heroRating && movie.vote_average) {
			heroRating.innerHTML = `<i class="fa-solid fa-star"></i> ${movie.vote_average.toFixed(1)} IMDB`;
		}
		if (heroBanner && movie.backdrop_path && typeof TMDB_CONFIG !== 'undefined') {
			heroBanner.style.backgroundImage = `linear-gradient(180deg, rgba(10, 10, 12, 0.15) 0%, rgba(10, 10, 12, 0.8) 60%, rgba(10, 10, 12, 0.98) 100%), url('${TMDB_CONFIG.IMAGE_ORIGINAL}${movie.backdrop_path}')`;
		}
	};

	// Render movie cards from TMDB data
	const renderMovies = async (category, isInitial = false) => {
		if (!movieList) return;

		const selectedOption = document.querySelector(`label[for="${category}"]`) || document.querySelector(`label[for="not-playing"]`) || document.querySelector(`label[for="now-playing"]`);
		if (categoryTitle && selectedOption) {
			categoryTitle.textContent = categoryDisplayNames[category] || selectedOption.textContent.toUpperCase();
		}

		movieList.classList.remove('fade-in');
		movieList.classList.add('fade-out');

		// Show skeleton placeholders while fetching
		renderSkeletons(10);
		movieList.classList.remove('fade-out');
		movieList.classList.add('fade-in');

		let movies = movieDataCache[category];

		if (!movies) {
			try {
				if (typeof getData === 'function') {
					const data = await getData(category);
					if (data && data.results && data.results.length > 0) {
						movies = data.results;
						movieDataCache[category] = movies;
					}
				}
			} catch (err) {
				console.error('Failed to load movies from TMDB:', err);
			}
		}

		// Update hero on initial load with the top featured movie
		if (isInitial && movies && movies.length > 0) {
			updateHeroSection(movies[0]);
		}

		movieList.classList.remove('fade-in');
		movieList.classList.add('fade-out');

		setTimeout(() => {
			if (!movies || movies.length === 0) {
				movieList.innerHTML = `<div class="no-movies-msg">No movies available at the moment.</div>`;
				movieList.classList.remove('fade-out');
				movieList.classList.add('fade-in');
				return;
			}

			const imageBase = (typeof TMDB_CONFIG !== 'undefined' && TMDB_CONFIG.IMAGE_BASE) ? TMDB_CONFIG.IMAGE_BASE : 'https://image.tmdb.org/t/p/w500';
			const fallbackImage = (typeof TMDB_CONFIG !== 'undefined' && TMDB_CONFIG.IMAGE_FALLBACK) ? TMDB_CONFIG.IMAGE_FALLBACK : 'https://picsum.photos/500/750?grayscale';

			movieList.innerHTML = movies.slice(0, 10).map((movie, index) => {
				const title = movie.title || movie.original_title || 'Untitled';
				const year = movie.release_date ? movie.release_date.split('-')[0] : '2026';
				const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '8.0';
				const posterUrl = movie.poster_path 
					? `${imageBase}${movie.poster_path}` 
					: fallbackImage;
				const badge = getFormatBadge(index, category);
				const movieId = movie.id || index;

				return `
					<a href="pages/movie-details.html?id=${movieId}" class="movie-card" data-id="${movieId}">
						<div class="poster-container">
							<img 
								src="${posterUrl}" 
								alt="${title}" 
								class="poster-img" 
								loading="lazy"
								onerror="this.onerror=null;this.src='${fallbackImage}';"
							>
							<div class="card-overlay">
								<span class="card-badge format">${badge}</span>
								<span class="card-badge score"><i class="fa-solid fa-star"></i> ${rating}</span>
							</div>
							<div class="card-hover-action">
								<span>Book Tickets <i class="fa-solid fa-arrow-right"></i></span>
							</div>
						</div>
						<div class="movie-info">
							<h3 class="movie-title" title="${title}">${title}</h3>
							<div class="movie-meta">
								<span class="movie-year">${year}</span>
								<span class="meta-dot">•</span>
								<span class="movie-rating-text"><i class="fa-solid fa-star"></i> ${rating}</span>
							</div>
						</div>
					</a>
				`;
			}).join('');

			movieList.classList.remove('fade-out');
			movieList.classList.add('fade-in');
		}, 180);
	};

	categoryOptions.forEach(option => {
		option.addEventListener('change', () => renderMovies(option.value));
	});

	const checkedRadio = document.querySelector('input[name="screening"]:checked');
	const initialCategory = checkedRadio ? checkedRadio.value : 'not-playing';
	await renderMovies(initialCategory, true);
});
