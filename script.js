const TOKEN = 'EyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZjJiOWViNTExOGU3ZjQ4MjZmYjE4ZmZhNDY1MGUxNyIsIm5iZiI6MTc3NTQ4NzA0NS43NjE5OTk4LCJzdWIiOiI2OWQzYzg0NTE1NmQ4MjhlMTFjYTZlY2QiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.MI3uSf7fApFsxH8znQ7uOsh-VLinqBnwTkTqN-C0Daw';
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
        // بنجيب الأفلام والمسلسلات التريند
        const response = await fetch('https://api.themoviedb.org/3/trending/all/day?language=ar', options);
        const data = await response.json();
        
        const main = document.getElementById('main');
        
        if (data.results) {
            main.innerHTML = ''; // بيمسح أي رسائل قديمة
            data.results.forEach(movie => {
                const { title, name, poster_path, id, media_type } = movie;
                if (!poster_path) return;

                const movieEl = document.createElement('div');
                movieEl.classList.add('movie');
                movieEl.innerHTML = `
                    <img src="${IMG_PATH + poster_path}" alt="${title || name}">
                    <div class="movie-info">
                        <h3>${title || name}</h3>
                        <button class="play-btn" onclick="watchNow(${id}, '${media_type}')">شاهد الآن</button>
                    </div>
                `;
                main.appendChild(movieEl);
            });
        }
    } catch (err) {
        document.getElementById('main').innerHTML = '<h2 style="color:white; text-align:center;">حدث خطأ في تحميل البيانات</h2>';
    }
}

function watchNow(id, type) {
    const playerUrl = `https://vidsrc.to/embed/${type}/${id}`;
    window.open(playerUrl, '_blank');
}

getMovies();
