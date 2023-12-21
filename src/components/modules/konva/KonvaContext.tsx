import { createContext, useContext } from 'react';

export const KonvaContext = createContext<KonvaContextType | null>(null);

type KonvaContextType = {
  stageRef: any | null;
};

export const useKonvaContext = () => {
  const context = useContext(KonvaContext);
  if (!context) {
    console.error('useKonvaContext should be used inside a KonvaContextProvider');
  }
  return context;
};
