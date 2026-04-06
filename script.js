// 1. حط الـ Token بتاعك هنا (اللي بيبدأ بـ EyJ...)
const TOKEN = 'حط_التوكن_بتاعك_هنا_بالظبط'; 

const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
const main = document.getElementById('main');

// 2. دالة جلب البيانات (أفلام ومسلسلات مع بعض)
async function getContent() {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${TOKEN}`
        }
    };

    try {
        // بنسحب التريند (أفلام ومسلسلات) باللغة العربية
        const response = await fetch('https://api.themoviedb.org/3/trending/all/day?language=ar', options);
        const data = await response.json();
        
        if (data.results) {
            displayContent(data.results);
        } else {
            main.innerHTML = '<h2 style="text-align:center;">تأكد من صحة التوكن يا إياد</h2>';
        }
    } catch (err) {
        console.error('Error fetching data:', err);
        main.innerHTML = '<h2 style="text-align:center;">مشكلة في الاتصال بالسيرفر</h2>';
    }
}

// 3. دالة عرض المحتوى في الصفحة
function displayContent(items) {
    main.innerHTML = ''; // بيمسح أي حاجة قديمة

    items.forEach(item => {
        const { title, name, poster_path, vote_average, id, media_type } = item;
        
        // لو مفيش صورة بوستر مش بنعرض الفيلم عشان الشكل يبقى نضيف
        if (!poster_path) return;

        const card = document.createElement('div');
        card.classList.add('movie');
        card.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title || name}">
            <div class="movie-info">
                <h3>${title || name}</h3>
                <button class="play-btn" onclick="openPlayer(${id}, '${media_type}')">شاهد الآن</button>
            </div>
        `;
        main.appendChild(card);
    });
}

// 4. دالة فتح المشغل (السيرفرات والحلقات)
function openPlayer(id, type) {
    // السيرفر ده ذكي: لو 'tv' بيطلع حلقات، ولو 'movie' بيفتح الفيلم
    const playerUrl = `https://vidsrc.to/embed/${type}/${id}`;
    
    // بنعرض المشغل في نص الصفحة مكان الأفلام
    main.innerHTML = `
        <div style="width:100%; grid-column: 1 / -1; text-align:center;">
            <button onclick="location.reload()" style="background:#8a2be2; color:white; border:none; padding:10px 25px; border-radius:5px; cursor:pointer; margin-bottom:20px; font-family:'Cairo'; font-weight:bold;">العودة للرئيسية</button>
            <div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:15px; box-shadow: 0 0 30px rgba(0,0,0,0.5);">
                <iframe src="${playerUrl}" 
                        style="position:absolute; top:0; left:0; width:100%; height:100%;" 
                        frameborder="0" allowfullscreen></iframe>
            </div>
        </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// تشغيل الكود فور فتح الصفحة
getContent();
