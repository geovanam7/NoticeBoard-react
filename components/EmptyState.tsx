import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

type EmptyStateProps = {
  title: string;
  message: string;
  icon?: React.ComponentProps<typeof FontAwesome>['name'];
  buttonText?: string;
  onButtonPress?: () => void;
};

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon = 'info-circle',
  buttonText,
  onButtonPress,
}) => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? '#fff' : '#333';
  const subTextColor = colorScheme === 'dark' ? '#bdc3c7' : '#7f8c8d';
  const buttonColor = '#3498db';

  return (
    <View style={styles.container}>
      <FontAwesome name={icon} size={50} color={subTextColor} style={styles.icon} />
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      <Text style={[styles.message, { color: subTextColor }]}>{message}</Text>
      
      {buttonText && onButtonPress && (
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: buttonColor }]}
          onPress={onButtonPress}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EmptyState; 