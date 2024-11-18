import { initializeFirebaseLib } from './services/firebaseInit';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-auth-domain",
  projectId: "tu-project-id",
  storageBucket: "tu-storage-bucket",
  messagingSenderId: "tu-messaging-sender-id",
  appId: "tu-app-id"
};

// Inicializar la librería
const firebaseLib = initializeFirebaseLib(firebaseConfig);

// Obtener el servicio para usar las funciones CRUD
const firebaseService = firebaseLib.getFirestoreService();

type user = {
    id: string, 
    name: string, 
    email: string
}

// Ejemplo de uso
async function example() {
  try {
    // Crear un nuevo documento
    const newDocId = await firebaseService.create<Omit<user, "id">, user>('users', {
      name: 'John Doe',
      email: 'john@example.com'
    });

    console.log('Documento creado con ID:', newDocId);

    // Leer el documento
    const userData = await firebaseService.read('users', newDocId.id);
    console.log('Datos del usuario:', userData);

  } catch (error) {
    console.error('Error:', error);
  }
}
