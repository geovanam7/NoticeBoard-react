import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserContextType {
  userName: string;
  setUserName: (name: string) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  lastUsedAuthor: string;
  setLastUsedAuthor: (author: string) => void;
  saveUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState<string>('Usuário');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [lastUsedAuthor, setLastUsedAuthor] = useState<string>('');

  // Carregar os dados salvos quando o app inicia
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const savedUserName = await AsyncStorage.getItem('userName');
        const savedIsAdmin = await AsyncStorage.getItem('isAdmin');
        const savedLastAuthor = await AsyncStorage.getItem('lastUsedAuthor');

        if (savedUserName) setUserName(savedUserName);
        if (savedIsAdmin) setIsAdmin(savedIsAdmin === 'true');
        if (savedLastAuthor) setLastUsedAuthor(savedLastAuthor);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    };

    loadUserData();
  }, []);

  // Salvar os dados quando eles mudam
  const saveUserData = async () => {
    try {
      await AsyncStorage.setItem('userName', userName);
      await AsyncStorage.setItem('isAdmin', String(isAdmin));
      await AsyncStorage.setItem('lastUsedAuthor', lastUsedAuthor);
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userName,
        setUserName,
        isAdmin,
        setIsAdmin,
        lastUsedAuthor,
        setLastUsedAuthor,
        saveUserData
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
}; 