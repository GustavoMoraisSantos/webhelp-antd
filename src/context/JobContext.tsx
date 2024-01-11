import { Candidate } from '@/Utils/interfaces';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Job {
  id: string,
  job: string;
  nivel: string;
  description: string;
  technologies: { name: string; ratingRequired: number }[];
  createdAt: string;
  candidates?: Candidate[];
}

interface JobContextProps {
  jobs: Job[];
  addJob: (newJob: Job) => void;
  deleteJob: (id: string) => void;
  updateJob: any;
}

const JobContext = createContext<JobContextProps | undefined>(undefined);

interface JobProviderProps {
  children: ReactNode;
}

export const JobProvider: React.FC<JobProviderProps> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);

  const addJob = (newJob: Job) => {
    setJobs([...jobs, newJob]);
  };

  const deleteJob = (id: string) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  const updateJob = (updatedJobs: Job[]) => {
    setJobs(updatedJobs);
  };

  return (
    <JobContext.Provider value={{ jobs, addJob, deleteJob, updateJob }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = (): JobContextProps => {
  const context = useContext(JobContext);

  if (!context) {
    throw new Error('useJobContext deve ser usado dentro de JobProvider');
  }

  return context;
};
