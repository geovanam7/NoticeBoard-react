// Sistema de armazenamento local (sem Firebase)
import AsyncStorage from '@react-native-async-storage/async-storage';

// Função para simular atraso de rede (para demonstração)
const simulateNetworkDelay = async () => {
  // Simular um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 800));
  return true;
};

// Exportar apenas a função de simulação
export { simulateNetworkDelay }; 