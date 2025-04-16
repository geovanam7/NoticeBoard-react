import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#3498db',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#999' : '#777',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#121212' : '#fff',
          borderTopColor: colorScheme === 'dark' ? '#333' : '#ddd',
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#121212' : '#3498db',
        },
        headerTintColor: colorScheme === 'dark' ? '#fff' : '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Avisos da Comunidade',
          tabBarLabel: 'Avisos',
          tabBarIcon: ({ color }) => <TabBarIcon name="bullhorn" color={color} />,
        }}
      />
      <Tabs.Screen
        name="postar"
        options={{
          title: 'Novo Aviso',
          tabBarLabel: 'Publicar',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus-circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Seu Perfil',
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
} 