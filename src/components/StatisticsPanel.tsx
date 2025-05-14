
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Job } from '@/types/job';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface StatisticsPanelProps {
  jobs: Job[];
  visible: boolean;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ jobs, visible }) => {
  const [activeTab, setActiveTab] = React.useState('geral');
  const [categoryData, setCategoryData] = React.useState<{name: string, value: number}[]>([]);
  const [locationData, setLocationData] = React.useState<{name: string, value: number}[]>([]);
  const [salaryData, setSalaryData] = React.useState<{name: string, value: number}[]>([]);

  React.useEffect(() => {
    if (visible && jobs.length > 0) {
      generateChartData();
    }
  }, [visible, jobs, activeTab]);

  const generateChartData = () => {
    // Gerar dados para o gráfico de categorias
    const categoryCount: {[key: string]: number} = {};
    jobs.forEach(job => {
      if (job.category) {
        categoryCount[job.category] = (categoryCount[job.category] || 0) + 1;
      }
    });
    const categories = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
    setCategoryData(categories);

    // Gerar dados para o gráfico de localização
    const locationCount: {[key: string]: number} = {};
    jobs.forEach(job => {
      if (job.location) {
        locationCount[job.location] = (locationCount[job.location] || 0) + 1;
      }
    });
    const locations = Object.entries(locationCount).map(([name, value]) => ({ name, value }));
    setLocationData(locations);

    // Gerar dados para o gráfico de salários
    const jobsWithSalary = jobs.filter(job => job.salary);
    
    if (jobsWithSalary.length === 0) return;
    
    // Definir faixas salariais
    const ranges = [
      { min: 0, max: 100000, name: '0-100k' },
      { min: 100000, max: 200000, name: '100k-200k' },
      { min: 200000, max: 300000, name: '200k-300k' },
      { min: 300000, max: 400000, name: '300k-400k' },
      { min: 400000, max: 500000, name: '400k-500k' },
      { min: 500000, max: Infinity, name: '500k+' }
    ];
    
    const rangeCounts = ranges.map(range => ({
      name: range.name,
      value: jobsWithSalary.filter(job => 
        job.salary >= range.min && job.salary < range.max
      ).length
    }));
    
    setSalaryData(rangeCounts);
  };

  // Calcular estatísticas
  const totalJobs = jobs.length;
  const uniqueCategories = [...new Set(jobs.map(job => job.category))].length;
  const uniqueLocations = [...new Set(jobs.map(job => job.location))].length;
  const jobsWithSalary = jobs.filter(job => job.salary);
  const averageSalary = jobsWithSalary.length > 0 
    ? Math.round(jobsWithSalary.reduce((acc, job) => acc + job.salary, 0) / jobsWithSalary.length)
    : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      maximumFractionDigits: 0
    }).format(value);
  };

  const COLORS = ['#0056B3', '#FFC107', '#28A745', '#DC3545', '#6F42C1', '#17A2B8'];

  if (!visible) return null;

  return (
    <Card className="mb-6 bg-angola-secondary border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-angola-primary">Estatísticas</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm mb-1">Total de Vagas</p>
            <p className="text-3xl font-bold text-angola-primary">{totalJobs}</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm mb-1">Categorias</p>
            <p className="text-3xl font-bold text-angola-primary">{uniqueCategories}</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm mb-1">Localizações</p>
            <p className="text-3xl font-bold text-angola-primary">{uniqueLocations}</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm mb-1">Salário Médio</p>
            <p className="text-2xl font-bold text-angola-primary">
              {jobsWithSalary.length > 0 ? formatCurrency(averageSalary) : 'N/A'}
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="geral" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="todas">Categorias</TabsTrigger>
            <TabsTrigger value="localizacao">Localização</TabsTrigger>
            <TabsTrigger value="salario">Salários</TabsTrigger>
          </TabsList>
          
          <TabsContent value="geral" className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <h4 className="text-sm font-medium mb-2">Vagas por Categoria</h4>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0056B3" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <h4 className="text-sm font-medium mb-2">Vagas por Localização</h4>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={locationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {locationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 md:col-span-2 lg:col-span-1">
              <h4 className="text-sm font-medium mb-2">Distribuição de Salários</h4>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salaryData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#FFC107" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="todas">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <h4 className="text-sm font-medium mb-2">Vagas por Categoria</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0056B3" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="localizacao">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <h4 className="text-sm font-medium mb-2">Vagas por Localização</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={locationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {locationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="salario">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <h4 className="text-sm font-medium mb-2">Distribuição de Salários</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salaryData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#FFC107" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StatisticsPanel;
