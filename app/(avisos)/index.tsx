import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, Text, View, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import AvisoCard, { AvisoItem } from '../../components/AvisoCard';
import { AvisosService } from '../../services/AvisosService';
import { useUser } from '../../contexts/UserContext';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import EmptyState from '../../components/EmptyState';

export default function AvisosScreen() {
  const [avisos, setAvisos] = useState<AvisoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isAdmin } = useUser();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const unsubscribe = AvisosService.escutarAvisos((listaAvisos) => {
      setAvisos(listaAvisos);
      setLoading(false);
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, []);

  const carregarAvisos = async () => {
    setRefreshing(true);
    try {
      const listaAvisos = await AvisosService.obterAvisos();
      setAvisos(listaAvisos);
    } catch (error) {
      console.error('Erro ao carregar avisos:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const removerAviso = async (id: string) => {
    try {
      await AvisosService.removerAviso(id);
    } catch (error) {
      console.error('Erro ao remover aviso:', error);
    }
  };

  const navegarParaPostar = () => {
    router.push('/postar');
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Carregando avisos...</Text>
      </View>
    );
  }

  return (
    <View style={[
      styles.container, 
      { backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f5f5f5' }
    ]}>
      {avisos.length > 0 ? (
        <FlatList
          data={avisos}
          renderItem={({ item }) => (
            <AvisoCard 
              aviso={item} 
              isAdmin={isAdmin} 
              onDelete={removerAviso}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={carregarAvisos}
              colors={['#3498db']}
            />
          }
        />
      ) : (
        <EmptyState
          title="Nenhum aviso disponível"
          message="Seja o primeiro a compartilhar um aviso com a comunidade!"
          icon="bullhorn"
          buttonText="Criar Novo Aviso"
          onButtonPress={navegarParaPostar}
        />
      )}

      <TouchableOpacity 
        style={styles.fabButton}
        onPress={navegarParaPostar}
      >
        <FontAwesome name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
}); 