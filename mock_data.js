// Base de Dados Faro (PetConnect Reunion Platform)

const MOCK_PETS = [
    {
        id: 'pet-1',
        type: 'lost', // 'lost' ou 'found'
        name: 'Thor',
        species: 'dog',
        breed: 'Golden Retriever',
        gender: 'Macho',
        size: 'Grande',
        color: 'Dourado / Creme',
        age: '3 anos',
        microchip: 'Sim (982000123456789)',
        reward: 'R$ 1.500,00',
        date: '2026-08-08',
        time: '14:30',
        address: 'Av. Paulista, 1500 - Bela Vista, São Paulo - SP',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        uf: 'SP',
        lat: -23.5615,
        lng: -46.6560,
        description: 'Fugiu assustado com barulho de obra. Usa coleira vermelha com identificação. Muito dócil e atende pelo nome.',
        images: [
            'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80'
        ],
        contactName: 'Carlos Silva',
        contactPhone: '(11) 98765-4321',
        contactEmail: 'carlos.silva@email.com',
        status: 'active',
        createdAt: '2026-08-08T15:00:00Z'
    },
    {
        id: 'pet-2',
        type: 'found',
        name: 'Gatinho Amarelo (Não identificado)',
        species: 'cat',
        breed: 'Vira-lata (SRD)',
        gender: 'Macho',
        size: 'Pequeno',
        color: 'Laranja / Tigrado',
        age: 'Aprox. 1 ano',
        microchip: 'Não verificado',
        reward: '',
        date: '2026-08-09',
        time: '09:15',
        address: 'Rua Augusta, 800 - Consolação, São Paulo - SP',
        neighborhood: 'Consolação',
        city: 'São Paulo',
        uf: 'SP',
        lat: -23.5532,
        lng: -46.6528,
        description: 'Encontrado miando perto da padaria. Está bem cuidado, muito carinhoso. Atualmente acolhido na clínica veterinária local.',
        images: [
            'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80'
        ],
        contactName: 'Mariana Costa',
        contactPhone: '(11) 97123-8899',
        contactEmail: 'mariana.vet@email.com',
        status: 'active',
        createdAt: '2026-08-09T09:30:00Z'
    },
    {
        id: 'pet-3',
        type: 'lost',
        name: 'Luna',
        species: 'cat',
        breed: 'Siamês',
        gender: 'Fêmea',
        size: 'Médio',
        color: 'Creme com pontas escuras',
        age: '2 anos',
        microchip: 'Não',
        reward: 'R$ 500,00',
        date: '2026-08-07',
        time: '20:00',
        address: 'Rua Harmonia, 300 - Vila Madalena, São Paulo - SP',
        neighborhood: 'Vila Madalena',
        city: 'São Paulo',
        uf: 'SP',
        lat: -23.5562,
        lng: -46.6890,
        description: 'Luna escapou pela janela da varanda. Olhos bem azuis, muito arisca com estranhos. Pode estar escondida sob carros.',
        images: [
            'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=800&q=80'
        ],
        contactName: 'Beatriz Lima',
        contactPhone: '(11) 99887-1122',
        contactEmail: 'beatriz.l@email.com',
        status: 'active',
        createdAt: '2026-08-07T21:00:00Z'
    },
    {
        id: 'pet-4',
        type: 'found',
        name: 'Cão SRD Porte Médio',
        species: 'dog',
        breed: 'Vira-lata (SRD)',
        gender: 'Fêmea',
        size: 'Médio',
        color: 'Preto e Caramelo',
        age: 'Adulta',
        microchip: 'Sem microchip',
        reward: '',
        date: '2026-08-09',
        time: '07:45',
        address: 'Parque Ibirapuera - Portão 3, São Paulo - SP',
        neighborhood: 'Moema',
        city: 'São Paulo',
        uf: 'SP',
        lat: -23.5874,
        lng: -46.6576,
        description: 'Vistada vagando perto das quadras. Usa uma peitoral azul gasta sem placa de identificação.',
        images: [
            'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80'
        ],
        contactName: 'Roberto Alves (Guarda do Parque)',
        contactPhone: '(11) 96455-2211',
        contactEmail: 'roberto.alves@email.com',
        status: 'active',
        createdAt: '2026-08-09T08:00:00Z'
    },
    {
        id: 'pet-5',
        type: 'lost',
        name: 'Bob',
        species: 'dog',
        breed: 'Poodle Toy',
        gender: 'Macho',
        size: 'Pequeno',
        color: 'Branco',
        age: '7 anos',
        microchip: 'Sim',
        reward: 'R$ 800,00',
        date: '2026-08-06',
        time: '17:00',
        address: 'Copacabana - Posto 4, Rio de Janeiro - RJ',
        neighborhood: 'Copacabana',
        city: 'Rio de Janeiro',
        uf: 'RJ',
        lat: -22.9711,
        lng: -43.1825,
        description: 'Bob precisa de medicação contínua para o coração! É velhinho e enxerga pouco. Por favor, ajude-nos a encontrá-lo!',
        images: [
            'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80'
        ],
        contactName: 'Fernanda Oliveira',
        contactPhone: '(21) 99112-3344',
        contactEmail: 'fe.oliveira@email.com',
        status: 'active',
        createdAt: '2026-08-06T18:00:00Z'
    },
    {
        id: 'pet-6',
        type: 'found',
        name: 'Calopsita Cinza e Amarela',
        species: 'bird',
        breed: 'Calopsita',
        gender: 'Desconhecido',
        size: 'Pequeno',
        color: 'Cinza, Amarelo e Laranja',
        age: 'Jovem',
        microchip: 'Anilha nº 4521',
        reward: '',
        date: '2026-08-08',
        time: '11:00',
        address: 'Rua Oscar Freire, 1100 - Cerqueira César, São Paulo - SP',
        neighborhood: 'Jardins',
        city: 'São Paulo',
        uf: 'SP',
        lat: -23.5630,
        lng: -46.6680,
        description: 'Pousou na sacada do apartamento. Bastante mansa, gosta de assobiar. Está segura em uma gaiola adequada.',
        images: [
            'https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&w=800&q=80'
        ],
        contactName: 'Lucas Mendes',
        contactPhone: '(11) 98223-9900',
        contactEmail: 'lucas.mendes@email.com',
        status: 'active',
        createdAt: '2026-08-08T11:30:00Z'
    }
];

const MOCK_ONGS = [
    {
        id: 'ong-1',
        name: 'Instituto Luisa Mell',
        uf: 'SP',
        city: 'São Paulo',
        neighborhood: 'Butantã',
        address: 'Estrada do Ecoturismo, 450 - SP',
        focus: 'Cães e Gatos de Rua / Resgate de Maustratos',
        phone: '(11) 3721-0000',
        whatsapp: '11988880000',
        email: 'contato@ilm.org.br',
        website: 'https://ilm.org.br',
        instagram: '@institutoluisamell',
        description: 'Atua no resgate de animais feridos ou em situação de vulnerabilidade extrema, promovendo adoção responsável e castração.'
    },
    {
        id: 'ong-2',
        name: 'ONG Amigos de São Francisco',
        uf: 'SP',
        city: 'São Paulo',
        neighborhood: 'Pinheiros',
        address: 'Rua Pedroso Alvarenga, 1200 - SP',
        focus: 'Cães e Gatos abandonados',
        phone: '(11) 97654-3210',
        whatsapp: '11976543210',
        email: 'contato@amigosdesaofrancisco.com.br',
        website: 'https://amigosdesaofrancisco.com.br',
        instagram: '@amigosdesaofrancisco',
        description: 'Fundada por protetoras independentes, acolhe animais resgatados da rua com atendimento veterinário completo.'
    },
    {
        id: 'ong-3',
        name: 'SUIPA - Sociedade Protetora dos Animais',
        uf: 'RJ',
        city: 'Rio de Janeiro',
        neighborhood: 'Benfica',
        address: 'Av. Dom Hélder Câmara, 1801 - RJ',
        focus: 'Resgate de Emergência, Clínica e Adoção',
        phone: '(21) 3297-8800',
        whatsapp: '21988887766',
        email: 'suipa@suipa.org.br',
        website: 'https://suipa.org.br',
        instagram: '@suipaoficial',
        description: 'Uma das instituições mais tradicionais do Brasil. Oferece assistência veterinária a preços populares e abrigo para milhares de animais.'
    },
    {
        id: 'ong-4',
        name: 'Associação Bastter de Proteção Animal',
        uf: 'MG',
        city: 'Belo Horizonte',
        neighborhood: 'Pampulha',
        address: 'Av. Antonio Carlos, 3000 - BH',
        focus: 'Cães e Cavalos resgatados',
        phone: '(31) 3409-5000',
        whatsapp: '31999887766',
        email: 'bastter@protecaoanimal.org',
        website: 'https://protecaoanimalmg.org',
        instagram: '@bastteranimal',
        description: 'Dedicada ao acolhimento e tratamento de animais de grande e médio porte vítimas de abandono na grande BH.'
    },
    {
        id: 'ong-5',
        name: 'ONG Patas Curitibanas',
        uf: 'PR',
        city: 'Curitiba',
        neighborhood: 'Batel',
        address: 'Rua Bispo Dom José, 2100 - PR',
        focus: 'Feiras de Adoção e Busca Ativa',
        phone: '(41) 3344-5566',
        whatsapp: '41991234567',
        email: 'patas@curitiba.org.br',
        website: 'https://patascuritibanas.com.br',
        instagram: '@patascuritibanas',
        description: 'Rede comunitária de protetores de Curitiba focada na reintegração familiar de pets perdidos e feiras semanais de adoção.'
    }
];

const MOCK_GUIDES = [
    {
        id: 'guide-dog',
        title: 'Como Reencontrar um Cachorro Desaparecido',
        category: 'Cães',
        readTime: '5 min de leitura',
        summary: 'Ações imediatas e estratégias comportamentais comprovadas para localizar cães nas primeiras 48h.',
        icon: 'sound_detection_dog_barking',
        steps: [
            {
                step: '1. Inicie pelo ponto focal de fuga',
                detail: 'Cães costumam correr em linha reta nos primeiros minutos quando assustados. Procure em um raio inicial de 1 a 2 km a partir do local onde foi visto pela última vez.'
            },
            {
                step: '2. Deixe itens com o cheiro da família',
                detail: 'Coloque roupas usadas do tutor e a caminha/coberta do cão na entrada de casa ou no local do disappearance. O olfato do cão detecta partículas de odor a quilômetros.'
            },
            {
                step: '3. Busque em horários de menor movimento',
                detail: 'Procure de madrugada ou ao amanhecer (entre 4h e 6h da manhã). Em momentos silenciosos, cães assustados saem de esconderijos para procurar comida.'
            },
            {
                step: '4. Divulgação Física e Comunitária',
                detail: 'Imprima cartazes em papel colorido e afixe em comércios locais, pet shops, clínicas veterinárias, pontos de ônibus e com varredores de rua.'
            }
        ]
    },
    {
        id: 'guide-cat',
        title: 'Como Encontrar um Gato Perdido',
        category: 'Gatos',
        readTime: '6 min de leitura',
        summary: 'Gatos não costumam ir longe. Saiba como procurá-los perto de casa usando o "Método da Caixa de Areia" e buscas silenciosas.',
        icon: 'pets',
        steps: [
            {
                step: '1. Busque num raio de 100 a 200 metros',
                detail: 'Em 85% dos casos de gatos perdidos, o animal está escondido muito perto de casa (sob telhados, garagens, arbustos ou vãos de vizinhos).'
            },
            {
                step: '2. Coloque a caixa de areia na varanda/quintal',
                detail: 'A areia usada possui um odor territorial único e inconfundível que ajuda o gato a se orientar no retorno.'
            },
            {
                step: '3. Varredura Silenciosa à Noite',
                detail: 'Gatos assustados congelam durante o dia. Use uma lanterna potente à noite focando sob carros e vãos (os olhos do gato refletem a luz).'
            },
            {
                step: '4. Chame suavemente e use alimento úmido',
                detail: 'Chame pelo nome com voz calma. Chacoalhe um pote de sachê ou ração sem fazer ruídos bruscos que possam assustá-lo.'
            }
        ]
    },
    {
        id: 'guide-emotional',
        title: 'Suporte Emocional & Primeiras 48 Horas',
        category: 'Apoio',
        readTime: '4 min de leitura',
        summary: 'Gerenciar o estresse e manter o método é essencial para não esgotar as forças durante a busca.',
        icon: 'volunteer_activism',
        steps: [
            {
                step: '1. Divida tarefas em rede',
                detail: 'Delegue funções: uma pessoa cuida das redes sociais, outra faz buscas de rua e outra contata clínicas veterinárias da região.'
            },
            {
                step: '2. Cuidado com Golpes',
                detail: 'Nunca faça pagamentos de recompensa antecipados sem confirmação por foto recente ou chamada de vídeo comprovando a presença do pet.'
            },
            {
                step: '3. Mantenha as clínicas veterinárias avisadas',
                detail: 'Muitas pessoas que encontram um animal acidentado ou perdido o levam direto para a veterinária mais próxima.'
            }
        ]
    }
];
