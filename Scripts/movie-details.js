document.addEventListener('DOMContentLoaded', async () => {
	const movieId = new URLSearchParams(window.location.search).get('id');
	const imageBase = TMDB_CONFIG.IMAGE_BASE;
	const profileBase = 'https://image.tmdb.org/t/p/w185';
	const fallback = TMDB_CONFIG.IMAGE_FALLBACK;
	const movie = await getMovieDetails(movieId);
	const credits = await getMovieCredits(movieId);
	const videos = await getMovieVideos(movieId);
	const releases = await getMovieReleaseDates(movieId);

	if (!movie) {
		document.querySelector('#movie-title').textContent = 'MOVIE NOT FOUND';
		return;
	}

	const director = credits?.crew?.find(person => person.job === 'Director');
	const cast = credits?.cast?.slice(0, 3) || [];
	const trailer = videos?.results?.find(video => video.site === 'YouTube' && video.type === 'Trailer')
		|| videos?.results?.find(video => video.site === 'YouTube');
	const usRelease = releases?.results?.find(country => country.iso_3166_1 === 'US');
	const certification = usRelease?.release_dates?.find(release => release.certification)?.certification;
	const setText = (selector, value) => {
		const element = document.querySelector(selector);
		if (element) element.textContent = value;
	};
	const setImage = (selector, path, alt) => {
		const image = document.querySelector(selector);
		if (!image) return;
		image.src = path ? `${imageBase}${path}` : fallback;
		image.alt = alt;
	};

	document.title = `LUMA — ${movie.title || movie.original_title}`;
	setImage('#movie-poster', movie.poster_path, `${movie.title} poster`);
	setText('#movie-title', (movie.title || movie.original_title || 'Untitled').toUpperCase());
	setText('#movie-rating', certification || 'Rating not listed');
	setText('#movie-duration', movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'Runtime unavailable');
	setText('#movie-audio', 'ENGLISH');
	setText('#movie-subtitles', 'CC');
	setText('#movie-score', `★ ${movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'} IMDB`);
	setText('#movie-description', movie.overview || 'No synopsis is available for this title.');

	const genres = (movie.genres || []).slice(0, 3);
	document.querySelectorAll('.badge').forEach(badge => {
		badge.hidden = true;
	});
	genres.forEach((genre, index) => {
		const badgeId = index === 0 ? 'movie-genre' : `movie-genre${index + 1}`;
		const badge = document.querySelector(`#${badgeId}`);
		if (badge) {
			badge.textContent = genre.name.toUpperCase();
			badge.hidden = false;
		}
	});

	setText('#movie-director-name', director?.name || 'Director unavailable');
	setImage('#movie-director-avatar', director?.profile_path, director?.name || 'Director');
	cast.forEach((person, index) => {
		const image = document.querySelector(`#movie-cast-avatar${index + 1}`);
		if (image) {
			image.src = person.profile_path ? `${profileBase}${person.profile_path}` : fallback;
			image.alt = person.name;
			image.classList.add('stacked');
		}
	});
	setText('#movie-cast-count', cast.length ? `+${Math.max((credits.cast || []).length - cast.length, 0)}` : '');

	const trailerButton = document.querySelector('#movie-trailer-btn');
	if (trailerButton && trailer) {
		trailerButton.addEventListener('click', () => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank', 'noopener'));
	} else if (trailerButton) {
		trailerButton.disabled = true;
		trailerButton.textContent = 'TRAILER UNAVAILABLE';
	}

	const showtimeLink = document.querySelector('#select-showtime');
	if (showtimeLink) showtimeLink.href = `../pages/seat-selection.html?id=${movie.id}`;
});
