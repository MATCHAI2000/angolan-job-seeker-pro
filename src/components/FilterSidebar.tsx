
import React from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface FilterSidebarProps {
  locations: string[];
  categories: string[];
  selectedLocations: string[];
  selectedCategories: string[];
  salaryRange: [number, number];
  maxSalary: number;
  onLocationChange: (location: string) => void;
  onCategoryChange: (category: string) => void;
  onSalaryChange: (range: [number, number]) => void;
  onReset: () => void;
  visible: boolean;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  locations,
  categories,
  selectedLocations,
  selectedCategories,
  salaryRange,
  maxSalary,
  onLocationChange,
  onCategoryChange,
  onSalaryChange,
  onReset,
  visible
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className={`filter-container ${visible ? 'show' : 'hide'} transition-all duration-300 ease-in-out`}>
      <Card className="p-4 mb-4 bg-angola-secondary border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-angola-primary">Filtros</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onReset} 
            className="text-sm"
          >
            Limpar Filtros
          </Button>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold mb-2 text-angola-dark">Localização</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {locations.map((location) => (
              <div key={location} className="flex items-center">
                <Checkbox 
                  id={`location-${location}`} 
                  checked={selectedLocations.includes(location)}
                  onCheckedChange={() => onLocationChange(location)}
                />
                <Label 
                  htmlFor={`location-${location}`} 
                  className="ml-2 cursor-pointer"
                >
                  {location}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold mb-2 text-angola-dark">Categorias</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {categories.map((category) => (
              <div key={category} className="flex items-center">
                <Checkbox 
                  id={`category-${category}`} 
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => onCategoryChange(category)}
                />
                <Label 
                  htmlFor={`category-${category}`} 
                  className="ml-2 cursor-pointer"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-semibold mb-2 text-angola-dark">Faixa Salarial</h4>
          <Slider
            min={0}
            max={maxSalary}
            step={10000}
            value={[salaryRange[0], salaryRange[1]]}
            onValueChange={(value) => onSalaryChange(value as [number, number])}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{formatCurrency(salaryRange[0])}</span>
            <span>{formatCurrency(salaryRange[1])}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FilterSidebar;
