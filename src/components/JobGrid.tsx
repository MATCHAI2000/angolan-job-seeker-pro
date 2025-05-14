
import React from 'react';
import JobCard from './JobCard';
import { Job } from '@/types/job';

interface JobGridProps {
  jobs: Job[];
  isGridView: boolean;
  loading: boolean;
}

const JobGrid: React.FC<JobGridProps> = ({ jobs, isGridView, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="loader"></span>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <i className="fas fa-search fa-3x mb-4"></i>
        <h3 className="text-xl font-semibold">Nenhuma vaga encontrada</h3>
        <p>Tente ajustar seus filtros ou termos de busca</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${isGridView ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} isGridView={isGridView} />
      ))}
    </div>
  );
};

export default JobGrid;
