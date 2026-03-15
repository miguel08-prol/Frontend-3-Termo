// Inicializa os ícones do Lucide
lucide.createIcons();

// Carrega a Sidebar Global (Tal como no Perfil e no Feed)
async function init() {
    try {
        const response = await fetch('sidebar.html');
        const html = await response.text();
        document.getElementById('sidebar-placeholder').innerHTML = html;
        lucide.createIcons();
    } catch (e) { 
        console.error("Erro ao carregar a sidebar. Certifique-se de estar a usar um servidor local."); 
    }
}

// Executa a função ao carregar a página
window.onload = init;

// Função para abrir e fechar o menu no telemóvel
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('show-sidebar');
        overlay.classList.toggle('active');
    }
}