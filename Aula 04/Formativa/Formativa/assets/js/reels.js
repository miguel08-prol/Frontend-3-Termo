// 1. Carregar Sidebar (Igual ao seu index.html)
async function initReels() {
    try {
        const response = await fetch('sidebar.html');
        const html = await response.text();
        document.getElementById('sidebar-placeholder').innerHTML = html;
        lucide.createIcons();
    } catch (e) { 
        console.error("Erro ao carregar sidebar.", e); 
    }
}
window.onload = initReels;

// Função do menu mobile
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (sidebar) sidebar.classList.toggle('show-sidebar');
    if (overlay) overlay.classList.toggle('active');
}

// 2. Lógica dos Reels (Play Automático, Clique e Duplo Clique)
document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();

    const videos = document.querySelectorAll('.reel-video');
    
    // Configura o IntersectionObserver para pausar/tocar vídeos ao rolar
    const observerOptions = {
        root: document.getElementById('reelsWrapper'),
        rootMargin: '0px',
        threshold: 0.7
    };

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                let playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => console.log("Autoplay retido."));
                }
            } else {
                video.pause();
                video.currentTime = 0; // Reinicia o vídeo ao passar
            }
        });
    }, observerOptions);

    videos.forEach(video => {
        videoObserver.observe(video);
        
        let lastClickTime = 0;
        
        video.addEventListener('click', function(e) {
            let currentTime = new Date().getTime();
            const container = this.closest('.video-box');
            
            // Duplo clique (menos de 300ms)
            if (currentTime - lastClickTime < 300) { 
                const bigHeart = container.querySelector('.big-heart');
                const likeBtn = container.querySelector('.like-btn');
                
                // Anima o coração no meio
                bigHeart.classList.remove('show-big-heart');
                void bigHeart.offsetWidth; 
                bigHeart.classList.add('show-big-heart');

                // Curte se não estiver curtido
                if (!likeBtn.classList.contains('liked')) {
                    toggleReelLike(likeBtn);
                }
            } else {
                // Clique único: Play/Pause (com um pequeno delay para não conflitar com o duplo clique)
                setTimeout(() => {
                    if (new Date().getTime() - lastClickTime >= 300) {
                        const playIcon = container.querySelector('.play-pause-icon');
                        const iconSvg = playIcon.querySelector('i');

                        if (this.paused) {
                            this.play();
                            iconSvg.setAttribute('data-lucide', 'play');
                            lucide.createIcons();
                            playIcon.classList.add('show');
                            setTimeout(() => playIcon.classList.remove('show'), 500);
                        } else {
                            this.pause();
                            iconSvg.setAttribute('data-lucide', 'pause');
                            lucide.createIcons();
                            playIcon.classList.add('show');
                        }
                    }
                }, 300);
            }
            lastClickTime = currentTime;
        });
    });
});

// 3. Sistema Visual de Curtidas do Reels
function toggleReelLike(button) {
    button.classList.toggle('liked');
    const countSpan = button.querySelector('.likes-count');
    let currentCount = countSpan.innerText;
    
    if(button.classList.contains('liked')) {
        if(!currentCount.includes('K') && !currentCount.includes('M')) {
            countSpan.innerText = parseInt(currentCount) + 1;
        }
    } else {
        if(!currentCount.includes('K') && !currentCount.includes('M')) {
            countSpan.innerText = parseInt(currentCount) - 1;
        }
    }
}