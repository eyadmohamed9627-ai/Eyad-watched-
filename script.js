const API_KEY = '2f2b9eb5118e7f4826fb18ffa4650e17';
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

async function getMovies() {
    // جربنا نجيب المصري بـ discover، لو منفعش هنجيب التريند العام عشان نضمن إن الصفحة مش فاضية
    const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}&language=ar`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        const main = document.getElementById('main');
        
        if (!data.results || data.results.length === 0) {
            main.innerHTML = '<h2 style="text-align:center">جاري تحديث السيرفر...</h2>';
            return;
        }

        main.innerHTML = '<div class="movies-grid"></div>';
        const grid = main.querySelector('.movies-grid');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(160px, 1fr))';
        grid.style.gap = '20px';
        grid.style.padding = '20px';

        data.results.forEach(movie => {
            const { title, name, poster_path, id, media_type } = movie;
            if (!poster_path) return;
            const movieEl = document.createElement('div');
            movieEl.innerHTML = `
                <div style="background: #1a1c22; border-radius: 10px; overflow: hidden;">
                    <img src="${IMG_PATH + poster_path}" style="width: 100%; height: 250px; object-fit: cover;">
                    <div style="padding: 10px; text-align: center;">
                        <h3 style="font-size: 14px; height: 40px;">${title || name}</h3>
                        <button onclick="window.open('https://vidsrc.to/embed/${media_type || 'movie'}/${id}', '_blank')" 
                                style="background: #8a2be2; color: white; border: none; width: 100%; padding: 8px; border-radius: 5px; cursor: pointer;">
                                شاهد الآن
                        </button>
                    </div>
                </div>
            `;
            grid.appendChild(movieEl);
        });
    } catch (err) {
        console.error("خطأ في جلب البيانات");
    }
}
getMovies();
