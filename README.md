# Casamento — Wagner & Isabela

Site de casamento para hospedar no GitHub Pages com lista de presentes via PIX e confirmacao de presenca.

## Como Personalizar

### 1. Substituir fotos

Coloque suas fotos na pasta `images/` com estes nomes:

- `hero.jpg` — Foto principal do hero (foto do casal)
- `gallery-1.jpg`, `gallery-2.jpg`, `gallery-3.jpg` — Fotos da secao "Nossa Historia"

O site exibira automaticamente as imagens. Se preferir manter os placeholders coloridos, apenas remova ou renomeie os arquivos.

### 2. Adicionar QR Codes PIX

Para cada presente, voce pode adicionar uma imagem de QR Code:

1. Salve a imagem como `images/qr-1.png`, `images/qr-2.png`, ..., `images/qr-12.png`
2. Cada numero corresponde ao ID do presente na lista
3. Se a imagem nao existir, o site exibira um placeholder "insira aqui o QR Code PIX"

Para substituir o codigo PIX de cada presente, edite a funcao `openModal()` no arquivo `js/script.js`:

```javascript
pixCodeInput.value = `[Codigo PIX do presente: ${gift.name}]`;
```

Substitua pelo codigo PIX copiado do seu banco.

### 3. Configurar Confirmacao de Presenca (RSVP)

O RSVP salva os dados em uma planilha do Google Sheets via Google Apps Script.

#### Passo a passo:

1. Crie uma planilha no Google Sheets: acesse [sheets.new](https://sheets.new)
2. Na primeira linha, adicione os cabecalhos:
   - `Data` | `Nome` | `Confirmacao` | `Acompanhantes` | `NomesAcompanhantes` | `Mensagem`
3. Va em **Extensoes > Apps Script**
4. Cole o conteudo de `google-apps-script.js` e substitua `SEU_ID_AQUI` pelo ID da sua planilha
   - O ID esta na URL: `https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit`
5. Clique em **Implantar > Nova implantacao > Web app**
   - Executar como: "Eu"
   - Quem tem acesso: "Qualquer pessoa"
6. Copie a URL gerada
7. No arquivo `js/script.js`, cole a URL na constante `APPS_SCRIPT_URL`:

```javascript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/SEU_ID/exec';
```

### 4. Publicar no GitHub Pages

1. Crie um repositorio no GitHub
2. Envie todos os arquivos para o repositorio
3. Va em **Settings > Pages**
4. Selecione a branch `main` e a pasta `/ (root)`
5. Aguarde alguns minutos — seu site estara no ar em `https://seuusuario.github.io/wedding/`

### 5. Personalizar cores e fontes

Edite as variaveis CSS no inicio do arquivo `css/style.css`:

```css
:root {
    --green-dark: #2d4a3e;
    --green: #4a7c59;
    --green-light: #8b9a7e;
    /* ... */
}
```

## Estrutura dos Arquivos

```
wedding/
├── index.html              # Pagina principal
├── css/
│   └── style.css           # Estilos
├── js/
│   └── script.js           # Funcionalidades
├── images/                 # Fotos e QR Codes
├── google-apps-script.js   # Script para planilha de RSVP
└── README.md               # Este arquivo
```

## Licenca

Este projeto e de uso livre para fins pessoais.
