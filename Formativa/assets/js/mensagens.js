lucide.createIcons();

const input = document.getElementById('messageInput');
const container = document.getElementById('chatMessages');
const messengerBox = document.querySelector('.messenger-box');

if (input) {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && input.value.trim() !== "") {
            sendMessage(input.value, 'sent');
            input.value = "";
            
            setTimeout(() => {
                sendMessage("Recebi a tua mensagem! 👍", 'received');
            }, 1000);
        }
    });
}

function sendMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', type);
    msgDiv.textContent = text;
    container.appendChild(msgDiv);
    
    container.scrollTop = container.scrollHeight;
}

document.querySelectorAll('.chat-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.chat-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        if (window.innerWidth <= 768) {
            messengerBox.classList.add('active-chat');
        }
    });
});

const chatHeader = document.querySelector('.chat-window-header');
if (chatHeader) {
    const backBtn = document.createElement('div');
    backBtn.innerHTML = '<i data-lucide="chevron-left" class="mobile-back-btn"></i>';
    chatHeader.prepend(backBtn);
    
    backBtn.addEventListener('click', () => {
        messengerBox.classList.remove('active-chat');
    });
    
    lucide.createIcons();
}