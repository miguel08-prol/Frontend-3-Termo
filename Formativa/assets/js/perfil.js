lucide.createIcons();

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
        if(pop) {
            pop.classList.add('active');
            setTimeout(() => pop.classList.remove('active'), 800);
        }
    }
    lastTap = now;
}