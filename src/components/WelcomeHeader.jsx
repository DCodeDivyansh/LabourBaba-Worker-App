import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';


const WelcomeHeader = ({
  name = 'Worker',
  imageUrl,
}) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>
          Hello, {name}
        </Text>

        <Text style={styles.subtitle}>
          Ready for work today?
        </Text>
      </View>

      {/* <Image
        source={{
          uri: imageUrl || 'https://i.pravatar.cc/150',
        }}
        style={styles.avatar}
      /> */}
    </View>
  );
};

export default WelcomeHeader;

const styles = StyleSheet.create({
  container: {
    width:'90%',
    padding:10,
    marginLeft:'5%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  greeting: {
    fontSize: 34,
    fontWeight: '700',
    color: '#1E1E1E',
    lineHeight: 40,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 18,
    color: '#6D4C41',
    fontWeight: '500',
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});