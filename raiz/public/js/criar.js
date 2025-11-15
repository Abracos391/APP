// ========================================
// GERADOR DE ABRAÇOS - SCRIPT DE CRIAÇÃO
// ========================================

// Configuração da API
const API_URL = '/api'; // URL relativa já que frontend e backend estão no mesmo domínio

// Mapeamento de fontes
const FONTES = {
    'manuscrito': "'Dancing Script', cursive",
    'arial': 'Arial, sans-serif',
    'arial-black': "'Arial Black', sans-serif",
    'comic-sans': "'Comic Sans MS', cursive',
    'times-new-roman': "'Times New Roman', serif",
    'georgia': 'Georgia, serif'
};

// Mapeamento de tamanhos (em pixels)
const TAMANHOS = {
    'pequeno': 24,
    'medio': 36,
    'grande': 48,
    'gigante': 64
};

// Mapeamento de cores
const CORES = {
    'white': '#FFFFFF',
    'black': '#000000',
    'gold': '#FFD700',
    'pink': '#FF6B9D',
    'blue': '#4A69BD',
    'green': '#00B894'
};

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const imageForm = document.getElementById('imageForm');
    const creationForm = document.getElementById('creationForm');
    const previewArea = document.getElementById('previewArea');
    const downloadBtn = document.getElementById('downloadBtn');
    const createAnotherBtn = document.getElementById('createAnotherBtn');
    const creditsCount = document.getElementById('creditsCount');
    const themeGrid = document.getElementById('themeGrid');
    const categoriaSelect = document.getElementById('categoria');
    const imageCanvas = document.getElementById('imageCanvas');
    
    // Contadores de caracteres
    const mensagemPrincipal = document.getElementById('mensagemPrincipal');
    const msgCounter = document.getElementById('msgCounter');
    const dedicatoria = document.getElementById('dedicatoria');
    const dedCounter = document.getElementById('dedCounter');

    // Estado da aplicação
    let selectedTheme = null;
    let selectedColor = 'black';
    let currentCredits = 8;
    let currentImageId = null;
    let canvas = null;
    let ctx = null;
    let backgroundImage = null;
    
    // Estado do texto arrastável
    let draggingText = null;
    let textElements = [];

    // ========================================
    // INICIALIZAÇÃO DO CANVAS
    // ========================================
    function initCanvas() {
        canvas = imageCanvas;
        ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;
        
        // Event listeners para arrastar
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('touchmove', handleTouchMove);
        canvas.addEventListener('touchend', handleTouchEnd);
    }

    // ========================================
    // CONTADORES DE CARACTERES
    // ========================================
    mensagemPrincipal.addEventListener('input', function() {
        msgCounter.textContent = this.value.length;
    });

    dedicatoria.addEventListener('input', function() {
        dedCounter.textContent = this.value.length;
    });

    // ========================================
    // CARREGAR TEMAS POR CATEGORIA
    // ========================================
    function carregarTemas(categoria) {
        if (!categoria) {
            themeGrid.innerHTML = '<p style="color: #999; text-align: center;">Selecione uma categoria primeiro</p>';
            return;
        }

        const temas = obterTemasPorCategoria(categoria);
        
        if (temas.length === 0) {
            // Se não houver temas específicos, mostrar temas genéricos
            const temasGenericos = obterTemasPorCategoria('generica');
            renderizarTemas(temasGenericos);
        } else {
            renderizarTemas(temas);
        }
    }

    function renderizarTemas(temas) {
        themeGrid.innerHTML = '';
        
        temas.forEach(tema => {
            const themeOption = document.createElement('div');
            themeOption.className = 'theme-option';
            themeOption.setAttribute('data-theme', tema.id);
            themeOption.style.backgroundColor = tema.cor_base;
            
            themeOption.innerHTML = `
                <div class="theme-preview" style="background-color: ${tema.cor_base};">
                    <span class="theme-icon">🎨</span>
                </div>
                <div class="theme-name">${tema.nome}</div>
                <div class="theme-description">${tema.descricao}</div>
            `;
            
            themeOption.addEventListener('click', function() {
                document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                selectedTheme = tema.id;
            });
            
            themeGrid.appendChild(themeOption);
        });
    }

    // Listener para mudança de categoria
    categoriaSelect.addEventListener('change', function() {
        carregarTemas(this.value);
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
            redrawCanvas();
        });
        
        // Selecionar a cor preta por padrão (já que o selectedColor é 'black' por padrão)
        if (option.getAttribute('data-color') === selectedColor) {
            option.classList.add('selected');
        }
    });

    // ========================================
    // VERIFICAR AUTENTICAÇÃO
    // ========================================
    function verificarAutenticacao() {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Você precisa fazer login para usar o gerador de imagens.');
            window.location.href = '/cadastro'; // Redireciona para a página de cadastro
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
                window.location.href = '/cadastro'; // Redireciona para a página de cadastro
            }
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
        }
    }

    // ========================================
    // GERAR IMAGEM DE FUNDO
    // ========================================
    function gerarImagemDeFundo(tema) {
        // Por enquanto, vamos usar uma cor sólida baseada no tema
        // Futuramente, isso pode ser substituído por uma chamada à API de geração de imagens
        const temaData = TEMAS_FUNDO[tema];
        
        ctx.fillStyle = temaData.cor_base;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Adicionar um gradiente para dar mais profundidade
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, temaData.cor_base);
        gradient.addColorStop(1, ajustarCor(temaData.cor_base, -20));
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Adicionar textura ou padrão baseado no estilo
        adicionarTextura(temaData);
    }

    function ajustarCor(cor, quantidade) {
        // Função auxiliar para escurecer/clarear cores
        const num = parseInt(cor.replace("#",""), 16);
        const r = Math.max(0, Math.min(255, (num >> 16) + quantidade));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + quantidade));
        const b = Math.max(0, Math.min(255, (num & 0x0000FF) + quantidade));
        return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
    }

    function adicionarTextura(temaData) {
        // Adicionar elementos decorativos baseados na categoria
        ctx.globalAlpha = 0.1;
        
        if (temaData.categoria === 'natal') {
            // Adicionar flocos de neve
            for (let i = 0; i < 30; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const size = Math.random() * 3 + 1;
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(x, y, size, size);
            }
        } else if (temaData.categoria === 'aniversario') {
            // Adicionar confetes
            for (let i = 0; i < 20; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const size = Math.random() * 5 + 2;
                const cores = ['#FF6B9D', '#FFD700', '#4A69BD', '#00B894'];
                ctx.fillStyle = cores[Math.floor(Math.random() * cores.length)];
                ctx.fillRect(x, y, size, size);
            }
        }
        
        ctx.globalAlpha = 1.0;
    }

    // ========================================
    // DESENHAR TEXTO NO CANVAS
    // ========================================
    function desenharTexto(texto, x, y, fonte, tamanho, cor, tipo = 'mensagem') {
        const tamanhoPixels = TAMANHOS[tamanho];
        const fontFamily = FONTES[fonte];
        const corHex = CORES[cor];
        
        ctx.font = `${tamanhoPixels}px ${fontFamily}`;
        ctx.fillStyle = corHex;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Adicionar sombra para melhor legibilidade
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // Quebrar texto em linhas se for muito longo
        const linhas = quebrarTexto(texto, canvas.width - 100, ctx);
        
        linhas.forEach((linha, index) => {
            const yPos = y + (index * (tamanhoPixels + 10));
            ctx.fillText(linha, x, yPos);
        });
        
        // Resetar sombra
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        return {
            texto,
            x,
            y,
            fonte,
            tamanho: tamanhoPixels,
            cor: corHex,
            tipo,
            linhas,
            largura: Math.max(...linhas.map(l => ctx.measureText(l).width)),
            altura: linhas.length * (tamanhoPixels + 10)
        };
    }

    function quebrarTexto(texto, maxWidth, ctx) {
        const palavras = texto.split(' ');
        const linhas = [];
        let linhaAtual = '';
        
        palavras.forEach(palavra => {
            const teste = linhaAtual + (linhaAtual ? ' ' : '') + palavra;
            const medida = ctx.measureText(teste);
            
            if (medida.width > maxWidth && linhaAtual) {
                linhas.push(linhaAtual);
                linhaAtual = palavra;
            } else {
                linhaAtual = teste;
            }
        });
        
        if (linhaAtual) {
            linhas.push(linhaAtual);
        }
        
        return linhas.length > 0 ? linhas : [texto];
    }

    // ========================================
    // REDESENHAR CANVAS
    // ========================================
    function redrawCanvas() {
        if (!selectedTheme) return;
        
        // Limpar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Desenhar fundo
        gerarImagemDeFundo(selectedTheme);
        
        // Redesenhar todos os textos
        textElements.forEach(element => {
            desenharTexto(
                element.texto,
                element.x,
                element.y,
                element.fonte,
                Object.keys(TAMANHOS).find(key => TAMANHOS[key] === element.tamanho),
                Object.keys(CORES).find(key => CORES[key] === element.cor),
                element.tipo
            );
        });
        
        // Desenhar área do patrocinador (reservada)
        desenharAreaPatrocinador();
    }

    function desenharAreaPatrocinador() {
        const sponsorHeight = 80;
        const sponsorY = canvas.height - sponsorHeight;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, sponsorY, canvas.width, sponsorHeight);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Área reservada para propaganda do patrocinador', canvas.width / 2, sponsorY + 40);
    }

    // ========================================
    // FUNÇÕES DE ARRASTAR (MOUSE)
    // ========================================
    function handleMouseDown(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Verificar se clicou em algum texto
        for (let i = textElements.length - 1; i >= 0; i--) {
            const element = textElements[i];
            const halfWidth = element.largura / 2;
            const halfHeight = element.altura / 2;
            
            if (x >= element.x - halfWidth && x <= element.x + halfWidth &&
                y >= element.y - halfHeight && y <= element.y + halfHeight) {
                
                // Verificar se não está na área do patrocinador
                if (y < canvas.height - 80) {
                    draggingText = element;
                    draggingText.offsetX = x - element.x;
                    draggingText.offsetY = y - element.y;
                    break;
                } else {
                    alert('Você não pode posicionar texto na área reservada para propaganda!');
                }
            }
        }
    }

    function handleMouseMove(e) {
        if (!draggingText) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Atualizar posição (com limites)
        const newY = y - draggingText.offsetY;
        
        // Não permitir arrastar para área do patrocinador
        if (newY < canvas.height - 80 - draggingText.altura / 2) {
            draggingText.x = x - draggingText.offsetX;
            draggingText.y = newY;
            
            redrawCanvas();
        }
    }

    function handleMouseUp(e) {
        draggingText = null;
    }

    // ========================================
    // FUNÇÕES DE ARRASTAR (TOUCH)
    // ========================================
    function handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }

    function handleTouchMove(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }

    function handleTouchEnd(e) {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
    }

    // ========================================
    // ENVIO DO FORMULÁRIO
    // ========================================
    imageForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Verificar autenticação
        if (!verificarAutenticacao()) return;

        // Validações
        if (!selectedTheme) {
            alert('Por favor, selecione um tema de fundo.');
            return;
        }

        const categoria = categoriaSelect.value;
        if (!categoria) {
            alert('Por favor, selecione uma categoria.');
            return;
        }

        const mensagem = mensagemPrincipal.value.trim();
        if (!mensagem) {
            alert('Por favor, digite uma mensagem.');
            return;
        }

        // Verificar créditos
        if (currentCredits <= 0) {
            alert('Você não tem créditos suficientes. Compre mais créditos para continuar.');
            return;
        }

        // Coletar dados
        const fonte = document.getElementById('tipoFonte').value;
        const tamanho = document.getElementById('tamanhoTexto').value;
        const dedicatoriaTexto = dedicatoria.value.trim();

        console.log('Gerando imagem com dados:', {
            categoria,
            tema: selectedTheme,
            mensagem,
            dedicatoria: dedicatoriaTexto,
            fonte,
            tamanho,
            cor: selectedColor
        });

        // Inicializar canvas
        initCanvas();
        
        // Gerar fundo
        gerarImagemDeFundo(selectedTheme);
        
        // Adicionar textos
        textElements = [];
        
        // Mensagem principal
        const mensagemElement = desenharTexto(
            mensagem,
            canvas.width / 2,
            canvas.height / 2 - 50,
            fonte,
            tamanho,
            selectedColor,
            'mensagem'
        );
        textElements.push(mensagemElement);
        
        // Dedicatória (se houver)
        if (dedicatoriaTexto) {
            const dedicatoriaElement = desenharTexto(
                dedicatoriaTexto,
                canvas.width / 2,
                canvas.height / 2 + 50,
                fonte,
                'pequeno',
                selectedColor,
                'dedicatoria'
            );
            textElements.push(dedicatoriaElement);
        }
        
        // Desenhar área do patrocinador
        desenharAreaPatrocinador();

        // Esconder formulário e mostrar preview
        creationForm.style.display = 'none';
        previewArea.style.display = 'block';

        // Scroll para o preview
        previewArea.scrollIntoView({ behavior: 'smooth' });

        console.log('Imagem criada! Agora você pode arrastar os textos.');
    });

    // ========================================
    // DOWNLOAD DA IMAGEM
    // ========================================
    downloadBtn.addEventListener('click', function() {
        // Converter canvas para imagem
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `gerador-de-abracos-${Date.now()}.png`;
            link.click();
            URL.revokeObjectURL(url);
            
            console.log('Download iniciado');
        });
    });

    // ========================================
    // CRIAR OUTRA IMAGEM
    // ========================================
    createAnotherBtn.addEventListener('click', function() {
        // Resetar formulário
        imageForm.reset();
        
        // Remover seleções
        document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('selected'));
        
        selectedTheme = null;
        selectedColor = 'black';
        currentImageId = null;
        textElements = [];

        // Resetar contadores
        msgCounter.textContent = '0';
        dedCounter.textContent = '0';

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
    
    // Carregar fontes do Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
});
