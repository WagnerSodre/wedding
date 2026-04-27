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
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyFrSKFOb-OEyjcllfDenUbk654PmzzWVf2d8ydOjPTbGs6QNNXoeUKid8YTgZhf6xX/exec';

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
const modalPrice = document.getElementById('modalPrice');
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

/* ===== PIX Config ===== */
const MINHA_CHAVE_PIX = '+5521988510351'; // <-- SUBSTITUA PELA SUA CHAVE PIX
const NOME_TITULAR = 'Wagner Sodre';               // <-- SUBSTITUA PELO NOME COMPLETO
const CIDADE = 'Rio das Ostras';                           // <-- SUBSTITUA PELA CIDADE

/* ===== CRC16 para Payload PIX ===== */
function crc16(str) {
    let crc = 0xFFFF;
    let odd;
    for (let i = 0; i < str.length; i++) {
        crc = crc ^ (str.charCodeAt(i) << 8);
        for (let j = 0; j < 8; j++) {
            odd = (crc & 0x8000) !== 0;
            crc = crc << 1;
            if (odd) crc = crc ^ 0x1021;
        }
        crc = crc & 0xFFFF;
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

/* ===== PIX Modal ===== */
function abrirPix(valor, item) {
    modalTitle.textContent = item;
    modalPrice.textContent = 'R$ ' + valor.toFixed(2).replace('.', ',');

    const f = (id, conteudo) => id + conteudo.length.toString().padStart(2, '0') + conteudo;
    const valorStr = valor.toFixed(2);
    const merchantAccount = f("00", "BR.GOV.BCB.PIX") + f("01", MINHA_CHAVE_PIX);

    let payload = "000201";
    payload += f("26", merchantAccount);
    payload += "52040000";
    payload += "5303986";
    payload += f("54", valorStr);
    payload += "5802BR";
    payload += f("59", NOME_TITULAR);
    payload += f("60", CIDADE);
    payload += "62070503***";
    payload += "6304";

    const payloadFinal = payload + crc16(payload);

    qrPlaceholder.innerHTML = '';
    const imgQrCode = document.createElement('img');
    imgQrCode.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payloadFinal)}`;
    imgQrCode.alt = 'QR Code PIX';
    imgQrCode.style.maxWidth = '100%';
    qrPlaceholder.appendChild(imgQrCode);

    pixCodeInput.value = payloadFinal;

    pixModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openModal(giftId) {
    const gift = GIFTS.find(g => g.id === giftId);
    if (!gift) return;
    abrirPix(gift.price, gift.name);
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
document.querySelectorAll('.section-header, .countdown, .story-layout, .gift-card, .rsvp-form-wrapper').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    revealObserver.observe(el);
});

/* ===== Revelar secoes na carga ===== */
window.addEventListener('DOMContentLoaded', () => {
    handleScroll();
});
