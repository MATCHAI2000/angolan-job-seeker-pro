
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Job } from '@/types/job';
import { MapPin, BriefCase, DollarSign, Calendar } from 'lucide-react';

interface JobCardProps {
  job: Job;
  isGridView: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, isGridView }) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('pt-AO', options);
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('pt-AO', { 
      style: 'currency', 
      currency: 'AOA',
      maximumFractionDigits: 0
    }).format(salary);
  };

  return (
    <Card className={`job-card h-full ${isGridView ? 'w-full' : 'w-full'} border-gray-200 hover:border-angola-primary transition-all duration-200`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-angola-primary">{job.title}</h3>
            <p className="text-gray-700">{job.company}</p>
          </div>
          <Badge variant="outline" className="bg-angola-accent text-angola-dark">
            {job.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{job.location}</span>
          </div>
          
          {job.salary && (
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-4 w-4 mr-1" />
              <span>{formatSalary(job.salary)}</span>
            </div>
          )}
          
          <div className="flex items-center text-gray-600">
            <BriefCase className="h-4 w-4 mr-1" />
            <span>{job.type}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Publicado em {formatDate(job.publishedDate)}</span>
          </div>
        </div>
        
        <p className="text-gray-700 line-clamp-2">
          {job.shortDescription}
        </p>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-angola-primary hover:bg-angola-primary/90">
              Ver Detalhes
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-angola-primary">{job.title}</DialogTitle>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="bg-angola-accent text-angola-dark">
                  {job.category}
                </Badge>
                <Badge variant="outline" className="bg-gray-100">
                  {job.type}
                </Badge>
              </div>
            </DialogHeader>
            
            <div className="mt-4">
              <div className="flex items-center mb-1">
                <span className="font-semibold">Empresa:</span>
                <span className="ml-2">{job.company}</span>
              </div>
              <div className="flex items-center mb-1">
                <span className="font-semibold">Localização:</span>
                <span className="ml-2">{job.location}</span>
              </div>
              {job.salary && (
                <div className="flex items-center mb-1">
                  <span className="font-semibold">Salário:</span>
                  <span className="ml-2">{formatSalary(job.salary)}</span>
                </div>
              )}
              <div className="flex items-center mb-3">
                <span className="font-semibold">Data de Publicação:</span>
                <span className="ml-2">{formatDate(job.publishedDate)}</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Descrição da Vaga</h3>
              <div className="whitespace-pre-line text-gray-700" dangerouslySetInnerHTML={{ __html: job.description }} />
            </div>
            
            {job.requirements && (
              <>
                <Separator className="my-4" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Requisitos</h3>
                  <ul className="list-disc pl-5 text-gray-700">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="mb-1">{req}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
            
            <div className="mt-6 flex justify-end">
              <Button 
                className="bg-angola-primary hover:bg-angola-primary/90"
                onClick={() => window.open(job.applyUrl, '_blank')}
              >
                Candidatar-se
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
