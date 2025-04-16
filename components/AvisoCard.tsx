import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

export type AvisoItem = {
  id: string;
  titulo: string;
  descricao: string;
  autor: string;
  data: string;
};

type AvisoCardProps = {
  aviso: AvisoItem;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
  showFullDescription?: boolean;
};

const AvisoCard: React.FC<AvisoCardProps> = ({ 
  aviso, 
  isAdmin = false, 
  onDelete,
  showFullDescription = false
}) => {
  const colorScheme = useColorScheme();
  
  const cardBgColor = colorScheme === 'dark' ? '#2c3e50' : '#fff';
  const textColor = colorScheme === 'dark' ? '#fff' : '#000';
  const subTextColor = colorScheme === 'dark' ? '#bdc3c7' : '#7f8c8d';

  const navigateToDetails = () => {
    router.push(`/aviso/${aviso.id}`);
  };

  return (
    <TouchableOpacity 
      style={[styles.avisoCard, { backgroundColor: cardBgColor }]}
      onPress={navigateToDetails}
      activeOpacity={0.7}
    >
      <View style={styles.avisoHeader}>
        <Text style={[styles.avisoTitulo, { color: textColor }]}>
          {aviso.titulo}
        </Text>
        {isAdmin && onDelete && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={(e) => {
              e.stopPropagation();
              onDelete(aviso.id);
            }}
          >
            <FontAwesome name="trash" size={18} color="#e74c3c" />
          </TouchableOpacity>
        )}
      </View>
      <Text 
        style={[styles.avisoDescricao, { color: colorScheme === 'dark' ? '#ecf0f1' : '#333' }]}
        numberOfLines={showFullDescription ? undefined : 3}
      >
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avisoCard: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avisoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  avisoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  avisoDescricao: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
  },
  avisoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  avisoAutor: {
    fontSize: 14,
  },
  avisoData: {
    fontSize: 14,
  },
  deleteButton: {
    padding: 5,
  },
});

export default AvisoCard; 