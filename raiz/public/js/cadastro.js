// ========================================
// GERADOR DE ABRAÇOS - SCRIPT DE CADASTRO
// ========================================

// URL da API - usa URL relativa (mesmo servidor)
const API_URL = '';  // Vazio = mesmo domínio

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
        cadastroForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const senha = document.getElementById('senha') ? document.getElementById('senha').value : 'senha123';
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

            // Desabilitar botão durante o envio
            const submitBtn = cadastroForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Cadastrando...';

            try {
                // Chamada para a API de cadastro
                const response = await fetch(`${API_URL}/api/auth/cadastro`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nome,
                        email,
                        whatsapp: whatsappClean,
                        senha
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Cadastro bem-sucedido
                    alert(`Cadastro realizado com sucesso! Você ganhou ${data.usuario.creditos_gratuitos} créditos gratuitos.`);
                    
                    // Salvar token no localStorage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('usuario', JSON.stringify(data.usuario));
                    
                    // Redirecionar para a página principal
                    window.location.href = '/app';
                } else {
                    // Erro no cadastro
                    alert(data.erro || 'Erro ao realizar cadastro. Tente novamente.');
                }
            } catch (error) {
                console.error('Erro ao cadastrar:', error);
                alert('Erro ao conectar com o servidor. Verifique sua conexão e tente novamente.');
            } finally {
                // Reabilitar botão
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    // Animação dos cards de exemplo
    const exampleItems = document.querySelectorAll('.example-item');
    exampleItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
});
