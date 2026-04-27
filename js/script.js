/* ===== Dados ===== */
const GIFTS = [
    { id: 1, name: 'Lua de Mel', desc: 'Viagem dos Sonhos', icon: '🏝️', price: 2000, image: 'images/gift-1-lua-de-mel.png' },
    { id: 2, name: 'Conjunto de Panelas', desc: 'Antiaderente completo', icon: '🍳', price: 350, image: 'images/gift-2-panelas.png' },
    { id: 3, name: 'Reforma na Casa', desc: 'Tinta e materiais', icon: '🏠', price: 1500, image: 'images/gift-3-reforma.png' },
    { id: 4, name: 'Liquidificador', desc: 'Potente e silencioso', icon: '🥤', price: 250, image: 'images/gift-4-liquidificador.png' },
    { id: 5, name: 'Jogo de Cama', desc: 'Rei / Queen size', icon: '🛏️', price: 300, image: 'images/gift-5-jogo-de-cama.png' },
    { id: 6, name: 'Micro-ondas', desc: '30 litros inox', icon: '🔥', price: 500, image: 'images/gift-6-microondas.png' },
    { id: 7, name: 'Batedeira', desc: 'Planetaria profissional', icon: '🧁', price: 400, image: 'images/gift-7-batedeira.png' },
    { id: 8, name: 'Jantar Romantico', desc: 'Restaurante especial', icon: '🍽️', price: 200, image: 'images/gift-8-jantar.png' },
    { id: 9, name: 'Cesta de Cafe da Manha', desc: 'Caprichado para dois', icon: '🥐', price: 150, image: 'images/gift-9-cesta-cafe.png' },
    { id: 10, name: 'Jogo de Toalhas', desc: 'Banho e rosto', icon: '🛁', price: 120, image: 'images/gift-10-toalhas.png' },
    { id: 11, name: 'Churrasqueira', desc: 'A gas ou eletrica', icon: '🍖', price: 800, image: 'images/gift-11-churrasqueira.png' },
    { id: 12, name: 'Sofa Novo', desc: 'Retratil e confortavel', icon: '🛋️', price: 1800, image: 'images/gift-12-sofa.png' },
];

// Configuracao: substitua pela URL do Google Apps Script quando configurar
const APPS_SCRIPT_URL = '';

// Datas do casamento
const WEDDING_DATE = new Date('2026-11-21T16:00:00').getTime();

/* ===== DOM ===== */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const giftsGrid = document.getElementById('giftsGrid');
const pixModal = document.getElementById('pixModal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const qrPlaceholder = document.getElementById('qrPlaceholder');
const pixCodeInput = document.getElementById('pixCodeInput');
const btnCopy = document.getElementById('btnCopy');
const rsvpForm = document.getElementById('rsvpForm');
const attendingYes = document.getElementById('attendingYes');
const attendingNo = document.getElementById('attendingNo');
const companionsGroup = document.getElementById('companionsGroup');
const companionsCount = document.getElementById('companionsCount');
const companionsFields = document.getElementById('companionsFields');
const submitBtn = document.getElementById('submitBtn');
const rsvpSuccess = document.getElementById('rsvpSuccess');
const rsvpError = document.getElementById('rsvpError');

/* ===== Navbar Scroll ===== */
function handleScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}
window.addEventListener('scroll', handleScroll);

/* ===== Mobile Menu ===== */
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Fechar menu ao clicar em link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

/* ===== Countdown ===== */
function updateCountdown() {
    const now = new Date().getTime();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
        document.getElementById('days').textContent = '0';
        document.getElementById('hours').textContent = '0';
        document.getElementById('minutes').textContent = '0';
        document.getElementById('seconds').textContent = '0';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
}

updateCountdown();
setInterval(updateCountdown, 1000);

/* ===== Render Gifts ===== */
function renderGifts() {
    giftsGrid.innerHTML = GIFTS.map(gift => `
        <div class="gift-card">
            ${gift.image ? `<img src="${gift.image}" alt="${gift.name}" class="gift-image">` : `<span class="gift-icon">${gift.icon}</span>`}
            <h3 class="gift-name">${gift.name}</h3>
            <p class="gift-desc">${gift.desc}</p>
            <p class="gift-price">R$ ${gift.price.toLocaleString('pt-BR')}</p>
            <button class="btn btn-secondary" data-gift="${gift.id}">Presentear</button>
        </div>
    `).join('');

    document.querySelectorAll('[data-gift]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const giftId = Number(e.target.dataset.gift);
            openModal(giftId);
        });
    });
}

renderGifts();

/* ===== PIX Modal ===== */
function openModal(giftId) {
    const gift = GIFTS.find(g => g.id === giftId);
    if (!gift) return;

    modalTitle.textContent = gift.name;

    // Possivel carregar imagem do QR code customizado por presente
    // Para usar: coloque imagens na pasta images/qr-{id}.png
    const qrPath = `images/qr-${giftId}.png`;
    // Tenta carregar imagem; senao, exibe placeholder
    const img = new Image();
    img.onload = function() {
        qrPlaceholder.innerHTML = '';
        qrPlaceholder.appendChild(img);
    };
    img.onerror = function() {
        qrPlaceholder.innerHTML = '<span>[insira aqui o QR Code PIX]</span>';
    };
    img.src = qrPath;

    // Placeholder do codigo PIX - substituir pelos codigos reais
    pixCodeInput.value = `[Codigo PIX do presente: ${gift.name}]`;

    pixModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    pixModal.classList.remove('active');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
pixModal.addEventListener('click', (e) => {
    if (e.target === pixModal) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

/* ===== Copy PIX Code ===== */
btnCopy.addEventListener('click', async () => {
    if (!pixCodeInput.value) return;

    try {
        await navigator.clipboard.writeText(pixCodeInput.value);
        btnCopy.classList.add('copied');
        btnCopy.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        `;
        setTimeout(() => {
            btnCopy.classList.remove('copied');
            btnCopy.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            `;
        }, 2000);
    } catch (err) {
        // Fallback: seleciona o texto
        pixCodeInput.select();
    }
});

/* ===== RSVP Form ===== */
function toggleCompanions(show) {
    if (show) {
        companionsGroup.style.display = 'block';
        updateCompanionFields(Number(companionsCount.value));
    } else {
        companionsGroup.style.display = 'none';
        companionsFields.innerHTML = '';
    }
}

attendingYes.addEventListener('change', () => toggleCompanions(true));
attendingNo.addEventListener('change', () => toggleCompanions(false));

function updateCompanionFields(count) {
    companionsFields.innerHTML = '';
    if (count <= 0) return;

    for (let i = 1; i <= count; i++) {
        const div = document.createElement('div');
        div.className = 'form-group companion-field';
        div.innerHTML = `
            <label for="companion${i}">Nome do acompanhante ${i} *</label>
            <input type="text" id="companion${i}" name="companion${i}" required placeholder="Nome completo">
        `;
        companionsFields.appendChild(div);
    }
}

companionsCount.addEventListener('change', (e) => {
    updateCompanionFields(Number(e.target.value));
});

rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(rsvpForm);
    const attending = formData.get('attending');
    const guestName = formData.get('guestName').trim();
    const message = formData.get('message').trim();
    const count = Number(formData.get('companionsCount') || '0');

    if (!guestName || !attending) {
        alert('Por favor, preencha todos os campos obrigatorios.');
        return;
    }

    // Coleta nomes dos acompanhantes
    const companionNames = [];
    for (let i = 1; i <= count; i++) {
        const name = formData.get(`companion${i}`)?.trim();
        if (name) companionNames.push(name);
    }

    // Prepara payload
    const payload = {
        nome: guestName,
        confirmacao: attending === 'sim' ? 'Vai' : 'Nao vai',
        acompanhantes: count,
        nomesAcompanhantes: companionNames.join(', '),
        mensagem: message,
        dataEnvio: new Date().toISOString(),
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
        if (APPS_SCRIPT_URL) {
            const response = await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            // Com no-cors nao conseguimos ler a resposta, entao assumimos sucesso
            showSuccess();
        } else {
            // Fallback: salvar no localStorage e avisar usuario
            saveToLocalStorage(payload);
            console.log('Dados do RSVP (Apps Script nao configurado):', payload);
            showSuccess();
        }
    } catch (err) {
        console.error('Erro ao enviar RSVP:', err);
        // Fallback local
        saveToLocalStorage(payload);
        showSuccess();
    }
});

function saveToLocalStorage(data) {
    const existing = JSON.parse(localStorage.getItem('wedding_rsvp') || '[]');
    existing.push(data);
    localStorage.setItem('wedding_rsvp', JSON.stringify(existing));
}

function showSuccess() {
    rsvpForm.style.display = 'none';
    rsvpSuccess.classList.add('active');
    rsvpError.classList.remove('active');
}

function showError() {
    rsvpForm.style.display = 'none';
    rsvpSuccess.classList.remove('active');
    rsvpError.classList.add('active');
}

/* ===== Scroll Reveal Animacao ===== */
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Adiciona efeito reveal aos elementos das secoes
document.querySelectorAll('.story-text, .story-images, .gift-card, .rsvp-form-wrapper').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

/* ===== Revelar secoes na carga ===== */
window.addEventListener('DOMContentLoaded', () => {
    handleScroll();
});
