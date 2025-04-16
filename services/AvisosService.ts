import AsyncStorage from '@react-native-async-storage/async-storage';
import { simulateNetworkDelay } from '../app/firebase';
import { AvisoItem } from '../components/AvisoCard';

// Dados iniciais para demonstração
const dadosIniciais: AvisoItem[] = [
  {
    id: '1',
    titulo: 'Manutenção na Rede de Água',
    descricao: 'Informamos que haverá interrupção no fornecimento de água na Rua dos Lírios entre 8h e 14h neste sábado devido a obras de manutenção.',
    autor: 'Maria Silva',
    data: new Date(Date.now() - 86400000).toLocaleString('pt-BR')
  },
  {
    id: '2',
    titulo: 'Feira de Artesanato',
    descricao: 'Neste domingo, das 9h às 17h, teremos uma feira de artesanato na praça central. Venha prestigiar os artistas locais!',
    autor: 'João Mendes',
    data: new Date(Date.now() - 43200000).toLocaleString('pt-BR')
  },
  {
    id: '3',
    titulo: 'Cuidado! Rua Alagada',
    descricao: 'A Rua das Palmeiras está alagada devido às fortes chuvas. Procure rotas alternativas.',
    autor: 'Pedro Alves',
    data: new Date().toLocaleString('pt-BR')
  },
  {
    id: '4',
    titulo: 'Coleta de Lixo Reciclável',
    descricao: 'A coleta de lixo reciclável passará na quinta-feira nesta semana, em vez de terça-feira. Por favor, coloque os materiais na calçada até 7h da manhã.',
    autor: 'Departamento de Limpeza Urbana',
    data: new Date(Date.now() - 129600000).toLocaleString('pt-BR')
  },
  {
    id: '5',
    titulo: 'Vacinação de Animais',
    descricao: 'Neste sábado haverá vacinação gratuita para cães e gatos no Centro Comunitário, das 9h às 16h. Traga seu animal com coleira e guia.',
    autor: 'Vigilância Sanitária',
    data: new Date(Date.now() - 172800000).toLocaleString('pt-BR')
  }
];

// Chave para armazenamento no AsyncStorage
const STORAGE_KEY = '@AvisosComunidade:avisos';

// Inicializa o armazenamento local com os dados iniciais (apenas uma vez)
const inicializarArmazenamento = async () => {
  try {
    const avisosArmazenados = await AsyncStorage.getItem(STORAGE_KEY);
    if (avisosArmazenados === null) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dadosIniciais));
    }
  } catch (error) {
    console.error('Erro ao inicializar dados:', error);
  }
};

// Inicializa o armazenamento assim que o arquivo for importado
inicializarArmazenamento();

export class AvisosService {
  // Adicionar um novo aviso
  static async adicionarAviso(aviso: Omit<AvisoItem, 'id'>): Promise<string> {
    try {
      // Simular operação de rede
      await simulateNetworkDelay();
      
      // Obter avisos existentes
      const avisosString = await AsyncStorage.getItem(STORAGE_KEY);
      const avisos: AvisoItem[] = avisosString ? JSON.parse(avisosString) : [];
      
      // Criar ID único
      const novoId = Date.now().toString();
      
      // Adicionar novo aviso
      const novoAviso: AvisoItem = {
        id: novoId,
        ...aviso
      };
      
      // Atualizar lista de avisos
      const novosAvisos = [novoAviso, ...avisos];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novosAvisos));
      
      return novoId;
    } catch (error) {
      console.error('Erro ao adicionar aviso:', error);
      throw new Error('Falha ao adicionar aviso');
    }
  }

  // Obter todos os avisos
  static async obterAvisos(): Promise<AvisoItem[]> {
    try {
      // Simular operação de rede
      await simulateNetworkDelay();
      
      // Obter avisos do armazenamento local
      const avisosString = await AsyncStorage.getItem(STORAGE_KEY);
      const avisos: AvisoItem[] = avisosString ? JSON.parse(avisosString) : [];
      
      // Ordenar por data (mais recentes primeiro)
      return avisos.sort((a, b) => 
        new Date(b.data).getTime() - new Date(a.data).getTime()
      );
    } catch (error) {
      console.error('Erro ao obter avisos:', error);
      throw new Error('Falha ao obter avisos');
    }
  }

  // Escutar alterações nos avisos (simulação, pois AsyncStorage não tem listener)
  static escutarAvisos(callback: (avisos: AvisoItem[]) => void): () => void {
    // Como AsyncStorage não tem suporte a listeners, apenas retornamos os dados uma vez
    this.obterAvisos().then(avisos => {
      callback(avisos);
    }).catch(error => {
      console.error('Erro ao observar avisos:', error);
    });
    
    // Para compatibilidade com a API anterior
    return () => {};
  }

  // Remover um aviso
  static async removerAviso(id: string): Promise<void> {
    try {
      // Simular operação de rede
      await simulateNetworkDelay();
      
      // Obter avisos existentes
      const avisosString = await AsyncStorage.getItem(STORAGE_KEY);
      const avisos: AvisoItem[] = avisosString ? JSON.parse(avisosString) : [];
      
      // Remover o aviso com o ID especificado
      const novosAvisos = avisos.filter(aviso => aviso.id !== id);
      
      // Atualizar armazenamento
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novosAvisos));
    } catch (error) {
      console.error('Erro ao remover aviso:', error);
      throw new Error('Falha ao remover aviso');
    }
  }

  // Obter um aviso específico pelo ID
  static async obterAvisoPorId(id: string): Promise<AvisoItem | null> {
    try {
      // Simular operação de rede
      await simulateNetworkDelay();
      
      // Obter todos os avisos
      const avisosString = await AsyncStorage.getItem(STORAGE_KEY);
      const avisos: AvisoItem[] = avisosString ? JSON.parse(avisosString) : [];
      
      // Encontrar aviso pelo ID
      const aviso = avisos.find(a => a.id === id);
      return aviso || null;
    } catch (error) {
      console.error('Erro ao obter aviso específico:', error);
      throw new Error('Falha ao obter aviso');
    }
  }
} 