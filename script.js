// الكي بتاعك يا إياد اللي لسه بعته
const API_KEY = '2f2b9eb5118e7f4826fb18ffa4650e17'; 
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

async function getMovies() {
    // الرابط ده بيجيب الأفلام والمسلسلات التريند بالعربي باستخدام الـ Key بتاعك
    const url = `https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}&language=ar`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        const main = document.getElementById('main');
        
        // لو مفيش div بالـ id ده، الكود مش هيشتغل
        if (!main) {
            console.error("تأكد إن ملف الـ HTML فيه <main id='main'></main>");
            return;
        }

        main.innerHTML = ''; // تنظيف الصفحة قبل العرض

        data.results.forEach(movie => {
            const { title, name, poster_path, id, media_type } = movie;
            if (!poster_path) return;

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
        console.error('فيه مشكلة في السحب يا بطل:', err);
    }
}

function watch(id, type) {
    // بيفتح الفيلم أو المسلسل في صفحة جديدة (تقدر تغير vidsrc بـ أي سيرفر تاني)
    const playerUrl = `https://vidsrc.to/embed/${type}/${id}`;
    window.open(playerUrl, '_blank');
}

// تشغيل الوظيفة
getMovies();
