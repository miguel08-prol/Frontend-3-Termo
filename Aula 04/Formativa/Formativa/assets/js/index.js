// Inicializa os ícones do Lucide
lucide.createIcons();

// ==========================================
// 1. SISTEMA DE LIKES DINÂMICOS
// ==========================================

// Atualiza o número de curtidas
function updateLikeCount(postElement, isAdding) {
    const countSpan = postElement.querySelector('.likes-count');
    if (!countSpan) return;

    // Pega o valor atual do atributo data-likes
    let currentLikes = parseInt(countSpan.getAttribute('data-likes'));
    
    // Soma ou subtrai
    if (isAdding) {
        currentLikes += 1;
    } else {
        currentLikes -= 1;
    }

    // Atualiza o atributo e o texto na tela formatado (ex: 1.250)
    countSpan.setAttribute('data-likes', currentLikes);
    countSpan.innerText = currentLikes.toLocaleString('pt-BR') + ' gostei';
}

// Clicar no ícone de coração
function toggleLike(icon) {
    const isActive = icon.classList.toggle('icon-active-heart');
    const postElement = icon.closest('.post');
    updateLikeCount(postElement, isActive);
}

// Clicar no ícone de salvar (bandeirinha)
function toggleSave(icon) {
    icon.classList.toggle('icon-active-save');
}

// Sistema de Double-Tap (Coração animado no meio da imagem)
let lastTap = 0;
function handleHeartPop(container) {
    const now = Date.now();
    if (now - lastTap < 300) {
        const pop = container.querySelector('.heart-pop');
        const postElement = container.closest('.post');
        const likeBtn = postElement.querySelector('.actions-left [data-lucide="heart"]');
        
        // Anima o coração grande
        if (pop) {
            pop.classList.add('active');
            setTimeout(() => pop.classList.remove('active'), 800);
        }
        
        // Se ainda não estiver curtido, curte e soma 1
        if (likeBtn && !likeBtn.classList.contains('icon-active-heart')) {
            likeBtn.classList.add('icon-active-heart');
            updateLikeCount(postElement, true);
        }
    }
    lastTap = now;
}

// ==========================================
// 2. SISTEMA DE CARROSSEL E VÍDEO
// ==========================================

// Função para dar Play/Pause em vídeos
function togglePlay(video) {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

// Objeto para guardar em qual slide cada carrossel está
const carouselStates = {};

function moveCarousel(carouselId, direction) {
    const track = document.getElementById(`track-${carouselId}`);
    const dotsContainer = document.getElementById(`dots-${carouselId}`);
    if (!track) return;

    const totalSlides = track.children.length;
    
    // Inicia no slide 0 se não existir no objeto
    if (carouselStates[carouselId] === undefined) {
        carouselStates[carouselId] = 0;
    }

    // Calcula o próximo slide
    let newIndex = carouselStates[carouselId] + direction;
    
    // Impede de passar dos limites
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= totalSlides) newIndex = totalSlides - 1;

    carouselStates[carouselId] = newIndex;

    // Move a esteira (track) de imagens
    track.style.transform = `translateX(-${newIndex * 100}%)`;

    // Atualiza a bolinha (dot) ativa
    if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === newIndex);
        });
    }
}

// ==========================================
// 3. SISTEMA DE STORIES REALISTAS
// ==========================================

// "Banco de dados" simulado dos Stories
const storyData = {
    'usuario1': [
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500',
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500'
    ],
    'natureza': [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500'
    ],
    'viagem': [
        'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=500',
        'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500',
        'https://images.unsplash.com/photo-1504150558240-0b4fd8946624?w=500'
    ]
};

let storyTimer;
let currentStoryUser = '';
let currentSlideIndex = 0;
let progressValue = 0;
let isStoryPaused = false;

function openStory(username) {
    const modal = document.getElementById('storyModal');
    // Verifica se o modal existe e se o usuário tem stories no nosso "banco"
    if (!modal || !storyData[username]) return;

    currentStoryUser = username;
    currentSlideIndex = 0;
    modal.style.display = 'flex';
    
    renderStoryUI();
    startStoryTimer();
}

// Desenha a imagem e as barras de progresso na tela
function renderStoryUI() {
    const img = document.getElementById('storyImg');
    const progressContainer = document.getElementById('storyProgressContainer');
    const slides = storyData[currentStoryUser];

    // Atualiza a imagem atual
    img.src = slides[currentSlideIndex];

    // Limpa e recria as barrinhas no topo
    progressContainer.innerHTML = '';
    slides.forEach((_, index) => {
        const segment = document.createElement('div');
        segment.className = 'story-progress-segment';
        
        const fill = document.createElement('div');
        fill.className = 'story-progress-fill';
        fill.id = `story-fill-${index}`;
        
        // Se for um story que já passou, deixa a barrinha cheia (100%)
        if (index < currentSlideIndex) {
            fill.style.width = '100%';
        }
        
        segment.appendChild(fill);
        progressContainer.appendChild(segment);
    });
}

// Inicia o tempo para a barrinha encher
function startStoryTimer() {
    clearInterval(storyTimer);
    progressValue = 0;
    
    storyTimer = setInterval(() => {
        if (isStoryPaused) return; // Se segurar o clique, pausa o tempo
        
        progressValue += 1; // Velocidade da barra
        const currentFill = document.getElementById(`story-fill-${currentSlideIndex}`);
        
        if (currentFill) {
            currentFill.style.width = progressValue + '%';
        }

        // Quando chega em 100%, avança de slide
        if (progressValue >= 100) {
            changeStorySlide(1); 
        }
    }, 30);
}

// Função chamada ao clicar na esquerda (-1) ou na direita (1)
function changeStorySlide(direction) {
    const slides = storyData[currentStoryUser];
    
    // Se tentar voltar no primeiro slide, reseta o tempo daquele slide
    if (direction === -1 && currentSlideIndex === 0) {
        progressValue = 0;
        return; 
    }

    currentSlideIndex += direction;

    // Verifica se os slides desse usuário acabaram
    if (currentSlideIndex >= slides.length) {
        closeStory(); 
    } else {
        renderStoryUI();
        startStoryTimer();
    }
}

function closeStory() {
    const modal = document.getElementById('storyModal');
    if (modal) modal.style.display = 'none';
    clearInterval(storyTimer);
}

// Sistema de "Segurar para Pausar" os Stories
const storyViewer = document.getElementById('storyViewerArea');
if(storyViewer) {
    // Para Computador (Clicar e segurar o botão do mouse)
    storyViewer.addEventListener('mousedown', () => isStoryPaused = true);
    storyViewer.addEventListener('mouseup', () => isStoryPaused = false);
    storyViewer.addEventListener('mouseleave', () => isStoryPaused = false);
    
    // Para Celular (Tocar e segurar na tela)
    storyViewer.addEventListener('touchstart', () => isStoryPaused = true);
    storyViewer.addEventListener('touchend', () => isStoryPaused = false);
}

// Navegação usando as setas do teclado (Esquerda / Direita)
document.addEventListener('keydown', (event) => {
    const modal = document.getElementById('storyModal');
    // Só aciona se o modal de stories estiver aberto
    if (modal && modal.style.display === 'flex') {
        if (event.key === 'ArrowLeft') {
            changeStorySlide(-1);
        } else if (event.key === 'ArrowRight') {
            changeStorySlide(1);
        }
    }
});

// ==========================================
// 5. SISTEMA DE MENU MOBILE
// ==========================================

function toggleSidebar() {
    // Como a sidebar é carregada por outro arquivo, buscamos ela no momento do clique
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (sidebar) {
        sidebar.classList.toggle('show-sidebar');
    }
    
    if (overlay) {
        overlay.classList.toggle('active');
    }
}