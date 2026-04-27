/*
 * Google Apps Script para capturar confirmacoes de presenca (RSVP)
 *
 * COMO CONFIGURAR:
 * 1. Crie uma planilha no Google Sheets: sheets.new
 * 2. Na primeira linha, adicione os cabecalhos:
 *    "Data" | "Nome" | "Confirmacao" | "Acompanhantes" | "NomesAcompanhantes" | "Mensagem"
 * 3. No menu "Extensoes" > "Apps Script"
 * 4. Cole este codigo e salve
 * 5. Clique em "Implantar" > "Novo acesso" > "Qualquer pessoa" > "Editor"
 * 6. Copie a URL gerada e coloque no arquivo js/script.js (variavel APPS_SCRIPT_URL)
 * 7. Execute a funcao "setupHeaders" uma vez para garantir os cabecalhos
 */

// ID da planilha (substitua pelo ID da sua planilha)
// O ID esta na URL: https://docs.google.com/spreadsheets/d/SEU_ID_AQUI/edit
const SHEET_ID = 'SUBSTITUA_PELO_ID_DA_SUA_PLANILHA';
const SHEET_NAME = 'Confirmacoes';

function setupHeaders() {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
        ss.insertSheet(SHEET_NAME);
    }
    const headers = ['Data', 'Nome', 'Confirmacao', 'Acompanhantes', 'NomesAcompanhantes', 'Mensagem'];
    ss.getSheetByName(SHEET_NAME).getRange(1, 1, 1, headers.length).setValues([headers]);
}

function doPost(e) {
    try {
        const ss = SpreadsheetApp.openById(SHEET_ID);
        const sheet = ss.getSheetByName(SHEET_NAME);

        // Garante cabecalhos se a planilha estiver vazia
        if (sheet.getLastRow() < 1) {
            setupHeaders();
        }

        const data = JSON.parse(e.postData.contents);

        const row = [
            data.dataEnvio || new Date().toISOString(),
            data.nome || '',
            data.confirmacao || '',
            data.acompanhantes || '0',
            data.nomesAcompanhantes || '',
            data.mensagem || ''
        ];

        sheet.appendRow(row);

        return ContentService
            .createTextOutput(JSON.stringify({ status: 'success' }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (err) {
        return ContentService
            .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

function doGet() {
    // Para testar se o script esta funcionando
    return ContentService
        .createTextOutput(JSON.stringify({ status: 'ok' }))
        .setMimeType(ContentService.MimeType.JSON);
}
