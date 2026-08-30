const TMDB_CONFIG = {
      BASE_URL: 'https://api.themoviedb.org/3',
      IMAGE_BASE: 'https://image.tmdb.org/t/p/w500',
      IMAGE_ORIGINAL: 'https://image.tmdb.org/t/p/original',
      IMAGE_FALLBACK: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22500%22%20height%3D%22750%22%20viewBox%3D%220%200%20500%20750%22%3E%3Crect%20fill%3D%22%23141518%22%20width%3D%22500%22%20height%3D%22750%22%2F%3E%3Ctext%20fill%3D%22%23545458%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3ENO%20POSTER%3C%2Ftext%3E%3C%2Fsvg%3E',
      AUTH_TOKEN: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzMjE4MDA2OWNiOTQ2ZTdkYzQ0ZWIxODM5MzA3NWJiMiIsIm5iZiI6MTc4NzA5NDIzNi40NTksInN1YiI6IjZhODRlNGRjNmQ1YWRjMGMwNmRhNDJkZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.coulPYWUa_kQFA8MG71fK29p44gg5Afgn5JEiG-Ut5E'
};

async function getData(category = 'now_playing', page = 1) {
      try {
            // Map category names to TMDB endpoints
            let endpoint = 'now_playing';
            if (category === 'upcoming') {
                  endpoint = 'upcoming';
            } else if (category === 'imax') {
                  endpoint = 'popular';
            } else if (category === 'special') {
                  endpoint = 'top_rated';
            } else if (category && category !== 'not-playing' && category !== 'now-playing') {
                  endpoint = category;
            }

            const options = {
                  method: 'GET',
                  headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${TMDB_CONFIG.AUTH_TOKEN}`
                  }
            };

            const response = await fetch(`${TMDB_CONFIG.BASE_URL}/movie/${endpoint}?language=en-US&page=${page}`, options);
            if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
      } catch (e) {
            console.error('Error fetching TMDB movie data:', e);
            return null;
      }
}

// Support browser globals and CommonJS / ES modules
if (typeof window !== 'undefined') {
      window.getData = getData;
      window.TMDB_CONFIG = TMDB_CONFIG;
}
if (typeof module !== 'undefined' && module.exports) {
      module.exports = { getData, TMDB_CONFIG };
}

