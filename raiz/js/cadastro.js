// ========================================
// GERADOR DE ABRAÇOS - SCRIPT DE CADASTRO
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const cadastroForm = document.getElementById('cadastroForm');
    
    // Máscara para WhatsApp
    const whatsappInput = document.getElementById('whatsapp');
    if (whatsappInput) {
        whatsappInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
            }
            e.target.value = value;
        });
    }

    // Validação e envio do formulário
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const termos = document.getElementById('termos').checked;

            // Validações básicas
            if (!nome || !email || !whatsapp) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            if (!termos) {
                alert('Você precisa aceitar os termos de uso para continuar.');
                return;
            }

            // Validação de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, insira um e-mail válido.');
                return;
            }

            // Validação de WhatsApp
            const whatsappClean = whatsapp.replace(/\D/g, '');
            if (whatsappClean.length < 10) {
                alert('Por favor, insira um número de WhatsApp válido.');
                return;
            }

            // Aqui você faria a chamada para a API de cadastro
            console.log('Dados do cadastro:', {
                nome,
                email,
                whatsapp,
                termos
            });

            // Simulação de cadastro bem-sucedido
            alert('Cadastro realizado com sucesso! Você ganhou 8 créditos gratuitos.');
            
            // Redirecionar para a página principal
            // window.location.href = 'index.html';
        });
    }

    // Animação dos cards de exemplo
    const exampleItems = document.querySelectorAll('.example-item');
    exampleItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
});
