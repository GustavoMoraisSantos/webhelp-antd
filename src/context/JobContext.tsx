import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Job {
  job: string;
  nivel: string;
  description: string;
  technologies: { name: string; ratingRequired: number }[];
  createdAt: string;
}

interface JobContextProps {
  jobs: Job[];
  addJob: (newJob: Job) => void;
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

  return (
    <JobContext.Provider value={{ jobs, addJob }}>
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
