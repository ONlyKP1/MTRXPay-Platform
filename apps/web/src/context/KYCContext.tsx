import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { KYCData, KYCStep, CompanyDetails, Director } from '../types/kyc';
import { storage } from '../utils/storage';

interface KYCContextType {
  data: KYCData;
  currentStep: KYCStep;
  setCurrentStep: (step: KYCStep) => void;
  saveCompanyDetails: (details: CompanyDetails) => void;
  addDirector: (director: Director) => void;
  removeDirector: (id: string) => void;
  setDocumentsUploaded: (uploaded: boolean) => void;
  setSumsubApplicantId: (id: string) => void;
  resetKYCData: () => void;
}

const initialKYCData: KYCData = {
  company: null,
  directors: [],
  documentsUploaded: false,
};

const KYCContext = createContext<KYCContextType | null>(null);

export function KYCProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<KYCData>(initialKYCData);
  const [currentStep, setCurrentStep] = useState<KYCStep>('business-details');

  useEffect(() => {
    const savedData = storage.getKYCData();
    if (savedData) {
      setData(savedData);
    }
  }, []);

  const saveData = (newData: KYCData) => {
    setData(newData);
    storage.setKYCData(newData);
  };

  const saveCompanyDetails = (details: CompanyDetails) => {
    saveData({ ...data, company: details });
  };

  const addDirector = (director: Director) => {
    const newDirector = { ...director, id: crypto.randomUUID() };
    saveData({ ...data, directors: [...data.directors, newDirector] });
  };

  const removeDirector = (id: string) => {
    saveData({
      ...data,
      directors: data.directors.filter((d) => d.id !== id),
    });
  };

  const setDocumentsUploaded = (uploaded: boolean) => {
    saveData({ ...data, documentsUploaded: uploaded });
  };

  const setSumsubApplicantId = (id: string) => {
    saveData({ ...data, sumsubApplicantId: id });
  };

  const resetKYCData = () => {
    setData(initialKYCData);
    setCurrentStep('business-details');
    storage.removeKYCData();
  };

  return (
    <KYCContext.Provider
      value={{
        data,
        currentStep,
        setCurrentStep,
        saveCompanyDetails,
        addDirector,
        removeDirector,
        setDocumentsUploaded,
        setSumsubApplicantId,
        resetKYCData,
      }}
    >
      {children}
    </KYCContext.Provider>
  );
}

export function useKYC() {
  const context = useContext(KYCContext);
  if (!context) {
    throw new Error('useKYC must be used within a KYCProvider');
  }
  return context;
}
