import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Auth, getAuth } from 'firebase/auth';
import { FirestoreService } from './firestoreService';
import { getAnalytics, Analytics } from "firebase/analytics";
import { FirebaseAuthService } from './firebaseAuthService';
import { FirestoreServiceInstance } from './firestoreServiceInstance';

export class FirebaseInit {
  private static instance: FirebaseInit;
  private app: FirebaseApp;
  private db: Firestore;
  private auth: Auth;
  private firestoreService: FirestoreService;
  private analytics: Analytics;
  private authService: FirebaseAuthService;

  private constructor(firebaseConfig: object) {
    // Inicializar Firebase
    this.app = initializeApp(firebaseConfig);
    
    // Inicializar servicios
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
    this.analytics = getAnalytics(this.app);
    
    // Inicializar nuestro servicio personalizado
    this.firestoreService = new FirestoreService(this.db);
    this.authService = new FirebaseAuthService(this.auth);
    
  }

  /**
   * Obtiene la instancia única de FirebaseInit (Singleton)
   */
  public static getInstance(firebaseConfig?: object): FirebaseInit {
    if (!FirebaseInit.instance) {
      if (!firebaseConfig) {
        throw new Error('Firebase config is required for initialization');
      }
      FirebaseInit.instance = new FirebaseInit(firebaseConfig);
    }
    return FirebaseInit.instance;
  }

  /**
   * Obtiene el servicio de Firebase personalizado
   */
  public getFirestoreService(): FirestoreService {
    return this.firestoreService;
  }

  public getFirestoreServiceInstance<T>(collectionName: string) {
    const instance = new FirestoreServiceInstance<T>(this.db, collectionName);
    return instance;
  }

  /**
   * Obtiene la instancia de Firestore
   */
  public getFirestore(): Firestore {
    return this.db;
  }

  /**
   * Obtiene la instancia de Auth
   */
  public getAuth(): Auth {
    return this.auth;
  }

  /**
   * Obtiene la instancia de FirebaseApp
   */
  public getApp(): FirebaseApp {
    return this.app;
  }

  public getAnalytics(): Analytics {
    return this.analytics;
  }

  public getAuthService(): FirebaseAuthService {
    return this.authService;
  }
}

// Tipo para la configuración de Firebase
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Exportar una función helper para inicializar la librería
export const initializeFirebaseLib = (config: FirebaseConfig) => {
  return FirebaseInit.getInstance(config);
};
