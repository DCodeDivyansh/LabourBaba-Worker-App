import React, { createContext, useContext, useState } from 'react';

interface OnlineContextType {
  isOnline: boolean;
  setIsOnline: (value: boolean) => void;
}

const OnlineStatusContext = createContext<OnlineContextType | undefined>(undefined);

export const OnlineStatusProvider = ({ children }: any) => {
  const [isOnline, setIsOnline] = useState(false);

  return (
    <OnlineStatusContext.Provider value={{ isOnline, setIsOnline }}>
      {children}
    </OnlineStatusContext.Provider>
  );
};

export const useOnlineStatus = () => {
  const context = useContext(OnlineStatusContext);

  if (!context) {
    throw new Error('useOnlineStatus must be used inside OnlineStatusProvider');
  }

  return context;
};
