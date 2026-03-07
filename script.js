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

    // 4. 通用大圖相簿 Slider (支援多組：Wander/Gulu/Hione/客房列表)
    // 我們改用 function 處理，這樣傳入不同的 ID 就能各別運作
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

    // 執行第一組相簿 (全站通用)
    initBigGallery('galleryContainer', 'prevBtn', 'nextBtn', 'galleryTitle', 'currPage', 'totalPage');
    
    // 執行第二組相簿 (客房頁面：丸水棟專用)
    initBigGallery('galleryContainer2', 'prevBtn2', 'nextBtn2', 'galleryTitle2', 'currPage2', 'totalPage2');

    // 5. 房型列表小輪播 (客房列表頁面)
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
        } else if (track) {
            if(n) n.style.display = 'none';
            if(p) p.style.display = 'none';
        }
    });
});
// 手機版目的地選單：點擊展開住宿房型連結
    const submenuRows = document.querySelectorAll('.submenu-row');
    submenuRows.forEach(row => {
        row.addEventListener('click', function(e) {
            // 只有在手機尺寸下才觸發
            if (window.innerWidth <= 768) {
                // 如果點擊的是主連結，阻止一下跳轉以便觀察展開
                // e.preventDefault(); 
                this.classList.toggle('show-room');
                
                // 自動捲動讓展開的連結被看見
                if (this.classList.contains('show-room')) {
                    setTimeout(() => {
                        this.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 300);
                }
            }
        });
    });