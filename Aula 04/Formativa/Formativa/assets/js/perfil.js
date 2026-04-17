// Inicializa os ícones do Lucide
lucide.createIcons();

// --- SISTEMA DE ABAS (TABS) ---
function switchTab(tabId, elementClicked) {
    // 1. Remove a classe 'active' de todos os botões (abas)
    const allTabs = document.querySelectorAll('.tab-item');
    allTabs.forEach(tab => {
        tab.classList.remove('active');
    });

    // 2. Esconde todos os conteúdos das abas
    const allContents = document.querySelectorAll('.tab-content');
    allContents.forEach(content => {
        content.classList.remove('active-content');
    });

    // 3. Adiciona a classe 'active' na aba que foi clicada
    elementClicked.classList.add('active');

    // 4. Mostra o conteúdo correspondente
    const targetContent = document.getElementById('tab-' + tabId);
    if (targetContent) {
        targetContent.classList.add('active-content');
    }
}