import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView, Switch, Modal, TextInput } from 'react-native';
import { useColorScheme } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useUser } from '../../contexts/UserContext';
import { AvisosService } from '../../services/AvisosService';
import AvisoCard, { AvisoItem } from '../../components/AvisoCard';

export default function PerfilScreen() {
  const [adminCode, setAdminCode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editNameModalVisible, setEditNameModalVisible] = useState(false);
  const [meusAvisos, setMeusAvisos] = useState<AvisoItem[]>([]);
  const [tempUserName, setTempUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const { userName, setUserName, isAdmin, setIsAdmin, saveUserData } = useUser();
  const colorScheme = useColorScheme();

  // Carregar avisos ao iniciar
  useEffect(() => {
    carregarAvisos();
  }, []);

  const carregarAvisos = async () => {
    setLoading(true);
    try {
      const avisos = await AvisosService.obterAvisos();
      setMeusAvisos(avisos);
    } catch (error) {
      console.error('Erro ao carregar avisos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Usuário pode ativar modo admin usando código (123456 para fins de demonstração)
  const verificarCodigoAdmin = () => {
    if (adminCode === '123456') {
      setIsAdmin(true);
      setModalVisible(false);
      saveUserData();
      Alert.alert('Sucesso', 'Modo administrador ativado!');
    } else {
      Alert.alert('Código Inválido', 'O código de administrador está incorreto.');
    }
  };

  const mostrarDialogAdmin = () => {
    setModalVisible(true);
  };

  const mostrarDialogEditarNome = () => {
    setTempUserName(userName);
    setEditNameModalVisible(true);
  };

  const salvarNome = () => {
    if (tempUserName.trim()) {
      setUserName(tempUserName);
      saveUserData();
      setEditNameModalVisible(false);
    } else {
      Alert.alert('Nome inválido', 'Por favor, digite um nome válido.');
    }
  };

  const removerAviso = async (id: string) => {
    try {
      // Apenas admins podem remover avisos
      if (!isAdmin) {
        Alert.alert('Acesso Negado', 'Apenas administradores podem remover avisos.');
        return;
      }

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
                await AvisosService.removerAviso(id);
                // Atualizar a lista localmente também
                const avisosAtualizados = meusAvisos.filter(aviso => aviso.id !== id);
                setMeusAvisos(avisosAtualizados);
                Alert.alert('Sucesso', 'Aviso removido com sucesso!');
              } catch (error) {
                console.error('Erro ao remover:', error);
                Alert.alert('Erro', 'Houve um erro ao remover o aviso.');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Erro ao remover aviso:', error);
      Alert.alert('Erro', 'Houve um erro ao remover o aviso.');
    }
  };

  // Definir cores baseadas no tema
  const backgroundColor = colorScheme === 'dark' ? '#1a1a1a' : '#f5f5f5';
  const cardBgColor = colorScheme === 'dark' ? '#2c3e50' : '#fff';
  const textColor = colorScheme === 'dark' ? '#fff' : '#000';
  const subTextColor = colorScheme === 'dark' ? '#bdc3c7' : '#7f8c8d';
  const accentColor = '#3498db';

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <View style={styles.profileHeader}>
        <TouchableOpacity
          style={[styles.avatarContainer, { backgroundColor: accentColor }]}
          onPress={mostrarDialogEditarNome}
        >
          <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
        </TouchableOpacity>
        
        <View style={styles.nameContainer}>
          <Text style={[styles.userName, { color: textColor }]}>{userName}</Text>
          <TouchableOpacity onPress={mostrarDialogEditarNome}>
            <FontAwesome name="pencil" size={16} color={accentColor} style={styles.editIcon} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.adminSwitchContainer}>
          <Text style={[styles.adminText, { color: subTextColor }]}>Administrador</Text>
          <Switch
            value={isAdmin}
            onValueChange={(value) => {
              if (value && !isAdmin) {
                mostrarDialogAdmin();
              } else {
                setIsAdmin(false);
                saveUserData();
              }
            }}
            trackColor={{ false: '#767577', true: '#bde0fe' }}
            thumbColor={isAdmin ? accentColor : '#f4f3f4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Avisos Recentes</Text>
          <TouchableOpacity onPress={carregarAvisos}>
            <FontAwesome name="refresh" size={16} color={accentColor} />
          </TouchableOpacity>
        </View>
        
        {meusAvisos.length > 0 ? (
          meusAvisos.map(aviso => (
            <AvisoCard 
              key={aviso.id} 
              aviso={aviso} 
              isAdmin={isAdmin} 
              onDelete={removerAviso} 
              showFullDescription={false}
            />
          ))
        ) : (
          <Text style={[styles.noAvisos, { color: subTextColor }]}>
            {loading ? 'Carregando avisos...' : 'Nenhum aviso disponível'}
          </Text>
        )}
      </View>

      {/* Modal de código de administrador */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalView, { backgroundColor: cardBgColor }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Código de Administrador</Text>
            <Text style={[styles.modalText, { color: subTextColor }]}>
              Digite o código para acessar o modo administrador.
            </Text>
            <TextInput
              style={[styles.input, { backgroundColor: backgroundColor, color: textColor }]}
              value={adminCode}
              onChangeText={setAdminCode}
              keyboardType="numeric"
              secureTextEntry
              placeholder="Digite o código"
              placeholderTextColor={subTextColor}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonConfirm]}
                onPress={verificarCodigoAdmin}
              >
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para editar nome */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={editNameModalVisible}
        onRequestClose={() => setEditNameModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalView, { backgroundColor: cardBgColor }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Editar Seu Nome</Text>
            <TextInput
              style={[styles.input, { backgroundColor: backgroundColor, color: textColor }]}
              value={tempUserName}
              onChangeText={setTempUserName}
              placeholder="Digite seu nome"
              placeholderTextColor={subTextColor}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setEditNameModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonConfirm]}
                onPress={salvarNome}
              >
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    paddingVertical: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  editIcon: {
    marginLeft: 10,
    marginBottom: 10,
  },
  adminSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  adminText: {
    fontSize: 16,
    marginRight: 10,
  },
  section: {
    padding: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noAvisos: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: 10,
    padding: 25,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 8,
    padding: 12,
    width: '48%',
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#7f8c8d',
  },
  buttonConfirm: {
    backgroundColor: '#3498db',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 