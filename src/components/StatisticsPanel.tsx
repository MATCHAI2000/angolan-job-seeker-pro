
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Job } from '@/types/job';

interface StatisticsPanelProps {
  jobs: Job[];
  visible: boolean;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ jobs, visible }) => {
  const [activeTab, setActiveTab] = React.useState('geral');

  React.useEffect(() => {
    if (visible && jobs.length > 0) {
      setTimeout(() => {
        renderCharts();
      }, 100);
    }
  }, [visible, jobs, activeTab]);

  const renderCharts = () => {
    // Limpar canvas existentes para evitar problemas com renderização
    document.querySelectorAll('canvas').forEach(canvas => {
      // @ts-ignore
      if (canvas.chart) {
        // @ts-ignore
        canvas.chart.destroy();
      }
    });

    if (activeTab === 'geral' || activeTab === 'todas') {
      renderCategoryChart();
    }
    
    if (activeTab === 'geral' || activeTab === 'localizacao') {
      renderLocationChart();
    }
    
    if (activeTab === 'geral' || activeTab === 'salario') {
      renderSalaryChart();
    }
  };

  const renderCategoryChart = () => {
    if (!window.Chart) return;
    
    const categoryCount: {[key: string]: number} = {};
    jobs.forEach(job => {
      if (job.category) {
        categoryCount[job.category] = (categoryCount[job.category] || 0) + 1;
      }
    });

    const categories = Object.keys(categoryCount);
    const counts = Object.values(categoryCount);

    const ctx = document.getElementById('categoryChart') as HTMLCanvasElement;
    if (!ctx) return;

    // @ts-ignore
    const chart = new window.Chart(ctx, {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [{
          label: 'Vagas por Categoria',
          data: counts,
          backgroundColor: 'rgba(0, 86, 179, 0.7)',
          borderColor: 'rgba(0, 86, 179, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });

    // @ts-ignore
    ctx.chart = chart;
  };

  const renderLocationChart = () => {
    if (!window.Chart) return;
    
    const locationCount: {[key: string]: number} = {};
    jobs.forEach(job => {
      if (job.location) {
        locationCount[job.location] = (locationCount[job.location] || 0) + 1;
      }
    });

    const locations = Object.keys(locationCount);
    const counts = Object.values(locationCount);

    const ctx = document.getElementById('locationChart') as HTMLCanvasElement;
    if (!ctx) return;

    // @ts-ignore
    const chart = new window.Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: locations,
        datasets: [{
          data: counts,
          backgroundColor: [
            'rgba(0, 86, 179, 0.7)',
            'rgba(255, 193, 7, 0.7)',
            'rgba(40, 167, 69, 0.7)',
            'rgba(220, 53, 69, 0.7)',
            'rgba(111, 66, 193, 0.7)',
            'rgba(23, 162, 184, 0.7)',
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    });

    // @ts-ignore
    ctx.chart = chart;
  };

  const renderSalaryChart = () => {
    if (!window.Chart) return;
    
    // Filtrar vagas com salário
    const jobsWithSalary = jobs.filter(job => job.salary);
    
    if (jobsWithSalary.length === 0) return;
    
    // Definir faixas salariais
    const ranges = [
      { min: 0, max: 100000, label: '0-100k' },
      { min: 100000, max: 200000, label: '100k-200k' },
      { min: 200000, max: 300000, label: '200k-300k' },
      { min: 300000, max: 400000, label: '300k-400k' },
      { min: 400000, max: 500000, label: '400k-500k' },
      { min: 500000, max: Infinity, label: '500k+' }
    ];
    
    const rangeCounts = ranges.map(range => ({
      ...range,
      count: jobsWithSalary.filter(job => 
        job.salary >= range.min && job.salary < range.max
      ).length
    }));
    
    const ctx = document.getElementById('salaryChart') as HTMLCanvasElement;
    if (!ctx) return;

    // @ts-ignore
    const chart = new window.Chart(ctx, {
      type: 'bar',
      data: {
        labels: rangeCounts.map(r => r.label),
        datasets: [{
          label: 'Vagas por Faixa Salarial (AOA)',
          data: rangeCounts.map(r => r.count),
          backgroundColor: 'rgba(255, 193, 7, 0.7)',
          borderColor: 'rgba(255, 193, 7, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });

    // @ts-ignore
    ctx.chart = chart;
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
                <canvas id="categoryChart"></canvas>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <h4 className="text-sm font-medium mb-2">Vagas por Localização</h4>
              <div className="h-40">
                <canvas id="locationChart"></canvas>
              </div>
            </div>
            
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 md:col-span-2 lg:col-span-1">
              <h4 className="text-sm font-medium mb-2">Distribuição de Salários</h4>
              <div className="h-40">
                <canvas id="salaryChart"></canvas>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="todas">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <h4 className="text-sm font-medium mb-2">Vagas por Categoria</h4>
              <div className="h-64">
                <canvas id="categoryChart"></canvas>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="localizacao">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <h4 className="text-sm font-medium mb-2">Vagas por Localização</h4>
              <div className="h-64">
                <canvas id="locationChart"></canvas>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="salario">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <h4 className="text-sm font-medium mb-2">Distribuição de Salários</h4>
              <div className="h-64">
                <canvas id="salaryChart"></canvas>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StatisticsPanel;
