let currentLang = 'ja';

// --- 多言語対応ロジック ---
const translations = {
    ja: {
        hero_title: '銀座の夜、<br class="md:hidden">米を嗜む。',
        // Philosophy titles/bodies are handled by the slider logic
        menu_riz_title: 'Riz - おにぎり',
        menu_1_name: '銀シャリ - 極 -',
        menu_1_desc: '新潟県産コシヒカリ / 能登の塩',
        menu_2_name: '溢れいくら',
        menu_2_desc: '北海道産いくら醤油漬け',
        menu_3_name: '和牛しぐれ煮',
        menu_3_desc: 'A5ランク黒毛和牛 / 実山椒',
        soupe_title: 'ほどける、汁。',
        soupe_desc: '一番出汁の香りが、<br>銀座の夜の緊張を解きほぐす。<br>季節の食材を椀の中に閉じ込めました。<br>おにぎりとの調和をお楽しみください。',
        mariage_title: '酔いしれる。',
        mariage_desc: '米から生まれた酒、<br>土壌の記憶を持つワイン。<br>おにぎりの具材に合わせて、<br>ソムリエが至高の一杯を提案します。',
        address_text: '東京都中央区銀座6-12-12<br>銀座ステラビル2階',
        hours_text: '営業時間: 18:30 - 23:30<br><span class="text-xs text-gray-500">定休日: 土日祝日</span>'
    },
    en: {
        hero_title: 'Savoring Rice<br class="md:hidden">in the Ginza Night.',
        // Philosophy titles/bodies are handled by the slider logic
        menu_riz_title: 'Riz - Onigiri (Rice Ball)',
        menu_1_name: 'Silver Shari - Kiwami',
        menu_1_desc: 'Niigata Koshihikari Rice / Noto Salt',
        menu_2_name: 'Overflowing Ikura',
        menu_2_desc: 'Hokkaido Soy Marinated Salmon Roe',
        menu_3_name: 'Wagyu Shigureni',
        menu_3_desc: 'A5 Black Wagyu Beef / Japanese Pepper',
        soupe_title: 'Unwinding Soup.',
        soupe_desc: 'The aroma of the first dashi broth<br>unwinds the tension of the Ginza night.<br>Seasonal ingredients sealed in a bowl.<br>Enjoy the harmony with Onigiri.',
        mariage_title: 'Intoxicated by Harmony.',
        mariage_desc: 'Sake born from rice,<br>Wine holding memories of the soil.<br>Our sommelier proposes the supreme cup<br>to match your Onigiri ingredients.',
        address_text: 'Ginza Stella Building 2F<br>6-12-12 Ginza, Chuo-ku, Tokyo, Japan',
        hours_text: 'Hours: 18:30 - 23:30<br><span class="text-xs text-gray-500">Closed: Weekends & National Holidays</span>'
    }
};

// --- Philosophy Slider Data ---
const philoSlides = [
    {
        // Slide 1: Rice
        title: {
            ja: '掌の宇宙、<br>一粒の輝き。',
            en: 'Universe in the Palm,<br>Radiance of a Grain.'
        },
        body: {
            ja: '厳選された米、清冽な水、<br>そして職人の掌（たなごころ）。<br>一粒一粒が立ち上がる瞬間、<br>そこには無限の物語が宿ります。',
            en: 'Carefully selected rice, pure water,<br>and the artisan\'s palm.<br>At the moment each grain stands up,<br>an infinite story resides there.'
        }
    },
    {
        // Slide 2: Soup
        title: {
            ja: '湯気に咲く、<br>静寂。',
            en: 'Silence Blooming<br>in the Steam.'
        },
        body: {
            ja: '黄金色の出汁が、<br>銀座の喧騒を優しく解きほぐす。<br>心身を温める食べる宝石です。',
            en: 'Golden dashi broth gently unravels<br>the hustle and bustle of Ginza.<br>An edible gem that warms the body and soul.'
        }
    },
    {
        // Slide 3: Sake
        title: {
            ja: '宵に溶ける、<br>至福。',
            en: 'Bliss Melting<br>into the Evening.'
        },
        body: {
            ja: '米から生まれた酒と、<br>米から生まれた料理。<br>互いに引き立て合う「出会い」が、<br>夜の時間をより濃密に彩ります。',
            en: 'Sake born from rice<br>and cuisine born from rice.<br>The "encounter" that complements each other<br>colors the night time more densely.'
        }
    }
];

let philoIndex = 0; // Global index to sync lang switch

function updateAllTextResources() {
    // Update all 3 slides text for current language
    philoSlides.forEach((slide, index) => {
        const titleEl = document.getElementById(`philo-title-${index}`);
        const bodyEl = document.getElementById(`philo-body-${index}`);
        if (titleEl && bodyEl) {
            titleEl.innerHTML = slide.title[currentLang];
            bodyEl.innerHTML = slide.body[currentLang];
        }
    });
}

function switchLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    // Update Philosophy Text immediately
    updateAllTextResources();

    // PC用とモバイル用の両方のボタンを更新
    const langJpButtons = [document.getElementById('lang-jp'), document.getElementById('lang-jp-mobile')];
    const langEnButtons = [document.getElementById('lang-en'), document.getElementById('lang-en-mobile')];

    if (lang === 'ja') {
        langJpButtons.forEach(btn => btn && btn.classList.add('lang-active'));
        langEnButtons.forEach(btn => btn && btn.classList.remove('lang-active'));
        document.documentElement.lang = 'ja';
    } else {
        langJpButtons.forEach(btn => btn && btn.classList.remove('lang-active'));
        langEnButtons.forEach(btn => btn && btn.classList.add('lang-active'));
        document.documentElement.lang = 'en';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Carousel Logic (Drag) ---
    const slider = document.querySelector('#menu-carousel');
    const items = slider.querySelectorAll('.carousel-item');
    if (items.length > 0 && items.length < 10) {
        for (let i = 0; i < 2; i++) {
            items.forEach(item => {
                const clone = item.cloneNode(true);
                clone.style.opacity = '1';
                clone.style.transform = 'translateY(0)';
                clone.classList.remove('fade-up'); 
                slider.appendChild(clone);
            });
        }
    }

    let isDown = false;
    let startX;
    let scrollLeft;
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('cursor-grabbing');
        slider.classList.remove('cursor-grab');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('cursor-grabbing');
        slider.classList.add('cursor-grab');
    });
    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('cursor-grabbing');
        slider.classList.add('cursor-grab');
    });
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; 
        slider.scrollLeft = scrollLeft - walk;
    });

    // --- Mobile Menu Control ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    if (menuToggle && mobileNav) {
        const mobileLinks = mobileNav.querySelectorAll('a');
        const syncMenuState = () => {
            const isOpen = menuToggle.checked;
            menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            document.body.classList.toggle('overflow-hidden', isOpen);

            // Menu visibility (Tailwind peer に依存せず、JSで確実に切り替える)
            mobileNav.classList.toggle('opacity-0', !isOpen);
            mobileNav.classList.toggle('opacity-100', isOpen);
            mobileNav.classList.toggle('pointer-events-none', !isOpen);
            mobileNav.classList.toggle('pointer-events-auto', isOpen);
        };

        menuToggle.addEventListener('change', syncMenuState);

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (!menuToggle.checked) return;
                menuToggle.checked = false;
                syncMenuState();
            });
        });

        mobileNav.addEventListener('click', (event) => {
            if (event.target === mobileNav) {
                menuToggle.checked = false;
                syncMenuState();
            }
        });

        syncMenuState();
    }
    
    // --- Philosophy Section Slide Show ---
    const philoImages = document.querySelectorAll('#philosophy-slider img');
    const philoDots = document.querySelectorAll('#philosophy-dots div');
    const philoTexts = document.querySelectorAll('.philo-text-item');
    
    let philoInterval;

    function showPhiloSlide(index) {
        // Reset All
        philoImages.forEach(img => {
            img.classList.remove('opacity-100');
            img.classList.add('opacity-0');
        });
        philoDots.forEach(dot => {
            dot.classList.remove('opacity-100', 'scale-125');
            dot.classList.add('opacity-30');
        });
        philoTexts.forEach(text => {
            text.classList.remove('active');
            text.classList.add('inactive');
        });

        philoIndex = index;

        // Set Active
        philoImages[philoIndex].classList.remove('opacity-0');
        philoImages[philoIndex].classList.add('opacity-100');
        
        philoDots[philoIndex].classList.remove('opacity-30');
        philoDots[philoIndex].classList.add('opacity-100', 'scale-125');

        philoTexts[philoIndex].classList.remove('inactive');
        philoTexts[philoIndex].classList.add('active');
    }

    function startPhiloSlider() {
        philoInterval = setInterval(() => {
            let nextIndex = (philoIndex + 1) % philoImages.length;
            showPhiloSlide(nextIndex);
        }, 5000); 
    }

    if (philoImages.length > 0) {
        philoDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                clearInterval(philoInterval);
                showPhiloSlide(idx);
                startPhiloSlider();
            });
        });
        startPhiloSlider();
    }
});

// --- Existing Interactions ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
});

const links = document.querySelectorAll('a, button, .cursor-pointer');
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorOutline.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    });
    link.addEventListener('mouseleave', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.backgroundColor = 'transparent';
    });
});

const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);
document.querySelectorAll('.fade-up').forEach(el => { observer.observe(el); });

window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').style.opacity = '0';
        document.getElementById('loader').style.pointerEvents = 'none';
        document.getElementById('loader').style.transition = 'opacity 1s ease';
    }, 2000);
});


