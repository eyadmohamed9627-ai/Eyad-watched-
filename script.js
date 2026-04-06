const API_KEY = '2f2b9eb5118e7f4826fb18ffa4650e17';
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

// 1. جلب المحتوى (المصري + التريند)
async function fetchHomeContent() {
    const egUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_origin_country=EG&language=ar&sort_by=popularity.desc`;
    const trendUrl = `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}&language=ar`;

    try {
        main.innerHTML = '';
        const [egRes, trendRes] = await Promise.all([fetch(egUrl), fetch(trendUrl)]);
        const egData = await egRes.json();
        const trendData = await trendRes.json();

        if(egData.results.length > 0) renderSection(egData.results, 'أفلام ومسلسلات مصرية');
        renderSection(trendData.results, 'اكتشف عالم الترفيه');
    } catch (err) { console.error("خطأ في التحميل"); }
}

function renderSection(movies, title) {
    const sectionTitle = document.createElement('h2');
    sectionTitle.style.padding = '20px 20px 0';
    sectionTitle.style.color = '#8a2be2';
    sectionTitle.innerText = title;
    main.appendChild(sectionTitle);

    const grid = document.createElement('div');
    grid.className = 'movies-grid';
    
    movies.forEach(movie => {
        const { title, name, poster_path, id, media_type } = movie;
        if (!poster_path) return;
        const movieEl = document.createElement('div');
        movieEl.className = 'movie';
        movieEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title || name}">
            <div class="movie-info">
                <h3>${title || name}</h3>
                <button class="play-btn" onclick="playVideo(${id}, '${media_type || 'movie'}')">شاهد الآن</button>
            </div>
        `;
        grid.appendChild(movieEl);
    });
    main.appendChild(grid);
}

// 2. مشغل الفيديو بملء الشاشة
function playVideo(id, type) {
    const playerUrl = `https://vidsrc.to/embed/${type}/${id}`;
    const videoDiv = document.createElement('div');
    videoDiv.className = 'video-container';
    videoDiv.innerHTML = `
        <button class="close-btn" onclick="this.parentElement.remove()">إغلاق X</button>
        <iframe src="${playerUrl}" allowfullscreen></iframe>
    `;
    document.body.appendChild(videoDiv);
}

// 3. البحث وسجل البحث
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const term = search.value;
    if(term) {
        performSearch(term);
        addToHistory(term);
        search.value = '';
    }
});

async function performSearch(term) {
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${term}&language=ar`;
    const res = await fetch(url);
    const data = await res.json();
    main.innerHTML = '';
    renderSection(data.results, `نتائج البحث عن: ${term}`);
}

function addToHistory(term) {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    if(!history.includes(term)) {
        history.unshift(term);
        localStorage.setItem('searchHistory', JSON.stringify(history.slice(0, 5)));
    }
    displayHistory();
}

function displayHistory() {
    const historyBox = document.getElementById('search-history');
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    historyBox.innerHTML = history.map(t => `<span class="history-item" onclick="performSearch('${t}')">${t}</span>`).join('');
}

fetchHomeContent();
displayHistory();
