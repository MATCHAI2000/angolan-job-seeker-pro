
import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string) => void;
  onToggleView: () => void;
  isGridView: boolean;
  onToggleFilters: () => void;
  showFilters: boolean;
  onExportCSV: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onSearch, 
  onToggleView, 
  isGridView, 
  onToggleFilters, 
  showFilters,
  onExportCSV
}) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    toast({
      title: "Pesquisa iniciada",
      description: `Buscando por "${searchQuery}"`,
    });
  };

  return (
    <header className="bg-angola-primary text-white py-4 shadow-md">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-2xl font-bold">
              Ango<span className="text-angola-accent">Job</span>
            </h1>
            <p className="text-sm text-angola-secondary">Encontre as melhores vagas em Angola</p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="bg-white text-angola-primary hover:bg-angola-secondary"
              onClick={onToggleFilters}
            >
              {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            </Button>
            
            <Button 
              variant="outline" 
              className="bg-white text-angola-primary hover:bg-angola-secondary"
              onClick={onToggleView}
            >
              {isGridView ? (
                <><i className="fas fa-list me-2"></i>Lista</>
              ) : (
                <><i className="fas fa-th-large me-2"></i>Grade</>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              className="bg-angola-accent text-angola-dark hover:bg-angola-accent/80"
              onClick={onExportCSV}
            >
              <i className="fas fa-download me-2"></i>
              Exportar CSV
            </Button>
          </div>
        </div>
        
        <form onSubmit={handleSearch} className="flex w-full max-w-4xl mx-auto">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Buscar vagas por título, empresa ou palavra-chave..."
              className="py-2 px-4 w-full text-black rounded-l-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <Button 
            type="submit" 
            className="bg-angola-accent hover:bg-angola-accent/80 text-angola-dark font-bold py-2 px-6 rounded-r-md"
          >
            Buscar
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
