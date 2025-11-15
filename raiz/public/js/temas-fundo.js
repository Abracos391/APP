// ========================================
// TEMAS DE FUNDO PREDEFINIDOS
// ========================================

const TEMAS_FUNDO = {
    // CARTAS E PAPÉIS
    carta_classica: {
        nome: "Carta Clássica",
        categoria: "carta",
        estilo: "papel de carta com bordas decorativas",
        cor_base: "#f9f6f0",
        descricao: "Papel de carta tradicional com bordas elegantes"
    },
    carta_floral: {
        nome: "Carta Floral",
        categoria: "carta",
        estilo: "papel de carta com flores delicadas nas bordas",
        cor_base: "#fff5f7",
        descricao: "Carta decorada com flores suaves"
    },
    carta_vintage: {
        nome: "Carta Vintage",
        categoria: "carta",
        estilo: "papel de carta envelhecido estilo vintage",
        cor_base: "#f4e8d0",
        descricao: "Papel envelhecido com textura antiga"
    },
    
    // PERGAMINHOS
    pergaminho_antigo: {
        nome: "Pergaminho Antigo",
        categoria: "pergaminho",
        estilo: "pergaminho envelhecido com bordas queimadas",
        cor_base: "#e8dcc0",
        descricao: "Pergaminho com aparência medieval"
    },
    pergaminho_elegante: {
        nome: "Pergaminho Elegante",
        categoria: "pergaminho",
        estilo: "pergaminho com ornamentos dourados",
        cor_base: "#f5ecd7",
        descricao: "Pergaminho decorado com detalhes em ouro"
    },
    
    // CARTÕES DE NATAL
    natal_vermelho: {
        nome: "Natal Vermelho",
        categoria: "natal",
        estilo: "cartão de natal vermelho com neve e enfeites",
        cor_base: "#c41e3a",
        descricao: "Tema natalino tradicional vermelho"
    },
    natal_verde: {
        nome: "Natal Verde",
        categoria: "natal",
        estilo: "cartão de natal verde com pinheiros e luzes",
        cor_base: "#0f5132",
        descricao: "Tema natalino com tons de verde"
    },
    natal_dourado: {
        nome: "Natal Dourado",
        categoria: "natal",
        estilo: "cartão de natal dourado com estrelas e brilho",
        cor_base: "#d4af37",
        descricao: "Natal elegante com detalhes dourados"
    },
    natal_azul: {
        nome: "Natal Azul",
        categoria: "natal",
        estilo: "cartão de natal azul com flocos de neve",
        cor_base: "#1e3a8a",
        descricao: "Tema natalino com tons de azul invernal"
    },
    
    // ANIVERSÁRIO
    aniversario_festivo: {
        nome: "Aniversário Festivo",
        categoria: "aniversario",
        estilo: "cartão de aniversário com balões coloridos e confetes",
        cor_base: "#ff6b9d",
        descricao: "Celebração alegre com balões"
    },
    aniversario_elegante: {
        nome: "Aniversário Elegante",
        categoria: "aniversario",
        estilo: "cartão de aniversário sofisticado com detalhes dourados",
        cor_base: "#2d1b4e",
        descricao: "Aniversário com estilo elegante"
    },
    aniversario_infantil: {
        nome: "Aniversário Infantil",
        categoria: "aniversario",
        estilo: "cartão de aniversário colorido com personagens fofinhos",
        cor_base: "#ffd700",
        descricao: "Tema alegre para crianças"
    },
    
    // PÁSCOA
    pascoa_coelho: {
        nome: "Páscoa Coelho",
        categoria: "pascoa",
        estilo: "cartão de páscoa com coelhinhos e ovos coloridos",
        cor_base: "#e6b8ff",
        descricao: "Tema pascal com coelhos"
    },
    pascoa_primavera: {
        nome: "Páscoa Primavera",
        categoria: "pascoa",
        estilo: "cartão de páscoa com flores da primavera",
        cor_base: "#b8e6d5",
        descricao: "Páscoa com flores e natureza"
    },
    
    // DIA DAS MÃES
    maes_flores: {
        nome: "Mães - Flores",
        categoria: "diadasmaes",
        estilo: "cartão do dia das mães com rosas e corações",
        cor_base: "#ffb3d9",
        descricao: "Homenagem com flores delicadas"
    },
    maes_elegante: {
        nome: "Mães - Elegante",
        categoria: "diadasmaes",
        estilo: "cartão sofisticado para o dia das mães",
        cor_base: "#d4a5a5",
        descricao: "Estilo elegante e refinado"
    },
    
    // DIA DOS PAIS
    pais_classico: {
        nome: "Pais - Clássico",
        categoria: "diadospais",
        estilo: "cartão do dia dos pais com tons azuis e gravata",
        cor_base: "#4a69bd",
        descricao: "Tema tradicional masculino"
    },
    pais_moderno: {
        nome: "Pais - Moderno",
        categoria: "diadospais",
        estilo: "cartão moderno para o dia dos pais",
        cor_base: "#2c3e50",
        descricao: "Estilo contemporâneo"
    },
    
    // ANO NOVO
    anonovo_fogos: {
        nome: "Ano Novo - Fogos",
        categoria: "anonovo",
        estilo: "cartão de ano novo com fogos de artifício",
        cor_base: "#1a1a2e",
        descricao: "Celebração com fogos coloridos"
    },
    anonovo_champagne: {
        nome: "Ano Novo - Champagne",
        categoria: "anonovo",
        estilo: "cartão de ano novo elegante com taças de champagne",
        cor_base: "#d4af37",
        descricao: "Celebração sofisticada"
    },
    
    // BOM DIA
    bomdia_sol: {
        nome: "Bom Dia - Sol",
        categoria: "bomdia",
        estilo: "cartão de bom dia com sol nascente e céu colorido",
        cor_base: "#ffd93d",
        descricao: "Manhã ensolarada"
    },
    bomdia_cafe: {
        nome: "Bom Dia - Café",
        categoria: "bomdia",
        estilo: "cartão de bom dia com xícara de café fumegante",
        cor_base: "#6f4e37",
        descricao: "Manhã aconchegante"
    },
    bomdia_flores: {
        nome: "Bom Dia - Flores",
        categoria: "bomdia",
        estilo: "cartão de bom dia com flores da manhã",
        cor_base: "#ffb6c1",
        descricao: "Manhã florida"
    },
    
    // BOA TARDE
    boatarde_ceu: {
        nome: "Boa Tarde - Céu Azul",
        categoria: "boatarde",
        estilo: "cartão de boa tarde com céu azul e nuvens",
        cor_base: "#87ceeb",
        descricao: "Tarde tranquila"
    },
    boatarde_jardim: {
        nome: "Boa Tarde - Jardim",
        categoria: "boatarde",
        estilo: "cartão de boa tarde com jardim florido",
        cor_base: "#90ee90",
        descricao: "Tarde no jardim"
    },
    
    // BOA NOITE
    boanoite_lua: {
        nome: "Boa Noite - Lua",
        categoria: "boanoite",
        estilo: "cartão de boa noite com lua e estrelas",
        cor_base: "#191970",
        descricao: "Noite estrelada"
    },
    boanoite_sonhos: {
        nome: "Boa Noite - Sonhos",
        categoria: "boanoite",
        estilo: "cartão de boa noite com nuvens e lua crescente",
        cor_base: "#483d8b",
        descricao: "Noite dos sonhos"
    },
    boanoite_romantica: {
        nome: "Boa Noite - Romântica",
        categoria: "boanoite",
        estilo: "cartão de boa noite romântico com lua cheia",
        cor_base: "#2f1b3c",
        descricao: "Noite romântica"
    },
    
    // GENÉRICOS
    generico_floral: {
        nome: "Floral Suave",
        categoria: "generica",
        estilo: "fundo floral delicado com tons pastéis",
        cor_base: "#f0e6ff",
        descricao: "Flores suaves e elegantes"
    },
    generico_aquarela: {
        nome: "Aquarela",
        categoria: "generica",
        estilo: "fundo com efeito de aquarela colorida",
        cor_base: "#e0f7fa",
        descricao: "Efeito artístico de aquarela"
    },
    generico_geometrico: {
        nome: "Geométrico",
        categoria: "generica",
        estilo: "padrão geométrico moderno e minimalista",
        cor_base: "#f5f5f5",
        descricao: "Design moderno e clean"
    },
    generico_coracao: {
        nome: "Corações",
        categoria: "generica",
        estilo: "fundo com corações delicados",
        cor_base: "#ffe4e1",
        descricao: "Tema romântico com corações"
    },
    generico_natureza: {
        nome: "Natureza",
        categoria: "generica",
        estilo: "paisagem natural com árvores e céu",
        cor_base: "#98d8c8",
        descricao: "Tema natural e relaxante"
    }
};

// Função para obter temas por categoria
function obterTemasPorCategoria(categoria) {
    return Object.entries(TEMAS_FUNDO)
        .filter(([key, tema]) => tema.categoria === categoria)
        .map(([key, tema]) => ({ id: key, ...tema }));
}

// Função para obter todos os temas
function obterTodosTemas() {
    return Object.entries(TEMAS_FUNDO)
        .map(([key, tema]) => ({ id: key, ...tema }));
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.TEMAS_FUNDO = TEMAS_FUNDO;
    window.obterTemasPorCategoria = obterTemasPorCategoria;
    window.obterTodosTemas = obterTodosTemas;
}
