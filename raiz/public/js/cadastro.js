// ========================================
// GERADOR DE ABRAÇOS - SCRIPT DE CADASTRO
// ========================================

// Configuração da API
const API_URL = '/api'; // URL relativa já que frontend e backend estão no mesmo domínio

document.addEventListener('DOMContentLoaded', function() {
    const cadastroForm = document.getElementById('cadastroForm');
    const loginForm = document.getElementById('loginForm');
    
    // Verificar se já está logado
    const token = localStorage.getItem('token');
    if (token) {
        // Verificar se o token é válido
        verificarToken(token);
    }

    // ========================================
    // VERIFICAR TOKEN
    // ========================================
    async function verificarToken(token) {
        try {
            const response = await fetch(`${API_URL}/auth/verificar`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Token válido, redirecionar para a página principal
                window.location.href = '/';
            } else {
                // Token inválido, remover
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error('Erro ao verificar token:', error);
            localStorage.removeItem('token');
        }
    }

    // ========================================
    // MÁSCARA PARA WHATSAPP
    // ========================================
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

    // ========================================
    // CADASTRO
    // ========================================
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const senha = document.getElementById('senha').value;
            const senhaConfirm = document.getElementById('senhaConfirm')?.value;
            const termos = document.getElementById('termos').checked;

            // Validações básicas
            if (!nome || !email || !whatsapp || !senha) {
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }

            if (senhaConfirm && senha !== senhaConfirm) {
                alert('As senhas não coincidem.');
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

            // Validação de senha
            if (senha.length < 6) {
                alert('A senha deve ter pelo menos 6 caracteres.');
                return;
            }

            // Preparar dados
            const formData = {
                nome,
                email,
                whatsapp: whatsappClean,
                senha
            };

            console.log('Cadastrando usuário:', { ...formData, senha: '***' });

            // Desabilitar botão
            const submitBtn = cadastroForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '⏳ Cadastrando...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(`${API_URL}/auth/cadastro`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    // Sucesso!
                    alert('Cadastro realizado com sucesso! Você ganhou 8 créditos gratuitos.');
                    
                    // Salvar token
                    localStorage.setItem('token', data.token);
                    
                    // Redirecionar para a página principal
                    window.location.href = '/';
                } else {
                    // Erro
                    alert(data.erro || 'Erro ao realizar cadastro. Tente novamente.');
                    console.error('Erro na API:', data);
                }
            } catch (error) {
                console.error('Erro ao cadastrar:', error);
                alert('Erro de conexão. Verifique sua internet e tente novamente.');
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // ========================================
    // LOGIN
    // ========================================
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const senha = document.getElementById('loginSenha').value;

            // Validações básicas
            if (!email || !senha) {
                alert('Por favor, preencha todos os campos.');
                return;
            }

            // Validação de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, insira um e-mail válido.');
                return;
            }

            // Preparar dados
            const formData = {
                email,
                senha
            };

            console.log('Fazendo login:', { email, senha: '***' });

            // Desabilitar botão
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '⏳ Entrando...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    // Sucesso!
                    alert('Login realizado com sucesso!');
                    
                    // Salvar token
                    localStorage.setItem('token', data.token);
                    
                    // Redirecionar para a página principal
                    window.location.href = '/';
                } else {
                    // Erro
                    alert(data.erro || 'Email ou senha incorretos.');
                    console.error('Erro na API:', data);
                }
            } catch (error) {
                console.error('Erro ao fazer login:', error);
                alert('Erro de conexão. Verifique sua internet e tente novamente.');
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // ========================================
    // ANIMAÇÃO DOS CARDS DE EXEMPLO
    // ========================================
    const exampleItems = document.querySelectorAll('.example-item');
    exampleItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
});
