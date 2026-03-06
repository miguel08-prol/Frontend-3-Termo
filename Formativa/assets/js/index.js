lucide.createIcons();

function togglePlay(video) {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

function toggleLike(icon) {
    icon.classList.toggle('icon-active-heart');
}

function toggleSave(icon) {
    icon.classList.toggle('icon-active-save');
}

let lastTap = 0;
function handleHeartPop(container) {
    const now = Date.now();
    if (now - lastTap < 300) {
        const pop = container.querySelector('.heart-pop');
        const likeBtn = container.parentElement.querySelector('[data-lucide="heart"]');
        
        pop.classList.add('active');
        likeBtn.classList.add('icon-active-heart');
        
        setTimeout(() => {
            pop.classList.remove('active');
        }, 800);
    }
    lastTap = now;
}

let storyTimer;
function openStory(imgUrl) {
    const modal = document.getElementById('storyModal');
    const img = document.getElementById('storyImg');
    const progress = document.getElementById('storyProgress');
    
    modal.style.display = 'flex';
    img.src = imgUrl;
    progress.style.width = '0%';
    
    let width = 0;
    clearInterval(storyTimer);
    storyTimer = setInterval(() => {
        if (width >= 100) {
            closeStory();
        } else {
            width++;
            progress.style.width = width + '%';
        }
    }, 30); 
}

function closeStory() {
    document.getElementById('storyModal').style.display = 'none';
    clearInterval(storyTimer);
}