import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { AvisosService } from '../../../services/AvisosService';
import { AvisoItem } from '../../../components/AvisoCard';
import { useUser } from '../../../contexts/UserContext';
import EmptyState from '../../../components/EmptyState';

export default function DetalheAvisoScreen() {
  const { id } = useLocalSearchParams();
  const [aviso, setAviso] = useState<AvisoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useUser();
  const colorScheme = useColorScheme();
  const router = useRouter();
  
  const textColor = colorScheme === 'dark' ? '#fff' : '#000';
  const backgroundColor = colorScheme === 'dark' ? '#1a1a1a' : '#f5f5f5';
  const cardBgColor = colorScheme === 'dark' ? '#2c3e50' : '#fff';
  const subTextColor = colorScheme === 'dark' ? '#bdc3c7' : '#7f8c8d';
  const accentColor = '#3498db';

  useEffect(() => {
    carregarAviso();
  }, [id]);

  const carregarAviso = async () => {
    if (!id || typeof id !== 'string') {
      setLoading(false);
      return;
    }

    try {
      const avisoData = await AvisosService.obterAvisoPorId(id);
      setAviso(avisoData);
    } catch (error) {
      console.error('Erro ao carregar aviso:', error);
    } finally {
      setLoading(false);
    }
  };

  const compartilharAviso = async () => {
    if (!aviso) return;

    try {
      await Share.share({
        message: `${aviso.titulo}\n\n${aviso.descricao}\n\nCompartilhado pelo App Avisos Comunidade`,
        title: aviso.titulo
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  };

  const removerAviso = async () => {
    if (!aviso || !isAdmin) return;

    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este aviso?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await AvisosService.removerAviso(aviso.id);
              Alert.alert('Sucesso', 'Aviso removido com sucesso!');
              router.replace('/');
            } catch (error) {
              console.error('Erro ao remover aviso:', error);
              Alert.alert('Erro', 'Houve um erro ao remover o aviso.');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={accentColor} />
        <Text style={[styles.loadingText, { color: subTextColor }]}>Carregando aviso...</Text>
      </View>
    );
  }

  if (!aviso) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <EmptyState 
          title="Aviso não encontrado"
          message="O aviso que você está procurando não existe ou foi removido."
          icon="exclamation-circle"
          buttonText="Voltar para Avisos"
          onButtonPress={() => router.replace('/')}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView>
        <View style={[styles.avisoCard, { backgroundColor: cardBgColor }]}>
          <Text style={[styles.avisoTitulo, { color: textColor }]}>{aviso.titulo}</Text>
          
          <Text style={[styles.avisoDescricao, { color: colorScheme === 'dark' ? '#ecf0f1' : '#333' }]}>
            {aviso.descricao}
          </Text>
          
          <View style={styles.avisoFooter}>
            <Text style={[styles.avisoAutor, { color: subTextColor }]}>
              Por: {aviso.autor}
            </Text>
            <Text style={[styles.avisoData, { color: subTextColor }]}>
              {aviso.data}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: accentColor }]}
          onPress={compartilharAviso}
        >
          <FontAwesome name="share-alt" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Compartilhar</Text>
        </TouchableOpacity>

        {isAdmin && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#e74c3c' }]}
            onPress={removerAviso}
          >
            <FontAwesome name="trash" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Remover</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  avisoCard: {
    margin: 16,
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avisoTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  avisoDescricao: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
  avisoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 16,
    marginTop: 8,
  },
  avisoAutor: {
    fontSize: 14,
  },
  avisoData: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 