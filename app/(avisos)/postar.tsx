import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { AvisosService } from '../../services/AvisosService';
import { useUser } from '../../contexts/UserContext';

export default function NovoAvisoScreen() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [autor, setAutor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { lastUsedAuthor, setLastUsedAuthor, saveUserData } = useUser();

  useEffect(() => {
    if (lastUsedAuthor) {
      setAutor(lastUsedAuthor);
    }
  }, [lastUsedAuthor]);

  const postarAviso = async () => {
    setError(null);
    
    if (!titulo.trim() || !descricao.trim() || !autor.trim()) {
      Alert.alert('Campos obrigatórios', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);

    try {
      if (autor !== lastUsedAuthor) {
        setLastUsedAuthor(autor);
        await saveUserData();
      }
      
      const novoAviso = {
        titulo,
        descricao,
        autor,
        data: new Date().toLocaleString('pt-BR'),
      };
      
      const avisoId = await AvisosService.adicionarAviso(novoAviso);
      
      if (avisoId) {
        Alert.alert('Sucesso', 'Aviso postado com sucesso!', [
          { text: 'OK', onPress: () => router.push('/') }
        ]);
        
        setTitulo('');
        setDescricao('');
      } else {
        throw new Error('Não foi possível criar o aviso');
      }
    } catch (error) {
      console.error('Erro ao postar aviso:', error);
      setError('Houve um erro ao postar o aviso. Tente novamente.');
      Alert.alert('Erro', 'Houve um erro ao postar o aviso. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const inputBgColor = colorScheme === 'dark' ? '#2c3e50' : '#fff';
  const inputTextColor = colorScheme === 'dark' ? '#fff' : '#000';
  const labelColor = colorScheme === 'dark' ? '#ecf0f1' : '#333';
  const placeholderColor = colorScheme === 'dark' ? '#7f8c8d' : '#bdc3c7';
  const buttonBgColor = '#3498db';
  const buttonTextColor = '#fff';
  const errorColor = '#e74c3c';

  return (
    <ScrollView 
      style={[
        styles.container, 
        { backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#f5f5f5' }
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: labelColor }]}>Postar Novo Aviso</Text>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: labelColor }]}>Título:</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: inputBgColor, color: inputTextColor }
          ]}
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Digite o título do aviso"
          placeholderTextColor={placeholderColor}
          editable={!loading}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: labelColor }]}>Descrição:</Text>
        <TextInput
          style={[
            styles.textArea,
            { backgroundColor: inputBgColor, color: inputTextColor }
          ]}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Digite a descrição detalhada do aviso"
          placeholderTextColor={placeholderColor}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          editable={!loading}
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: labelColor }]}>Seu Nome:</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: inputBgColor, color: inputTextColor }
          ]}
          value={autor}
          onChangeText={setAutor}
          placeholder="Digite seu nome"
          placeholderTextColor={placeholderColor}
          editable={!loading}
        />
      </View>
      
      {error && (
        <Text style={[styles.errorText, { color: errorColor }]}>
          {error}
        </Text>
      )}
      
      <TouchableOpacity 
        style={[
          styles.button, 
          { 
            backgroundColor: buttonBgColor,
            opacity: loading ? 0.7 : 1 
          }
        ]}
        onPress={postarAviso}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={buttonTextColor} />
        ) : (
          <Text style={[styles.buttonText, { color: buttonTextColor }]}>Publicar Aviso</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textArea: {
    height: 120,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingTop: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 14,
    textAlign: 'center',
  }
}); 