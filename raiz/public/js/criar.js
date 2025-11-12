// ========================================
// GERADOR DE ABRAÇOS - SCRIPT DE CRIAÇÃO
// ========================================

// Configuração da API
const API_URL = '/api'; // URL relativa já que frontend e backend estão no mesmo domínio

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
    let currentImageId = null;

    // ========================================
    // VERIFICAR AUTENTICAÇÃO
    // ========================================
    function verificarAutenticacao() {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Você precisa fazer login para usar o gerador de imagens.');
            window.location.href = '/cadastro';
            return false;
        }
        return true;
    }

    // ========================================
    // CARREGAR PERFIL DO USUÁRIO
    // ========================================
    async function carregarPerfil() {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/auth/perfil`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                currentCredits = data.creditos_disponiveis || 0;
                creditsCount.textContent = currentCredits;
            } else if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/cadastro';
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
            // Remove seleção anterior
            backgroundOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Adiciona seleção atual
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
    imageForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Verificar autenticação
        if (!verificarAutenticacao()) return;

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
            nome_destinatario: nomeDestinatario || null,
            mensagem_adicional: document.getElementById('mensagemAdicional').value || null
        };

        console.log('Gerando imagem com dados:', formData);

        // Mostrar loading
        creationForm.classList.add('loading');
        const submitBtn = imageForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '⏳ Gerando imagem...';
        submitBtn.disabled = true;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/imagens/gerar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Sucesso!
                currentImageId = data.id;
                generatedImage.src = data.url_imagem;

                // Atualizar créditos
                currentCredits = data.creditos_restantes;
                creditsCount.textContent = currentCredits;

                // Esconder formulário e mostrar preview
                creationForm.style.display = 'none';
                previewArea.style.display = 'block';

                // Scroll para o preview
                previewArea.scrollIntoView({ behavior: 'smooth' });

                console.log('Imagem gerada com sucesso!', data);
            } else {
                // Erro
                alert(data.erro || 'Erro ao gerar imagem. Tente novamente.');
                console.error('Erro na API:', data);
            }
        } catch (error) {
            console.error('Erro ao gerar imagem:', error);
            alert('Erro de conexão. Verifique sua internet e tente novamente.');
        } finally {
            // Remover loading
            creationForm.classList.remove('loading');
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
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

        console.log('Download iniciado:', imageUrl);
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
        currentImageId = null;

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
    
    // Carregar perfil do usuário
    carregarPerfil();
});
