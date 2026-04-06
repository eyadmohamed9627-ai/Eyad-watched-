// حط التوكن بتاعك هنا بين العلامتين
const TOKEN = 'انسخ_التوكن_بتاعك_هنا'; 
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

async function getMovies() {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TOKEN}`
        }
    };

    try {
        const response = await fetch('https://api.themoviedb.org/3/trending/all/day?language=ar', options);
        const data = await response.json();
        const main = document.getElementById('main');
        main.innerHTML = '';

        data.results.forEach(movie => {
            const { title, name, poster_path, vote_average, id, media_type } = movie;
            const movieEl = document.createElement('div');
            movieEl.classList.add('movie');
            movieEl.innerHTML = `
                <img src="${IMG_PATH + poster_path}" alt="${title || name}">
                <div class="movie-info">
                    <h3>${title || name}</h3>
                    <button class="play-btn" onclick="watch(${id}, '${media_type}')">شاهد الآن</button>
                </div>
            `;
            main.appendChild(movieEl);
        });
    } catch (err) {
        console.error('في مشكلة في الاتصال بالـ API:', err);
    }
}

function watch(id, type) {
    // بيفتح الفيلم في صفحة جديدة من سيرفر خارجي
    const url = `https://vidsrc.to/embed/${type}/${id}`;
    window.open(url, '_blank');
}

getMovies();
