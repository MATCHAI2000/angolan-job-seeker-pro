
import { Job } from "../types/job";

// Função para simular atraso em requisições (para evitar sobrecarga do servidor)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Função para simular o scraping de vagas
// Em uma implementação real, isso usaria fetch ou axios para buscar o HTML do site alvo
export const scrapeJobs = async (searchQuery = ""): Promise<Job[]> => {
  console.log(`Iniciando busca por vagas. Query: ${searchQuery}`);
  
  // Simulando um atraso na requisição
  await delay(1500);
  
  try {
    // Em um cenário real, esta seria a URL do site a ser raspado
    // const response = await fetch('https://www.jobartis.com/ao/vagas');
    // const html = await response.text();
    // Em seguida, usaríamos um parser como cheerio para extrair os dados
    
    // Para fins de demonstração, retornamos dados simulados
    return getMockJobs(searchQuery);
  } catch (error) {
    console.error("Erro ao fazer scraping de vagas:", error);
    throw new Error("Falha ao obter vagas. Tente novamente mais tarde.");
  }
};

// Função para filtrar vagas com base nos critérios
export const filterJobs = (
  jobs: Job[], 
  categories: string[], 
  locations: string[], 
  salaryRange: [number, number],
  searchQuery: string
): Job[] => {
  return jobs.filter(job => {
    // Filtrar por categorias selecionadas
    if (categories.length > 0 && !categories.includes(job.category)) {
      return false;
    }
    
    // Filtrar por localizações selecionadas
    if (locations.length > 0 && !locations.includes(job.location)) {
      return false;
    }
    
    // Filtrar por faixa salarial
    if (job.salary && (job.salary < salaryRange[0] || job.salary > salaryRange[1])) {
      return false;
    }
    
    // Filtrar por termos de busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.category.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
};

// Função para ordenar vagas
export const sortJobs = (jobs: Job[], sortBy: string): Job[] => {
  return [...jobs].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
    } else if (sortBy === 'salary') {
      const salaryA = a.salary || 0;
      const salaryB = b.salary || 0;
      return salaryB - salaryA;
    } else {
      // Relevância (padrão)
      return 0;
    }
  });
};

// Função para converter vagas para CSV
export const jobsToCSV = (jobs: Job[]): string => {
  // Cabeçalhos CSV
  const headers = ["Título", "Empresa", "Localização", "Categoria", "Tipo", "Salário", "Data de Publicação"];
  
  // Dados das linhas
  const rows = jobs.map(job => [
    job.title.replace(/,/g, ";"),
    job.company.replace(/,/g, ";"),
    job.location.replace(/,/g, ";"),
    job.category.replace(/,/g, ";"),
    job.type.replace(/,/g, ";"),
    job.salary ? `${job.salary}` : "N/A",
    job.publishedDate
  ]);
  
  // Combinar cabeçalhos e linhas
  return [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");
};

// Função para salvar arquivo CSV
export const saveCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  
  // Criar URL para o Blob
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  
  // Anexar ao documento, clicar e remover
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Função de cache para salvar/carregar vagas do localStorage
export const jobCache = {
  save: (jobs: Job[]) => {
    localStorage.setItem("angojob_cached_jobs", JSON.stringify(jobs));
    localStorage.setItem("angojob_cache_timestamp", String(Date.now()));
  },
  
  load: (): Job[] | null => {
    const cachedJobs = localStorage.getItem("angojob_cached_jobs");
    const timestamp = localStorage.getItem("angojob_cache_timestamp");
    
    if (!cachedJobs || !timestamp) return null;
    
    // Verificar se o cache não está expirado (24 horas)
    const cacheTime = parseInt(timestamp);
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    if (now - cacheTime > oneDayMs) return null;
    
    try {
      return JSON.parse(cachedJobs);
    } catch (error) {
      console.error("Erro ao carregar jobs do cache:", error);
      return null;
    }
  }
};

// Dados simulados para demonstração
const getMockJobs = (query: string): Job[] => {
  // Categorias de vagas comuns em Angola
  const categories = [
    "Tecnologia da Informação",
    "Petróleo e Gás",
    "Finanças",
    "Saúde",
    "Educação",
    "Administração",
    "Logística",
    "Vendas",
    "Marketing",
    "Engenharia Civil",
    "Recursos Humanos"
  ];
  
  // Localizações em Angola
  const locations = [
    "Luanda",
    "Huambo",
    "Benguela",
    "Lubango",
    "Malanje",
    "Lobito",
    "Namibe",
    "Cabinda"
  ];
  
  // Tipos de vagas
  const jobTypes = [
    "Tempo Integral",
    "Meio Período",
    "Freelance",
    "Estágio",
    "Temporário"
  ];
  
  // Empresas fictícias operando em Angola
  const companies = [
    "Sonangol",
    "BFA Angola",
    "Unitel",
    "Odebrecht Angola",
    "Total Angola",
    "Chevron Angola",
    "Angola Cables",
    "Banco BIC",
    "Angola Telecom",
    "Multitel Angola",
    "BAI Angola",
    "TAAG Angola",
    "Endiama"
  ];
  
  // Gerando dados simulados
  const mockJobs: Job[] = [];
  
  for (let i = 1; i <= 100; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const jobType = jobTypes[Math.floor(Math.random() * jobTypes.length)];
    
    // Gerar um título baseado na categoria
    let title = "";
    switch (category) {
      case "Tecnologia da Informação":
        title = ["Desenvolvedor Web", "Analista de Sistemas", "Engenheiro de Software", "Especialista em Segurança da Informação", "Técnico de Suporte", "Analista de Dados"][Math.floor(Math.random() * 6)];
        break;
      case "Petróleo e Gás":
        title = ["Engenheiro de Petróleo", "Geólogo", "Técnico de Produção", "Especialista em Perfuração", "Analista de Reservatórios"][Math.floor(Math.random() * 5)];
        break;
      case "Finanças":
        title = ["Contador", "Analista Financeiro", "Gerente de Contas", "Auditor", "Especialista em Investimentos"][Math.floor(Math.random() * 5)];
        break;
      case "Saúde":
        title = ["Médico", "Enfermeiro", "Técnico de Laboratório", "Farmacêutico", "Fisioterapeuta"][Math.floor(Math.random() * 5)];
        break;
      case "Educação":
        title = ["Professor", "Coordenador Pedagógico", "Tutor", "Instrutor de Idiomas", "Pesquisador"][Math.floor(Math.random() * 5)];
        break;
      default:
        title = ["Analista", "Gerente", "Coordenador", "Assistente", "Especialista", "Consultor"][Math.floor(Math.random() * 6)] + " de " + category;
    }
    
    // Gerar salário aleatório (alguns sem salário)
    const hasSalary = Math.random() > 0.3;
    const salary = hasSalary ? Math.floor(Math.random() * 400000) + 100000 : undefined;
    
    // Gerar data de publicação aleatória nos últimos 30 dias
    const today = new Date();
    const daysAgo = Math.floor(Math.random() * 30);
    const publishDate = new Date(today);
    publishDate.setDate(today.getDate() - daysAgo);
    
    // Gerar descrição
    const description = `
      <p><strong>Sobre a Vaga:</strong></p>
      <p>A ${company} está contratando um(a) ${title} para trabalhar em ${location}. O candidato ideal deve ter experiência na área e conhecimentos em ${category}.</p>
      
      <p><strong>Responsabilidades:</strong></p>
      <ul>
        <li>Realizar atividades relacionadas à função de ${title}</li>
        <li>Trabalhar em equipe para atingir metas estabelecidas</li>
        <li>Contribuir para o crescimento da empresa na área de ${category}</li>
        <li>Reportar diretamente ao gerente de departamento</li>
        <li>Participar de reuniões periódicas de acompanhamento</li>
      </ul>
      
      <p><strong>Qualificações:</strong></p>
      <ul>
        <li>Formação acadêmica em área relacionada</li>
        <li>Experiência mínima de 2 anos em funções similares</li>
        <li>Conhecimentos avançados em ferramentas específicas da área</li>
        <li>Habilidades de comunicação e trabalho em equipe</li>
        <li>Domínio de Português, conhecimentos de Inglês desejáveis</li>
      </ul>
      
      <p><strong>Benefícios:</strong></p>
      <ul>
        <li>Salário competitivo${salary ? `: aproximadamente ${salary} AOA` : ''}</li>
        <li>Plano de saúde</li>
        <li>Vale alimentação</li>
        <li>Oportunidades de desenvolvimento profissional</li>
      </ul>
    `;
    
    // Requisitos
    const requirements = [
      "Formação em " + category,
      "Experiência mínima de 2 anos",
      "Conhecimentos em ferramentas específicas",
      "Capacidade de trabalhar em equipe",
      "Boas habilidades de comunicação"
    ];
    
    // Criar o objeto de vaga
    const job: Job = {
      id: `job-${i}`,
      title,
      company,
      location,
      salary,
      category,
      type: jobType,
      publishedDate: publishDate.toISOString(),
      shortDescription: `Estamos procurando um ${title} para trabalhar em nossa unidade de ${location}. O candidato ideal deve ter experiência na área de ${category}.`,
      description,
      requirements,
      applyUrl: "#"
    };
    
    mockJobs.push(job);
  }
  
  // Se houver uma consulta de pesquisa, filtrar os resultados
  if (query) {
    const lowerQuery = query.toLowerCase();
    return mockJobs.filter(job => 
      job.title.toLowerCase().includes(lowerQuery) ||
      job.company.toLowerCase().includes(lowerQuery) ||
      job.description.toLowerCase().includes(lowerQuery) ||
      job.category.toLowerCase().includes(lowerQuery)
    );
  }
  
  return mockJobs;
};
