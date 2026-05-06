document.addEventListener('DOMContentLoaded', () => {
    
    // === Бургер Меню ===
    const header = document.querySelector('.header');
    const navMenu = document.querySelector('.nav-menu');
    const authButtons = document.querySelector('.auth-buttons');
    
    const burgerBtn = document.createElement('div');
    burgerBtn.classList.add('burger');
    burgerBtn.innerHTML = '<span></span><span></span><span></span>';
    header.insertBefore(burgerBtn, navMenu);

    burgerBtn.addEventListener('click', () => {
        burgerBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        authButtons.classList.toggle('active');
    });

    // === Выбор Плана ===
    const planCards = document.querySelectorAll('.plan-card');
    planCards.forEach(card => {
        const selectBtn = card.querySelector('.btn-select');
        selectBtn.addEventListener('click', () => {
            planCards.forEach(c => {
                c.classList.remove('active');
                c.querySelector('.btn-select').classList.remove('active');
            });
            card.classList.add('active');
            selectBtn.classList.add('active');
        });
    });

    // === Улучшенная Бесконечная Карусель (Центрированная) ===
    const track = document.querySelector('.carousel-track');
    const originalCards = Array.from(document.querySelectorAll('.testimonial-card'));
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    const dotsContainer = document.querySelector('.dots-container');
    const outerContainer = document.querySelector('.carousel-outer');
    
    // 1. Создаем точки для оригинального количества карточек
    dotsContainer.innerHTML = '';
    originalCards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        
        // Клик по точкам
        dot.addEventListener('click', () => {
            if (isAnimating) return;
            // Вычисляем разницу между текущим показанным клоном и нужной точкой
            const currentMod = currentIndex % originalCards.length;
            const diff = i - currentMod;
            currentIndex += diff;
            updateCarousel();
        });
        
        dotsContainer.appendChild(dot);
    });
    const dots = document.querySelectorAll('.dot');

    // 2. Клонируем элементы для бесконечной прокрутки без дерганий
    // Создаем 3 одинаковых набора: [Клоны слева] + [Оригиналы] + [Клоны справа]
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });

    const allCards = Array.from(document.querySelectorAll('.testimonial-card'));
    
    // Начинаем со второго набора (Оригиналов)
    let currentIndex = originalCards.length; 
    let isAnimating = false;

    // Функция обновления позиций
    function updateCarousel(instant = false) {
        if (allCards.length === 0) return;

        const activeCard = allCards[currentIndex];
        
        // Математика для центрирования активной карточки
        const cardCenterPos = activeCard.offsetLeft + (activeCard.offsetWidth / 2);
        const screenCenterPos = outerContainer.offsetWidth / 2;
        const transformValue = screenCenterPos - cardCenterPos;

        // Если instant = true, мы сбрасываем transition, чтобы сделать прыжок невидимым
        track.style.transition = instant ? 'none' : 'transform 0.4s ease-in-out';
        track.style.transform = `translateX(${transformValue}px)`;

        // Добавляем класс active (срабатывает CSS для увеличения карточки)
        allCards.forEach((c, i) => c.classList.toggle('active', i === currentIndex));

        // Подсвечиваем нужную точку
        const dotIndex = currentIndex % originalCards.length;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === dotIndex));
    }

    // Инициализация при загрузке
    updateCarousel(true);

    // 3. Обработка кнопок
    nextBtn.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex++;
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex--;
        updateCarousel();
    });

    // 4. Бесконечность: Подменяем позицию после окончания анимации
    track.addEventListener('transitionend', () => {
        isAnimating = false;
        
        // Если ушли слишком далеко вправо (в 3-й сет клонов)
        if (currentIndex >= originalCards.length * 2) {
            currentIndex -= originalCards.length; // Прыгаем назад в средний сет
            updateCarousel(true);
        } 
        // Если ушли слишком далеко влево (в 1-й сет клонов)
        else if (currentIndex < originalCards.length) {
            currentIndex += originalCards.length; // Прыгаем вперед в средний сет
            updateCarousel(true);
        }
    });

    // 5. Обработка свайпов на телефонах
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const threshold = 50; // Дистанция для свайпа
        
        if (touchStartX - touchEndX > threshold) {
            if (!isAnimating) { isAnimating = true; currentIndex++; updateCarousel(); }
        }
        if (touchEndX - touchStartX > threshold) {
            if (!isAnimating) { isAnimating = true; currentIndex--; updateCarousel(); }
        }
    }, { passive: true });

    // Центрировать заново при изменении размера экрана (повороте телефона)
    window.addEventListener('resize', () => {
        updateCarousel(true);
    });
});