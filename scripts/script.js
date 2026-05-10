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

    // === Улучшенная Бесконечная Карусель ===
    const track = document.querySelector('.carousel-track');
    const originalCards = Array.from(document.querySelectorAll('.testimonial-card'));
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    const dotsContainer = document.querySelector('.dots-container');
    const outerContainer = document.querySelector('.carousel-outer');
    
    dotsContainer.innerHTML = '';
    originalCards.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        
        dot.addEventListener('click', () => {
            if (isAnimating) return;
            const currentMod = currentIndex % originalCards.length;
            const diff = i - currentMod;
            currentIndex += diff;
            updateCarousel();
        });
        
        dotsContainer.appendChild(dot);
    });
    const dots = document.querySelectorAll('.dot');

    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });

    const allCards = Array.from(document.querySelectorAll('.testimonial-card'));
    let currentIndex = originalCards.length; 
    let isAnimating = false;

    function updateCarousel(instant = false) {
        if (allCards.length === 0) return;

        const activeCard = allCards[currentIndex];
        const cardCenterPos = activeCard.offsetLeft + (activeCard.offsetWidth / 2);
        const screenCenterPos = outerContainer.offsetWidth / 2;
        const transformValue = screenCenterPos - cardCenterPos;

        track.style.transition = instant ? 'none' : 'transform 0.4s ease-in-out';
        track.style.transform = `translateX(${transformValue}px)`;

        allCards.forEach((c, i) => c.classList.toggle('active', i === currentIndex));

        const dotIndex = currentIndex % originalCards.length;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === dotIndex));
    }

    updateCarousel(true);

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

    track.addEventListener('transitionend', () => {
        isAnimating = false;
        if (currentIndex >= originalCards.length * 2) {
            currentIndex -= originalCards.length;
            updateCarousel(true);
        } 
        else if (currentIndex < originalCards.length) {
            currentIndex += originalCards.length;
            updateCarousel(true);
        }
    });

    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const threshold = 50; 
        if (touchStartX - touchEndX > threshold) {
            if (!isAnimating) { isAnimating = true; currentIndex++; updateCarousel(); }
        }
        if (touchEndX - touchStartX > threshold) {
            if (!isAnimating) { isAnimating = true; currentIndex--; updateCarousel(); }
        }
    }, { passive: true });

    window.addEventListener('resize', () => { updateCarousel(true); });


    // ===============================
    // НОВЫЙ ФУНКЦИОНАЛ: МОДАЛЬНЫЕ ОКНА
    // ===============================

    const subscribeBtn = document.getElementById('btn-subscribe');
    const btnSignIn = document.getElementById('btn-signin');
    const btnSignUp = document.getElementById('btn-signup');
    
    const subscribeModal = document.getElementById('subscribeModal');
    const authModal = document.getElementById('authModal');
    const closeBtns = document.querySelectorAll('.close-btn');

    // Форма авторизации
    const authForm = document.getElementById('authForm');
    const authTitle = document.getElementById('authTitle');
    const authMessage = document.getElementById('authMessage');
    const authUsername = document.getElementById('authUsername');
    const authPassword = document.getElementById('authPassword');
    
    let currentAuthMode = 'signin'; // 'signin' или 'signup'

    // Функция открытия/закрытия
    function openModal(modal) {
        modal.classList.add('show');
    }

    function closeModal(modal) {
        modal.classList.remove('show');
        authMessage.innerText = ''; // Очищаем сообщения
        authForm.reset();
    }

    // Закрытие по крестику
    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            closeModal(e.target.closest('.modal'));
        });
    });

    // Закрытие по клику вне окна
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // Открытие окна подписки
    subscribeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(subscribeModal);
    });

    // Открытие окна авторизации
    btnSignIn.addEventListener('click', (e) => {
        e.preventDefault();
        currentAuthMode = 'signin';
        authTitle.innerText = 'Sign In';
        openModal(authModal);
    });

    btnSignUp.addEventListener('click', (e) => {
        e.preventDefault();
        // Если пользователь уже вошел, кнопка работает как Logout
        if (btnSignUp.innerText === 'Logout') {
            localStorage.removeItem('lasles_user');
            localStorage.removeItem('lasles_pass');
            location.reload(); // Перезагружаем страницу, чтобы вернуть кнопки
            return;
        }
        currentAuthMode = 'signup';
        authTitle.innerText = 'Sign Up';
        openModal(authModal);
    });

    // Логика формы (LocalStorage)
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = authUsername.value.trim();
        const pass = authPassword.value.trim();

        if (currentAuthMode === 'signup') {
            // Сохраняем в память браузера
            localStorage.setItem('lasles_user', user);
            localStorage.setItem('lasles_pass', pass);
            authMessage.style.color = 'green';
            authMessage.innerText = 'Success! Please Sign In.';
            setTimeout(() => {
                // Автоматически переключаем на окно входа
                currentAuthMode = 'signin';
                authTitle.innerText = 'Sign In';
                authMessage.innerText = '';
                authForm.reset();
            }, 1500);
        } else {
            // Проверяем данные
            const savedUser = localStorage.getItem('lasles_user');
            const savedPass = localStorage.getItem('lasles_pass');

            if (user === savedUser && pass === savedPass) {
                authMessage.style.color = 'green';
                authMessage.innerText = `Welcome back, ${user}!`;
                
                setTimeout(() => {
                    closeModal(authModal);
                    // Меняем кнопки в Header
                    btnSignIn.style.display = 'none';
                    btnSignUp.innerText = 'Logout';
                    btnSignUp.style.background = '#F53838';
                    btnSignUp.style.color = '#fff';
                }, 1000);
            } else {
                authMessage.style.color = '#F53838'; // Красный
                authMessage.innerText = 'Invalid username or password!';
            }
        }
    });

    // Проверка при загрузке страницы: если уже был залогинен
    const savedUser = localStorage.getItem('lasles_user');
    // Можно раскомментировать ниже, если хочешь, чтобы он оставался залогиненным после обновления
    /*
    if (savedUser) {
        btnSignIn.style.display = 'none';
        btnSignUp.innerText = 'Logout';
        btnSignUp.style.background = '#F53838';
        btnSignUp.style.color = '#fff';
    }
    */
});