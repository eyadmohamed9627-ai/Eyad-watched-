const API_KEY = '2f2b9eb5118e7f4826fb18ffa4650e17';
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
const main = document.getElementById('main');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const historyDiv = document.getElementById('search-history');

// 1. جلب المحتوى المصري والتريند (الديسكفر)
async function getDiscoveryContent() {
    const url = `https://api.themoviedb.org/3/discover/combined_credits?api_key=${API_KEY}&with_origin_country=EG&language=ar&sort_by=popularity.desc`;
    // ملحوظة: لو مطلعش نتائج كفاية، بنجيب التريند العام
    const trendingUrl = `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}&language=ar`;
    
    try {
        const res = await fetch(trendingUrl);
        const data = await res.json();
        showContent(data.results);
    } catch (err) { console.error(err); }
}

// 2. دالة البحث
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value;
    if (searchTerm && searchTerm !== '') {
        searchMovies(searchTerm);
        saveToHistory(searchTerm);
        searchInput.value = '';
    }
});

async function searchMovies(term) {
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${term}&language=ar`;
    const res = await fetch(url);
    const data = await res.json();
    showContent(data.results);
}

// 3. عرض المحتوى
function showContent(results) {
    main.innerHTML = '';
    results.forEach(item => {
        const { title, name, poster_path, id, media_type } = item;
        if (!poster_path) return;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title || name}">
            <div class="movie-info">
                <h3>${title || name}</h3>
                <button class="play-btn" onclick="window.open('https://vidsrc.to/embed/${media_type || 'movie'}/${id}', '_blank')">شاهد الآن</button>
            </div>
        `;
        main.appendChild(movieEl);
    });
}

// 4. سجل البحث (LocalStorage)
function saveToHistory(term) {
    let history = JSON.parse(localStorage.getItem('eyad_search') || '[]');
    if (!history.includes(term)) {
        history.unshift(term);
        localStorage.setItem('eyad_search', JSON.stringify(history.slice(0, 5)));
    }
    renderHistory();
}

function renderHistory() {
    const history = JSON.parse(localStorage.getItem('eyad_search') || '[]');
    historyDiv.innerHTML = history.map(t => `<span class="history-item" onclick="searchMovies('${t}')">${t}</span>`).join('');
}

getDiscoveryContent();
renderHistory();
