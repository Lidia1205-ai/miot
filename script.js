document.addEventListener('DOMContentLoaded', () => {
    // Анимация при скролле (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(el => observer.observe(el));

    // Простой мобильный бургер меню
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            nav.classList.toggle('nav-open');
            mobileBtn.classList.toggle('is-active');
        });
    }

    // Изменение хедера при скролле
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // Плавный скролл для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Закрываем мобильное меню при клике
                if (nav.classList.contains('nav-open')) {
                    nav.classList.remove('nav-open');
                    mobileBtn.classList.remove('is-active');
                }
            }
        });
    });

    // --- Parallax Background Animations ---
    const bgGraphics = document.getElementById('bg-graphics');
    if (bgGraphics) {
        const shapes = bgGraphics.querySelectorAll('.shape');

        // Массив множителей скорости для каждой фигуры
        const speeds = [0.03, 0.05, 0.02, 0.06, 0.01];

        // Эффект мыши
        let mouseX = 0;
        let mouseY = 0;
        let couseX = 0;
        let couseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX - window.innerWidth / 2;
            mouseY = e.clientY - window.innerHeight / 2;
        });

        const animateParallax = () => {
            couseX += (mouseX - couseX) * 0.1;
            couseY += (mouseY - couseY) * 0.1;

            shapes.forEach((shape, index) => {
                const speed = speeds[index] || 0.03;
                const x = (couseX * speed).toFixed(2);
                const y = (couseY * speed).toFixed(2);
                shape.style.transform = `translate(${x}px, ${y}px)`;
            });

            requestAnimationFrame(animateParallax);
        };

        // Запуск анимации для мыши если мы не на смартфоне
        if (window.innerWidth > 768) {
            animateParallax();
        }

        // Эффект плавного параллакса при скролле
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            shapes.forEach((shape, index) => {
                const speed = speeds[index] * 1.5;
                const yPos = -(scrolled * speed);
                // Комбинируем transform (нужно аккуратно если mouse parallax тоже работает)
                if (window.innerWidth <= 768) {
                    shape.style.transform = `translateY(${yPos}px)`;
                }
                // Если десктоп, то скролл эффект применяется через margin для независимости или тоже transform. 
                // Остановимся на простом - сдвигаем весь контейнер
            });

            // Простой параллакс всего контейнера 
            bgGraphics.style.transform = `translateY(${scrolled * 0.15}px)`;
        });
    }
});

// Аккордеон FAQ
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;

        // Если нужно чтобы открыт был только один
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(faq => {
            faq.classList.remove('active');
        });

        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Фильтрация программ обучения (Слайдер)
const filterBtns = document.querySelectorAll('.filter-btn');
const programCards = document.querySelectorAll('.program-card');

// Инициализируем фильтр при загрузке (если есть активный)
if (programCards.length > 0 && filterBtns.length > 0) {
    const activeBtn = document.querySelector('.filter-btn.active');
    if (activeBtn) {
        const initialCat = activeBtn.getAttribute('data-filter');
        programCards.forEach(card => {
            if (initialCat === 'all' || card.getAttribute('data-category') === initialCat) {
                card.style.display = ''; // Allow CSS to control display
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Обработка клика по кнопкам фильтра
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            programCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || filterValue === category) {
                    card.style.display = ''; // Allow CSS to control display
                    card.style.opacity = '0';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.display = 'none';
                }
            });

            // Скроллим слайдер обратно в начало
            const slider = document.getElementById('programsSlider');
            if (slider) {
                slider.scrollTo({ left: 0, behavior: 'smooth' });
            }
        });
    });
}

// Floating Video Widget & Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    const videoWidget = document.getElementById('floatingVideoWidget');
    const closeVideoBtn = document.getElementById('closeFloatingVideo');
    const promoVideo = document.getElementById('promoVideo');
    const leadModal = document.getElementById('leadModal');
    const closeLeadModal = document.getElementById('closeLeadModal');
    const leadForm = document.getElementById('leadForm');

    let modalShown = false;
    let widgetDismissed = sessionStorage.getItem('promoVideoDismissed') === 'true';

    // Show widget when scrolling down a bit, if not dismissed
    if (videoWidget && !widgetDismissed) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300 && !widgetDismissed) {
                videoWidget.classList.add('show');
            } else if (window.scrollY <= 300) {
                videoWidget.classList.remove('show');
            }
        });
    }

    if (promoVideo) {
        promoVideo.addEventListener('timeupdate', () => {
            // Check if video reached 20 seconds and modal hasn't been shown yet
            if (promoVideo.currentTime >= 20 && !modalShown && !widgetDismissed) {
                if (leadModal) {
                    leadModal.classList.add('show');
                    promoVideo.pause(); // Pause video when modal opens
                    modalShown = true; // Prevents modal from popping up again
                }
            }
        });

        promoVideo.addEventListener('ended', () => {
            closeWidget();
        });
    }

    function closeWidget() {
        if (videoWidget) {
            videoWidget.classList.remove('show');
            if (promoVideo) promoVideo.pause();
            widgetDismissed = true;
            sessionStorage.setItem('promoVideoDismissed', 'true');
        }
    }

    if (closeVideoBtn) {
        closeVideoBtn.addEventListener('click', closeWidget);
    }

    if (closeLeadModal) {
        closeLeadModal.addEventListener('click', () => {
            if (leadModal) leadModal.classList.remove('show');
        });
    }

    // Close modal on outside click
    if (leadModal) {
        leadModal.addEventListener('click', (e) => {
            if (e.target === leadModal) {
                leadModal.classList.remove('show');
            }
        });
    }

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            window.open('https://t.me/TatyBondar', '_blank');
            if (leadModal) leadModal.classList.remove('show');
            leadForm.reset();
            closeWidget();
        });
    }

    // Certificates Slider Logic
    const certSlider = document.getElementById('certificatesSlider');
    const certPrev = document.getElementById('certPrev');
    const certNext = document.getElementById('certNext');

    if (certSlider && certPrev && certNext) {
        const scrollAmount = 350; // cert-card width + gap

        certNext.addEventListener('click', () => {
            certSlider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        certPrev.addEventListener('click', () => {
            certSlider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        // Click on image to open in full size
        certSlider.querySelectorAll('img').forEach(img => {
            img.addEventListener('click', () => {
                window.open(img.src, '_blank');
            });
        });
    }

    // Community Video Modal Logic
    const communityVideoModal = document.getElementById('communityVideoModal');
    const communityVideo = document.getElementById('communityVideo');
    const closeCommunityVideo = document.getElementById('closeCommunityVideo');
    const videoMockups = document.querySelectorAll('.video-mockup');

    if (communityVideoModal && communityVideo && closeCommunityVideo) {
        videoMockups.forEach(mockup => {
            mockup.addEventListener('click', () => {
                const videoSrc = mockup.getAttribute('data-video');
                if (videoSrc) {
                    communityVideo.src = videoSrc;
                    communityVideoModal.classList.add('show');
                    communityVideo.play();
                }
            });
        });

        const closeGalleryModal = () => {
            communityVideoModal.classList.remove('show');
            communityVideo.pause();
            communityVideo.src = "";
        };

        closeCommunityVideo.addEventListener('click', closeGalleryModal);

        communityVideoModal.addEventListener('click', (e) => {
            if (e.target === communityVideoModal) {
                closeGalleryModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && communityVideoModal.classList.contains('show')) {
                closeGalleryModal();
            }
        });
    }
});
