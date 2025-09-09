import React, { createContext, useContext, useState } from 'react';
import { LocalFsProvider } from './LocalFsProvider';

const StorageCtx = createContext(null);

export function StorageProvider({ children }) {
  const [provider] = useState(() => new LocalFsProvider());
  return <StorageCtx.Provider value={provider}>{children}</StorageCtx.Provider>;
}

export const useStorage = () => useContext(StorageCtx);
