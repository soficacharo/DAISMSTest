import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, Button, View } from 'react-native';
import { useEffect, useState } from 'react';
import * as SMS from 'expo-sms';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const [disponibilidad, setDisponibilidad] = useState(false);
  const [numeroCelular, setNumeroCelular] = useState(undefined);
  const [destinatarios, setDestinatarios] = useState([]);
  const [mensaje, setMensaje] = useState(undefined);

  useEffect(() => {
    async function chequearDisponibilidad() {
      const estaDisponible = await SMS.isAvailableAsync();
      setDisponibilidad(estaDisponible);
    }
    chequearDisponibilidad();
  }, []);

  const mandarSMS = async () => {
    const { uri } = await Print.printToFileAsync({
      html: "<h1>Hola Mundo</h1>"
    });

    console.log(uri);

    const contentUri = await FileSystem.getContentUriAsync(uri);
    console.log(contentUri);

    const {result} = await SMS.mandarSMSAsync(
      destinatarios,
      mensaje,
      {
        attachments: {
          uri: contentUri,
          mimeType: "app/pdf",
          filename: "Hola.pdf"
        }
      }
    );

    console.log(result);
  };

  const addNumber = () => {
    let newDestinatarios = [...destinatarios];
    newDestinatarios.push(numeroCelular);
    setDestinatarios(newDestinatarios);
    setNumeroCelular(undefined);
  };

  const mostrarDestinatarios = () => {
    if (destinatarios.length === 0) {
      return <Text>No hay destinatarios</Text>
    }

    return destinatarios.map((destinatario, i) => {
      return <Text key={i}>{destinatario}</Text>;
    });
  };

  return (
    <View style={styles.container}>
      <TextInput value={numeroCelular} placeholder="Numero Celular" onChangeText={(value) => setNumeroCelular(value)} />
      <Button title='Agregar Numero' onPress={addNumber} />
      <TextInput value={mensaje} placeholder="Mensaje" onChangeText={(value) => setMensaje(value)} />
      <Text>Destinatarios:</Text>
      {mostrarDestinatarios()}
      <Button title='Borrar Destinatarios' onPress={() => setDestinatarios([])} />
      {disponibilidad ? <Button title="Mandar SMS" onPress={mandarSMS} /> : <Text>SMS no disponible</Text>}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});