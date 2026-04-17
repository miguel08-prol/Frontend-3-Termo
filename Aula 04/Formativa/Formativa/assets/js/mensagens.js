// Inicializa os ícones
lucide.createIcons();

// --- INICIA A SIDEBAR ---
async function init() {
    try {
        const response = await fetch('sidebar.html');
        const html = await response.text();
        document.getElementById('sidebar-placeholder').innerHTML = html;
        lucide.createIcons();
    } catch (e) { 
        console.error("Erro ao carregar a sidebar."); 
    }
}
window.onload = init;

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar && overlay) {
        sidebar.classList.toggle('show-sidebar');
        overlay.classList.toggle('active');
    }
}

// --- LÓGICA DO CHAT E ROBÔ SURPRESA ---
const input = document.getElementById('messageInput');
const container = document.getElementById('chatMessages');
const messengerBox = document.querySelector('.messenger-box');

// Lista de respostas surpresas do bot
const botResponses = [
    "Sério?? Não acredito nisso! 😱",
    "Hahaha, faz todo sentido! 😂",
    "Eita! Isso dá um post pro feed hein? 📸",
    "Vou fingir que não li isso... 👀",
    "Concordo 100%! 🔥",
    "Nossa, que babado! Conta mais! ☕",
    "Amei a ideia! 💡",
    "Mano, que loucura... kkkkkk"
];

// Ouve quando carregas no "Enter"
if (input) {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && input.value.trim() !== "") {
            
            // 1. Envia a tua mensagem
            sendMessage(input.value, 'sent');
            input.value = "";
            
            // 2. O bot "pensa" e responde depois de 1.5 segundos
            setTimeout(() => {
                const respostaAleatoria = botResponses[Math.floor(Math.random() * botResponses.length)];
                sendMessage(respostaAleatoria, 'received');
            }, 1500); 
        }
    });
}

// Botão de enviar Coração
function sendHeart() {
    sendMessage("❤️", 'sent');
    
    setTimeout(() => {
        sendMessage("Awwn, também gosto de você! 🥰", 'received');
    }, 1200);
}

// Função que cria as bolhas de mensagem na tela
function sendMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', type);
    msgDiv.textContent = text;
    container.appendChild(msgDiv);
    
    // Faz scroll automaticamente para a última mensagem
    container.scrollTop = container.scrollHeight;
}

// --- TROCAR DE CONVERSA ---
document.querySelectorAll('.chat-item').forEach(item => {
    item.addEventListener('click', () => {
        // Remove 'active' de todos e coloca no clicado
        document.querySelectorAll('.chat-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        // Pega os dados do contacto clicado
        const userName = item.querySelector('.chat-name').innerText;
        const userImg = item.querySelector('img').src;
        
        // Atualiza o topo do chat com a foto e o nome da pessoa
        document.getElementById('currentChatName').innerText = userName;
        document.getElementById('currentChatImg').src = userImg;
        
        // Limpa o chat para iniciar conversa
        container.innerHTML = `<div class="message received">Oi! Vi que ficaste online.</div>`;

        // Se for telemóvel, abre a janela sobreposta
        if (window.innerWidth <= 768) {
            messengerBox.classList.add('active-chat');
        }
    });
});

// --- BOTÃO DE VOLTAR NO TELEMÓVEL ---
const chatHeader = document.querySelector('.chat-window-header');
if (chatHeader) {
    // Cria a setinha de voltar dinamicamente
    const backBtn = document.createElement('div');
    backBtn.innerHTML = '<i data-lucide="chevron-left" class="mobile-back-btn"></i>';
    chatHeader.prepend(backBtn); // Adiciona antes da foto
    
    lucide.createIcons();
    
    // Fecha o chat no telemóvel ao clicar
    backBtn.addEventListener('click', () => {
        messengerBox.classList.remove('active-chat');
    });
}