# 📢 Avisos Comunidade

<div align="center">
  <img src="https://img.shields.io/badge/React%20Native-0.71.8-61dafb" alt="React Native Version" />
  <img src="https://img.shields.io/badge/Expo-SDK%2049-000020" alt="Expo SDK" />
  <img src="https://img.shields.io/badge/TypeScript-5.0.4-3178c6" alt="TypeScript Version" />
  <img src="https://img.shields.io/badge/AsyncStorage-1.24.0-007acc" alt="AsyncStorage Version" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License" />
</div>

<p align="center">
  Uma aplicação mobile moderna para comunicação comunitária, permitindo que moradores compartilhem informações importantes como alertas, eventos e notícias locais.
</p>

![Captura de tela do aplicativo](./assets/app-screenshot.png)

## ✨ Funcionalidades

- **📋 Feed de Avisos** - Visualize avisos recentes da comunidade em tempo real
- **🔔 Notificações Detalhadas** - Acesse detalhes completos de cada aviso
- **📝 Criação de Avisos** - Interface intuitiva para postar novos avisos
- **👤 Perfil de Usuário** - Gerencie seu perfil e avisos publicados
- **🔑 Modo Admin** - Funcionalidades administrativas para moderação de conteúdo
- **🌓 Tema Claro/Escuro** - Suporte a temas com adaptação automática às preferências do dispositivo
- **📱 Design Responsivo** - Interface otimizada para diferentes tamanhos de tela
- **🔄 Atualização em tempo real** - Simulação de atualizações em tempo real
- **📤 Compartilhamento** - Compartilhe avisos importantes com amigos e vizinhos

## 🛠️ Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile multiplataforma
- **TypeScript** - Linguagem com tipagem estática para maior segurança do código
- **Expo Router** - Sistema de navegação e roteamento baseado em arquivos
- **AsyncStorage** - Armazenamento local persistente para dados da aplicação
- **Expo Vector Icons** - Biblioteca de ícones integrada
- **Componentes Customizados** - UI moderna e responsiva com componentes personalizados
- **Context API** - Gerenciamento de estado global da aplicação

## 📲 Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/avisos-comunidade.git
   cd avisos-comunidade
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Inicie o projeto**
   ```bash
   npx expo start
   ```

4. **Scan do QR Code**
   - Use o aplicativo Expo Go em seu dispositivo físico ou
   - Execute no emulador com as opções exibidas no terminal

## 📁 Estrutura do Projeto

```
AvisosComunidade/
├── app/                    # Estrutura principal (Expo Router)
│   ├── (avisos)/           # Rotas de avisos
│   │   ├── index.tsx       # Tela principal - Lista de avisos
│   │   ├── aviso/[id].tsx  # Detalhes de um aviso específico
│   │   ├── postar.tsx      # Formulário para publicar avisos
│   │   └── perfil.tsx      # Perfil e configurações do usuário
│   ├── firebase.js         # Utilitários de simulação
│   └── _layout.tsx         # Layout e navegação principal
├── assets/                 # Imagens, fontes e recursos
├── components/             # Componentes reutilizáveis
│   ├── AvisoCard.tsx       # Card para exibir um aviso
│   └── EmptyState.tsx      # Componente para estados vazios
├── contexts/               # Contextos React para gerenciamento de estado
│   └── UserContext.tsx     # Contexto de usuário
└── services/               # Camada de serviços 
    └── AvisosService.ts    # Serviço para gerenciar avisos
```

## 👨‍💻 Modo Administrador

Para ativar o modo administrador:

1. Acesse a tela de perfil
2. Ative o switch "Modo Administrador"
3. Quando solicitado, digite o código: `123456`

Com o modo administrador ativado, você poderá moderar conteúdos, remover avisos inadequados e ter controle total sobre as publicações do aplicativo.

## 📱 Capturas de Tela

<div style="display: flex; justify-content: space-between;">
  <img src="./assets/screen1.png" width="30%" alt="Tela de Avisos" />
  <img src="./assets/screen2.png" width="30%" alt="Detalhes do Aviso" />
  <img src="./assets/screen3.png" width="30%" alt="Perfil" />
</div>

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add: Amazing Feature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<p align="center">
  Desenvolvido com 💙 pela equipe AvisosComunidade
</p>
