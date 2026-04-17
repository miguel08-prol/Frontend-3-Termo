// Inicializa os ícones do Lucide
lucide.createIcons();

// --- CARREGA A SIDEBAR GLOBAL ---
async function init() {
    try {
        const response = await fetch('sidebar.html');
        const html = await response.text();
        document.getElementById('sidebar-placeholder').innerHTML = html;
        lucide.createIcons(); // Recarrega os ícones após a sidebar entrar
    } catch (e) { 
        console.error("Erro ao carregar a sidebar."); 
    }
}

window.onload = init;

// --- MENU MOBILE ---
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebar && overlay) {
        sidebar.classList.toggle('show-sidebar');
        overlay.classList.toggle('active');
    }
}

// --- INTERAÇÃO DO BOTÃO DE SEGUIR ---
function toggleFollow(btn) {
    // Se já tem a classe 'following', ele remove (Deixa de seguir)
    if (btn.classList.contains('following')) {
        btn.classList.remove('following');
        btn.innerText = "Seguir";
    } else {
        // Se não tem, ele adiciona (Começa a seguir)
        btn.classList.add('following');
        btn.innerText = "Seguindo";
    }
}