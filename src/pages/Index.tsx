
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import Header from '@/components/Header';
import FilterSidebar from '@/components/FilterSidebar';
import JobGrid from '@/components/JobGrid';
import StatisticsPanel from '@/components/StatisticsPanel';
import Footer from '@/components/Footer';
import { Job } from '@/types/job';
import { scrapeJobs, filterJobs, sortJobs, jobsToCSV, saveCSV, jobCache } from '@/utils/jobScraper';

const Index = () => {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGridView, setIsGridView] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [showStats, setShowStats] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  
  // Estado para filtros
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState<[number, number]>([0, 1000000]);
  const [maxSalary, setMaxSalary] = useState(1000000);
  
  // Número de vagas por página para rolagem infinita
  const ITEMS_PER_PAGE = 12;
  
  // Carregar vagas do cache ou fazer scraping
  useEffect(() => {
    const loadJobs = async () => {
      try {
        // Tentar carregar do cache primeiro
        const cachedJobs = jobCache.load();
        
        if (cachedJobs) {
          setJobs(cachedJobs);
          setLoading(false);
          toast({
            title: "Vagas carregadas do cache",
            description: `${cachedJobs.length} vagas carregadas com sucesso`,
          });
        } else {
          // Se não houver cache, fazer scraping
          const scrapedJobs = await scrapeJobs();
          setJobs(scrapedJobs);
          
          // Salvar no cache
          jobCache.save(scrapedJobs);
          
          toast({
            title: "Vagas carregadas com sucesso",
            description: `${scrapedJobs.length} vagas encontradas`,
          });
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar vagas:", error);
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Erro ao carregar vagas",
          description: "Ocorreu um erro ao buscar as vagas. Tente novamente mais tarde.",
        });
      }
    };
    
    loadJobs();
  }, [toast]);
  
  // Extrair categorias e localizações únicas das vagas
  useEffect(() => {
    if (jobs.length) {
      const uniqueCategories = [...new Set(jobs.map(job => job.category))];
      const uniqueLocations = [...new Set(jobs.map(job => job.location))];
      const jobsWithSalary = jobs.filter(job => job.salary);
      const highestSalary = jobsWithSalary.length
        ? Math.max(...jobsWithSalary.map(job => job.salary || 0))
        : 1000000;
      
      setCategories(uniqueCategories);
      setLocations(uniqueLocations);
      setMaxSalary(highestSalary);
      setSalaryRange([0, highestSalary]);
    }
  }, [jobs]);
  
  // Aplicar filtros e ordenação
  useEffect(() => {
    const filtered = filterJobs(jobs, selectedCategories, selectedLocations, salaryRange, searchQuery);
    const sorted = sortJobs(filtered, sortBy);
    setFilteredJobs(sorted.slice(0, page * ITEMS_PER_PAGE));
    setHasMore(sorted.length > page * ITEMS_PER_PAGE);
  }, [jobs, selectedCategories, selectedLocations, salaryRange, searchQuery, sortBy, page]);
  
  // Callback para detectar quando o usuário chega ao final da página
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, loading]);
  
  // Configurar o Intersection Observer para rolagem infinita
  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0
    };
    
    const observer = new IntersectionObserver(handleObserver, option);
    
    if (loaderRef.current) observer.observe(loaderRef.current);
    
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);
  
  // Função para buscar vagas por termo
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setLoading(true);
    setPage(1);
    
    try {
      const searchResults = await scrapeJobs(query);
      setJobs(searchResults);
      toast({
        title: "Pesquisa concluída",
        description: `${searchResults.length} resultados encontrados para "${query}"`,
      });
    } catch (error) {
      console.error("Erro ao pesquisar:", error);
      toast({
        variant: "destructive",
        title: "Erro na pesquisa",
        description: "Ocorreu um erro ao buscar resultados. Tente novamente.",
      });
    }
    
    setLoading(false);
  };
  
  // Função para alternar entre visualizações de grade e lista
  const toggleView = () => {
    setIsGridView(!isGridView);
  };
  
  // Função para alternar a exibição dos filtros
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  // Funções para alterar filtros
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
    setPage(1);
  };
  
  const handleLocationChange = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location)
        ? prev.filter(loc => loc !== location)
        : [...prev, location]
    );
    setPage(1);
  };
  
  const handleSalaryChange = (range: [number, number]) => {
    setSalaryRange(range);
    setPage(1);
  };
  
  // Função para limpar todos os filtros
  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedLocations([]);
    setSalaryRange([0, maxSalary]);
    setSearchQuery('');
    setPage(1);
    toast({
      title: "Filtros redefinidos",
      description: "Todos os filtros foram limpos",
    });
  };
  
  // Função para exportar dados como CSV
  const handleExportCSV = () => {
    try {
      const csvContent = jobsToCSV(filteredJobs);
      saveCSV(csvContent, `ango-job-vagas-${new Date().toISOString().slice(0, 10)}.csv`);
      
      toast({
        title: "Dados exportados com sucesso",
        description: `${filteredJobs.length} vagas exportadas para CSV`,
      });
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      toast({
        variant: "destructive",
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados para CSV",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        onSearch={handleSearch}
        onToggleView={toggleView}
        isGridView={isGridView}
        onToggleFilters={toggleFilters}
        showFilters={showFilters}
        onExportCSV={handleExportCSV}
      />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        {/* Painel de estatísticas */}
        <StatisticsPanel jobs={jobs} visible={showStats} />
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar de filtros */}
          <div className="w-full md:w-64">
            <FilterSidebar 
              locations={locations}
              categories={categories}
              selectedLocations={selectedLocations}
              selectedCategories={selectedCategories}
              salaryRange={salaryRange}
              maxSalary={maxSalary}
              onLocationChange={handleLocationChange}
              onCategoryChange={handleCategoryChange}
              onSalaryChange={handleSalaryChange}
              onReset={resetFilters}
              visible={showFilters}
            />
          </div>
          
          {/* Conteúdo principal */}
          <div className="flex-grow">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-600">
                  {filteredJobs.length} resultado{filteredJobs.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <label htmlFor="sort-select" className="text-sm text-gray-600">Ordenar por:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-gray-300 rounded p-1"
                >
                  <option value="date">Data</option>
                  <option value="salary">Salário</option>
                </select>
              </div>
            </div>
            
            <JobGrid 
              jobs={filteredJobs}
              isGridView={isGridView}
              loading={loading}
            />
            
            {/* Loader para rolagem infinita */}
            {hasMore && !loading && (
              <div ref={loaderRef} className="flex justify-center my-4">
                <div className="loader"></div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;
