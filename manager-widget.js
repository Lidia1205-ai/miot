/*
 * Форма «Связаться с менеджером» (виджет GetCourse id=1623395).
 * Подключается на любой странице одним тегом <script src=".../manager-widget.js"></script>.
 * Делает следующее:
 *   1) добавляет на страницу самодостаточную модалку с формой менеджера;
 *   2) превращает все CTA-ссылки на t.me/TatyBondar (кроме иконок в футере) в открытие этой формы.
 * Идемпотентен и не конфликтует с уже существующими модалками/функцией gcOpen.
 */
(function () {
    var WIDGET_ID = '1623395';
    var SCRIPT_HASH = '849d1181301983a78d79cf770d5e46dc86cec3ae';
    var MODAL_ID = 'gcModalManager';

    // 1. Стили модалки (только если их ещё нет на странице)
    function injectStyles() {
        if (document.getElementById('gc-modal-style')) return;
        var css = ''
            + '.gc-modal{display:none;position:fixed;inset:0;z-index:9000;align-items:center;justify-content:center;}'
            + '.gc-modal.is-open{display:flex;}'
            + '.gc-modal__overlay{position:absolute;inset:0;background:rgba(10,20,40,.7);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);}'
            + '.gc-modal__box{position:relative;z-index:1;background:#fff;border-radius:20px;padding:40px 32px 32px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto;margin:16px;box-shadow:0 32px 64px -16px rgba(10,30,80,.4);}'
            + '.gc-modal__close{position:absolute;top:14px;right:16px;background:none;border:none;font-size:22px;line-height:1;cursor:pointer;color:#7a869a;padding:4px 8px;border-radius:8px;transition:color .15s,background .15s;}'
            + '.gc-modal__close:hover{color:#0f172a;background:#eef2f7;}'
            + '.gc-modal__title{font-family:inherit;font-size:1.25rem;font-weight:700;color:#0f172a;margin:0 0 20px;line-height:1.3;}'
            + '.gc-modal__body{min-height:80px;}'
            + '@media(max-width:600px){.gc-modal__box{padding:36px 16px 24px;}}';
        var style = document.createElement('style');
        style.id = 'gc-modal-style';
        style.textContent = css;
        document.head.appendChild(style);
    }

    // 2. Сама модалка с формой менеджера
    function buildModal() {
        if (document.getElementById(MODAL_ID)) return;
        var modal = document.createElement('div');
        modal.id = MODAL_ID;
        modal.className = 'gc-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', 'Связаться с менеджером');
        modal.innerHTML =
            '<div class="gc-modal__overlay" data-gc-close></div>'
            + '<div class="gc-modal__box">'
            + '<button class="gc-modal__close" data-gc-close aria-label="Закрыть">✕</button>'
            + '<div class="gc-modal__title">Связаться с менеджером</div>'
            + '<div class="gc-modal__body"></div>'
            + '</div>';
        document.body.appendChild(modal);

        // Подгружаем виджет GetCourse внутрь формы
        var s = document.createElement('script');
        s.id = SCRIPT_HASH;
        s.src = 'https://online.agape-course.ru/pl/lite/widget/script?id=' + WIDGET_ID;
        s.onload = function () {
            var fn = window['startWidget' + SCRIPT_HASH];
            if (typeof fn === 'function') fn();
        };
        modal.querySelector('.gc-modal__body').appendChild(s);
    }

    // 3. Открытие/закрытие
    window.gcOpen = window.gcOpen || function (id) {
        var m = document.getElementById(id);
        if (!m) return;
        m.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    };
    function closeModal(m) {
        m.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    // 4. Превращаем CTA-ссылки на менеджера в открытие формы (кроме футер-иконок)
    function rewireLinks() {
        var links = document.querySelectorAll('a[href*="t.me/TatyBondar"]');
        links.forEach(function (a) {
            if (a.closest('.messenger-grid') || a.classList.contains('messenger-item')) return;
            if (a.dataset.gcWired) return;
            a.dataset.gcWired = '1';
            a.addEventListener('click', function (e) {
                e.preventDefault();
                window.gcOpen(MODAL_ID);
            });
        });
    }

    function init() {
        injectStyles();
        buildModal();
        rewireLinks();

        // Закрытие: крестик, оверлей, Escape (вешаем один раз)
        if (!window.__gcCloseBound) {
            window.__gcCloseBound = true;
            document.addEventListener('click', function (e) {
                var t = e.target;
                if (t && t.nodeType === 1 && (t.hasAttribute('data-gc-close') || t.classList.contains('gc-modal__overlay'))) {
                    var m = t.closest('.gc-modal');
                    if (m) closeModal(m);
                }
            });
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') {
                    document.querySelectorAll('.gc-modal.is-open').forEach(closeModal);
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
