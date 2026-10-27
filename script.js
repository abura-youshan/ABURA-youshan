document.addEventListener('DOMContentLoaded', () => {
    const menuOpen = document.getElementById('menu-open');
    const menuClose = document.getElementById('menu-close');
    const fullMenu = document.getElementById('full-menu');
    const toggleDest = document.getElementById('toggle-destinations');
    const destSubmenu = document.getElementById('destination-submenu');
    const mainNav = document.getElementById('main-nav');

    // 1. 導覽列下滑變色邏輯
    window.addEventListener('scroll', () => {
        if (mainNav) {
            if (!mainNav.classList.contains('destination-nav')) {
                if (window.scrollY > 50) mainNav.classList.add('scrolled');
                else mainNav.classList.remove('scrolled');
            }
        }
    });

    // 2. 漢堡選單邏輯
    if (menuOpen && fullMenu) {
        menuOpen.onclick = () => {
            fullMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        };
    }
    if (menuClose && fullMenu) {
        menuClose.onclick = () => {
            fullMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        };
    }
    // [建議新增]：點擊選單內的任何連結時，自動關閉選單並恢復捲軸
    // 避免使用者跳轉後，頁面還是鎖死不能滑
    const allMenuLinks = fullMenu.querySelectorAll('a');
    allMenuLinks.forEach(link => {
        link.onclick = () => {
            fullMenu.classList.remove('active');
            document.body.style.overflow = '';
        };
    });
    // 3. 目的地子選單切換
    if (toggleDest && destSubmenu) {
        toggleDest.onclick = (e) => {
            e.preventDefault();
            destSubmenu.classList.toggle('active');
            const icon = toggleDest.querySelector('.submenu-icon');
            if (icon) {
                icon.style.transform = destSubmenu.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        };
    }

    // 4. 通用大圖相簿 Slider
    function initBigGallery(containerId, prevId, nextId, titleId, currPageId, totalPageId) {
        const gallery = document.getElementById(containerId);
        const nextBtn = document.getElementById(nextId);
        const prevBtn = document.getElementById(prevId);

        if (gallery && nextBtn && prevBtn) {
            const items = gallery.querySelectorAll('.gallery-item');
            const total = items.length;
            const totalPageElem = document.getElementById(totalPageId);
            const currPageElem = document.getElementById(currPageId);
            const galleryTitleElem = document.getElementById(titleId);

            if (total === 0) return;
            let idx = 0;

            if (totalPageElem) totalPageElem.textContent = total;

            const update = () => {
                const containerWidth = gallery.parentElement.offsetWidth;
                gallery.style.transform = `translateX(${-idx * containerWidth}px)`;
                if (currPageElem) currPageElem.textContent = idx + 1;
                if (galleryTitleElem) galleryTitleElem.textContent = items[idx].getAttribute('data-title');
            };

            nextBtn.onclick = () => { idx = (idx + 1) % total; update(); };
            prevBtn.onclick = () => { idx = (idx - 1 + total) % total; update(); };
            
            window.addEventListener('resize', update); 
            update();
        }
    }

    initBigGallery('galleryContainer', 'prevBtn', 'nextBtn', 'galleryTitle', 'currPage', 'totalPage');
    initBigGallery('galleryContainer2', 'prevBtn2', 'nextBtn2', 'galleryTitle2', 'currPage2', 'totalPage2');

    // 5. 房型列表小輪播
    document.querySelectorAll('.room-card').forEach(card => {
        const track = card.querySelector('.photo-track');
        const imgs = card.querySelectorAll('.photo-track img');
        const n = card.querySelector('.next-btn');
        const p = card.querySelector('.prev-btn');

        if (track && imgs.length > 1) {
            let c = 0;
            if(n) {
                n.onclick = () => { 
                    c = (c + 1) % imgs.length; 
                    track.style.transform = `translateX(${-c * 100}%)`; 
                };
            }
            if(p) {
                p.onclick = () => { 
                    c = (c - 1 + imgs.length) % imgs.length; 
                    track.style.transform = `translateX(${-c * 100}%)`; 
                };
            }
        }
    });

    // 手機版目的地選單展開
    const submenuRows = document.querySelectorAll('.submenu-row');
    submenuRows.forEach(row => {
        row.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                this.classList.toggle('show-room');
                if (this.classList.contains('show-room')) {
                    setTimeout(() => {
                        this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 300);
                }
            }
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    // ... (維持您原本的 1-5 點邏輯) ...

    // 6. 手機/平板滑動自動顯示左右箭頭 (移入此處)
    if (window.innerWidth <= 1024) {
        const roomCards = document.querySelectorAll('.room-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.target.classList.toggle('is-focused', entry.isIntersecting);
            });
        }, { threshold: 0.4 });
        roomCards.forEach(card => observer.observe(card));
    }

    // 7. [優化] 子導覽列平滑滾動修正
    document.querySelectorAll('.sub-nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // 檢查是否包含 #，且目標元素存在
            if (href.includes('#')) {
                const targetId = href.substring(href.indexOf('#'));
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault(); // 阻止瀏覽器重載
                    
                    const headerOffset = 130; 
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // 更新網址列
                    history.pushState(null, null, targetId);
                }
            }
        });
    });
});
// 預訂按鈕：滑鼠移上去（手機點一下）展開「線上訂房」與「LINE 客服」
document.addEventListener('DOMContentLoaded', () => {
    const BOOKING = 'https://booking.abura-youshan.com/booking';
    // 各頁對應的館別與 LINE（沒列到的頁面：全部館別＋品牌 LINE）
    const PAGES = {
        '/wander/': { area: 1, line: '@413tqyhr' },
        '/rooms-list/': { area: 1, line: '@413tqyhr' },
        '/gulu/': { area: 2 },
        '/hione/': { area: 3 },
    };
    const conf = PAGES[location.pathname] || {};
    const bookUrl = BOOKING + (conf.area ? '?area=' + conf.area : '');
    const lineUrl = 'https://line.me/R/ti/p/' + (conf.line || '@632kxjjw');

    document.querySelectorAll('.btn-reserve').forEach((btn) => {
        const box = btn.parentElement;
        box.classList.add('reserve-dropdown');
        btn.setAttribute('aria-haspopup', 'true');
        btn.setAttribute('aria-expanded', 'false');
        const menu = document.createElement('div');
        menu.className = 'reserve-menu';
        menu.innerHTML =
            '<a href="' + bookUrl + '" target="_blank" rel="noopener"><i class="fa-regular fa-calendar-check"></i><span>線上訂房<small>即時查詢空房・線上預訂</small></span></a>' +
            '<a href="' + lineUrl + '" target="_blank" rel="noopener" class="reserve-line"><i class="fa-brands fa-line"></i><span>LINE 客服<small>有問題直接問我們</small></span></a>';
        box.appendChild(menu);
        const setOpen = (on) => { box.classList.toggle('open', on); btn.setAttribute('aria-expanded', on ? 'true' : 'false'); };
        // 按鈕本身不直接跳頁：電腦滑過就展開，手機點一下展開、再點收合
        btn.addEventListener('click', (e) => { e.preventDefault(); setOpen(!box.classList.contains('open')); });
        document.addEventListener('click', (e) => { if (!box.contains(e.target)) setOpen(false); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
    });
});
