// ========================================
// GERADOR DE ABRAÇOS - SCRIPT DE CRIAÇÃO
// ========================================

// ⚠️ IMPORTANTE: Altere a URL abaixo para a URL do seu backend no Render
// Exemplo: 'https://gerador-de-abracos.onrender.com'
const API_URL = 'https://gerador-de-abracos-7ubc.onrender.com/';

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const imageForm = document.getElementById('imageForm');
    const creationForm = document.getElementById('creationForm');
    const previewArea = document.getElementById('previewArea');
    const generatedImage = document.getElementById('generatedImage');
    const downloadBtn = document.getElementById('downloadBtn');
    const createAnotherBtn = document.getElementById('createAnotherBtn');
    const creditsCount = document.getElementById('creditsCount');
    const tipoMensagem = document.getElementById('tipoMensagem');
    const nomeDestinatarioGroup = document.getElementById('nomeDestinatarioGroup');

    // Estado da aplicação
    let selectedBackground = null;
    let selectedColor = null;
    let currentCredits = 8;
    let token = localStorage.getItem('token');

    // Verificar se está logado
    if (!token) {
        alert('Você precisa fazer login primeiro!');
        window.location.href = 'cadastro.html';
        return;
    }

    // Carregar dados do usuário
    carregarPerfil();

    // ========================================
    // CARREGAR PERFIL DO USUÁRIO
    // ========================================
    async function carregarPerfil() {
        try {
            const response = await fetch(`${API_URL}/api/auth/perfil`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                currentCredits = data.creditos_gratuitos + data.creditos_premium;
                creditsCount.textContent = currentCredits;
                
                // Atualizar nome do usuário se houver elemento
                const userNameElement = document.getElementById('userName');
                if (userNameElement) {
                    userNameElement.textContent = data.nome;
                }
            } else {
                alert('Sessão expirada. Faça login novamente.');
                localStorage.removeItem('token');
                window.location.href = 'cadastro.html';
            }
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
        }
    }

    // ========================================
    // SELEÇÃO DE FUNDO
    // ========================================
    const backgroundOptions = document.querySelectorAll('.image-option');
    backgroundOptions.forEach(option => {
        option.addEventListener('click', function() {
            backgroundOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedBackground = this.getAttribute('data-bg');
        });
    });

    // ========================================
    // SELEÇÃO DE COR
    // ========================================
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedColor = this.getAttribute('data-color');
        });
    });

    // ========================================
    // TIPO DE MENSAGEM
    // ========================================
    if (tipoMensagem) {
        tipoMensagem.addEventListener('change', function() {
            if (this.value === 'generica') {
                nomeDestinatarioGroup.style.display = 'none';
            } else {
                nomeDestinatarioGroup.style.display = 'block';
            }
        });
    }

    // ========================================
    // ENVIO DO FORMULÁRIO
    // ========================================
    imageForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validações
        if (!selectedBackground) {
            alert('Por favor, selecione um fundo para a imagem.');
            return;
        }

        if (!selectedColor) {
            alert('Por favor, selecione um tema de cor para o texto.');
            return;
        }

        const categoria = document.getElementById('categoria').value;
        if (!categoria) {
            alert('Por favor, selecione uma categoria.');
            return;
        }

        const tipoMsg = tipoMensagem.value;
        const nomeDestinatario = document.getElementById('nomeDestinatario').value;

        if (tipoMsg === 'personalizada' && !nomeDestinatario) {
            alert('Por favor, digite o nome do destinatário.');
            return;
        }

        // Verificar créditos
        if (currentCredits <= 0) {
            alert('Você não tem créditos suficientes. Compre mais créditos para continuar.');
            return;
        }

        // Coletar dados do formulário
        const formData = {
            categoria: categoria,
            background: selectedBackground,
            cor_texto: selectedColor,
            tipo_mensagem: tipoMsg,
            nome_destinatario: nomeDestinatario || '',
            mensagem_adicional: document.getElementById('mensagemAdicional').value || ''
        };

        console.log('Gerando imagem com:', formData);

        // Mostrar loading
        creationForm.classList.add('loading');
        const submitBtn = imageForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Gerando imagem... (pode levar até 30 segundos)';

        try {
            // Chamada real para a API
            const response = await fetch(`${API_URL}/api/imagens/gerar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Sucesso! Mostrar imagem gerada
                generatedImage.src = `${API_URL}${data.imagem.url}`;

                // Atualizar créditos
                currentCredits = data.creditos_restantes.total;
                creditsCount.textContent = currentCredits;

                // Esconder formulário e mostrar preview
                creationForm.style.display = 'none';
                previewArea.style.display = 'block';

                // Scroll para o preview
                previewArea.scrollIntoView({ behavior: 'smooth' });

                alert('Imagem gerada com sucesso!');
            } else {
                // Erro na geração
                alert(data.erro || 'Erro ao gerar imagem. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao gerar imagem:', error);
            alert('Erro ao conectar com o servidor. Verifique sua conexão e tente novamente.');
        } finally {
            // Remover loading
            creationForm.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    // ========================================
    // DOWNLOAD DA IMAGEM
    // ========================================
    downloadBtn.addEventListener('click', function() {
        const imageUrl = generatedImage.src;
        
        // Criar link temporário para download
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `gerador-de-abracos-${Date.now()}.png`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert('Imagem baixada com sucesso!');
    });

    // ========================================
    // CRIAR OUTRA IMAGEM
    // ========================================
    createAnotherBtn.addEventListener('click', function() {
        // Resetar formulário
        imageForm.reset();
        
        // Remover seleções
        backgroundOptions.forEach(opt => opt.classList.remove('selected'));
        colorOptions.forEach(opt => opt.classList.remove('selected'));
        
        selectedBackground = null;
        selectedColor = null;

        // Mostrar formulário e esconder preview
        previewArea.style.display = 'none';
        creationForm.style.display = 'block';

        // Scroll para o formulário
        creationForm.scrollIntoView({ behavior: 'smooth' });
    });

    // ========================================
    // LOGOUT
    // ========================================
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            alert('Logout realizado com sucesso!');
            window.location.href = 'cadastro.html';
        });
    }

    // ========================================
    // INICIALIZAÇÃO
    // ========================================
    console.log('Gerador de Abraços carregado!');
    console.log('API URL:', API_URL);
});
    // ========================================
    // SELEÇÃO DE COR
    // ========================================
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove seleção anterior
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Adiciona seleção atual
            this.classList.add('selected');
            selectedColor = this.getAttribute('data-color');
        });
    });

    // ========================================
    // TIPO DE MENSAGEM
    // ========================================
    tipoMensagem.addEventListener('change', function() {
        if (this.value === 'generica') {
            nomeDestinatarioGroup.style.display = 'none';
        } else {
            nomeDestinatarioGroup.style.display = 'block';
        }
    });

    // ========================================
    // ENVIO DO FORMULÁRIO
    // ========================================
    imageForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validações
        if (!selectedBackground) {
            alert('Por favor, selecione um fundo para a imagem.');
            return;
        }

        if (!selectedColor) {
            alert('Por favor, selecione um tema de cor para o texto.');
            return;
        }

        const categoria = document.getElementById('categoria').value;
        if (!categoria) {
            alert('Por favor, selecione uma categoria.');
            return;
        }

        const tipoMsg = tipoMensagem.value;
        const nomeDestinatario = document.getElementById('nomeDestinatario').value;

        if (tipoMsg === 'personalizada' && !nomeDestinatario) {
            alert('Por favor, digite o nome do destinatário.');
            return;
        }

        // Verificar créditos
        if (currentCredits <= 0) {
            alert('Você não tem créditos suficientes. Compre mais créditos para continuar.');
            return;
        }

        // Coletar dados do formulário
        const formData = {
            categoria: categoria,
            background: selectedBackground,
            color: selectedColor,
            tipoMensagem: tipoMsg,
            nomeDestinatario: nomeDestinatario,
            mensagemAdicional: document.getElementById('mensagemAdicional').value
        };

        console.log('Dados da imagem:', formData);

        // Mostrar loading
        creationForm.classList.add('loading');

        // Simular chamada à API (substituir por chamada real)
        setTimeout(() => {
            // Aqui você faria:
            // 1. Enviar dados para o backend
            // 2. Backend gera prompt e envia para ChatGPT
            // 3. Prompt retornado é enviado para Stability AI
            // 4. Imagem é retornada

            // Simulação: usar uma imagem de placeholder
            generatedImage.src = `https://via.placeholder.com/800x600/${selectedColor === 'white' ? 'ffffff' : '333333'}/000000?text=Imagem+Gerada`;

            // Atualizar créditos
            currentCredits--;
            creditsCount.textContent = currentCredits;

            // Esconder formulário e mostrar preview
            creationForm.style.display = 'none';
            previewArea.style.display = 'block';

            // Remover loading
            creationForm.classList.remove('loading');

            // Scroll para o preview
            previewArea.scrollIntoView({ behavior: 'smooth' });
        }, 2000);
    });

    // ========================================
    // DOWNLOAD DA IMAGEM
    // ========================================
    downloadBtn.addEventListener('click', function() {
        const imageUrl = generatedImage.src;
        
        // Criar link temporário para download
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `gerador-de-abracos-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert('Imagem baixada com sucesso!');
    });

    // ========================================
    // CRIAR OUTRA IMAGEM
    // ========================================
    createAnotherBtn.addEventListener('click', function() {
        // Resetar formulário
        imageForm.reset();
        
        // Remover seleções
        backgroundOptions.forEach(opt => opt.classList.remove('selected'));
        colorOptions.forEach(opt => opt.classList.remove('selected'));
        
        selectedBackground = null;
        selectedColor = null;

        // Mostrar formulário e esconder preview
        previewArea.style.display = 'none';
        creationForm.style.display = 'block';

        // Scroll para o formulário
        creationForm.scrollIntoView({ behavior: 'smooth' });
    });

    // ========================================
    // INICIALIZAÇÃO
    // ========================================
    console.log('Gerador de Abraços carregado!');
    console.log('Créditos disponíveis:', currentCredits);
});
