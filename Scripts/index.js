document.addEventListener('DOMContentLoaded', () => {
	const categoryTitle = document.querySelector('#category-title');
	const movieList = document.querySelector('#movie-list');
	const categoryOptions = document.querySelectorAll('input[name="screening"]');

	const moviesByCategory = {
		'not-playing': [
			['DUNE: PART TWO', '2026', '2H 49M'],
			['THE LAST VOYAGE', '2025', '2H 14M'],
			['MIDNIGHT SIGNAL', '2026', '1H 58M'],
			['ORBITAL DAWN', '2025', '2H 31M'],
			['THE SILENT CITY', '2026', '2H 06M']
		],
		upcoming: [
			['STARFALL', '2027', '2H 20M'],
			['GLASS HORIZON', '2027', '1H 52M'],
			['RED PLANET', '2027', '2H 08M'],
			['THE DEEP', '2027', '2H 25M'],
			['AFTERLIGHT', '2027', '1H 47M']
		],
		imax: [
			['EVEREST: THE SUMMIT', '2026', '2H 18M'],
			['OCEAN GIANTS', '2026', '1H 44M'],
			['COSMOS: INFINITE', '2026', '2H 02M'],
			['WILD FRONTIER', '2025', '1H 56M'],
			['MEGALITH', '2026', '2H 11M']
		],
		special: [
			['THE ART OF MEMORY', '2026', '1H 36M'],
			['LUMA CLASSICS: METROPOLIS', '1927', '2H 33M'],
			['ONE NIGHT ONLY', '2026', '1H 49M'],
			['DIRECTOR\'S CUT', '2025', '2H 21M'],
			['SHORTS AFTER DARK', '2026', '1H 18M']
		]
	};

	const renderMovies = category => {
		const movies = moviesByCategory[category];
		const selectedOption = document.querySelector(`label[for="${category}"]`);

		categoryTitle.textContent = selectedOption.textContent;
		movieList.classList.remove('fade-in');
		movieList.classList.add('fade-out');

		window.setTimeout(() => {
			movieList.innerHTML = movies.map(([name, year, duration]) => `
				<div class="movie-card">
					<div class="image">
						<div class="poster"></div>
					</div>
					<div class="movie-info">
						<h2>${name}</h2>
						<p>${year}</p>
						<p>${duration}</p>
					</div>
				</div>
			`).join('');

			movieList.classList.remove('fade-out');
			movieList.classList.add('fade-in');
		}, 220);
	};

	categoryOptions.forEach(option => {
		option.addEventListener('change', () => renderMovies(option.value));
	});

	renderMovies(document.querySelector('input[name="screening"]:checked').value);
});
