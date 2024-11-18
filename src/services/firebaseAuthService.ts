import {
    Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    GoogleAuthProvider,
    FacebookAuthProvider,
    GithubAuthProvider,
    TwitterAuthProvider,
    UserCredential,
    onAuthStateChanged,
    User,
    sendEmailVerification,
    AuthProvider,
    updateEmail,
    updatePassword,
  } from 'firebase/auth';
  
  export type AuthProviderType = 'google' | 'facebook' | 'github' | 'twitter';
  
  export interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
  }
  
  export class FirebaseAuthService {
    private auth: Auth;
    private providers: Map<AuthProviderType, AuthProvider>;
  
    constructor(auth: Auth) {
      this.auth = auth;
      
      // Inicializar providers
      this.providers = new Map([
        ['google', new GoogleAuthProvider()],
        ['facebook', new FacebookAuthProvider()],
        ['github', new GithubAuthProvider()],
        ['twitter', new TwitterAuthProvider()]
      ]);
    }
  
    /**
     * Registrar un nuevo usuario con email y contraseña
     */
    async registerWithEmail(email: string, password: string): Promise<UserCredential> {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          this.auth,
          email,
          password
        );
        return userCredential;
      } catch (error) {
        throw this.handleAuthError(error);
      }
    }
  
    /**
     * Iniciar sesión con email y contraseña
     */
    async loginWithEmail(email: string, password: string): Promise<UserCredential> {
      try {
        return await signInWithEmailAndPassword(this.auth, email, password);
      } catch (error) {
        throw this.handleAuthError(error);
      }
    }
  
    /**
     * Iniciar sesión con un proveedor social
     */
    async loginWithProvider(providerType: AuthProviderType): Promise<UserCredential> {
      try {
        const provider = this.providers.get(providerType);
        if (!provider) {
          throw new Error(`Provider ${providerType} not supported`);
        }
        return await signInWithPopup(this.auth, provider);
      } catch (error) {
        throw this.handleAuthError(error);
      }
    }
  
    /**
     * Cerrar sesión
     */
    async logout(): Promise<void> {
      try {
        await signOut(this.auth);
      } catch (error) {
        throw this.handleAuthError(error);
      }
    }
  
    /**
     * Enviar email de verificación
     */
    async sendVerificationEmail(): Promise<void> {
      try {
        const user = this.auth.currentUser;
        if (!user) throw new Error('No user is currently signed in');
        await sendEmailVerification(user);
      } catch (error) {
        throw this.handleAuthError(error);
      }
    }
  
    /**
     * Enviar email para resetear contraseña
     */
    async resetPassword(email: string): Promise<void> {
      try {
        await sendPasswordResetEmail(this.auth, email);
      } catch (error) {
        throw this.handleAuthError(error);
      }
    }
  
    /**
     * Actualizar perfil del usuario
     */
    async updateUserProfile(displayName?: string, photoURL?: string): Promise<void> {
      try {
        const user = this.auth.currentUser;
        if (!user) throw new Error('No user is currently signed in');
        await updateProfile(user, { displayName, photoURL });
      } catch (error) {
        throw this.handleAuthError(error);
      }
    }
  
    /**
     * Actualizar email del usuario
     */
    async updateUserEmail(newEmail: string): Promise<void> {
      try {
        const user = this.auth.currentUser;
        if (!user) throw new Error('No user is currently signed in');
        await updateEmail(user, newEmail);
      } catch (error) {
        throw this.handleAuthError(error);
      }
    }
  
    /**
     * Actualizar contraseña del usuario
     */
    async updateUserPassword(newPassword: string): Promise<void> {
      try {
        const user = this.auth.currentUser;
        if (!user) throw new Error('No user is currently signed in');
        await updatePassword(user, newPassword);
      } catch (error) {
        throw this.handleAuthError(error);
      }
    }
  
    /**
     * Obtener usuario actual
     */
    getCurrentUser(): User | null {
      return this.auth.currentUser;
    }
  
    /**
     * Suscribirse a cambios en el estado de autenticación
     */
    onAuthStateChange(callback: (user: User | null) => void): () => void {
      return onAuthStateChanged(this.auth, callback);
    }
  
    /**
     * Convertir usuario de Firebase a interfaz AuthUser
     */
    /* private mapFirebaseUser(user: User): AuthUser {
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      };
    } */
  
    /**
     * Manejar errores de autenticación
     */
    private handleAuthError(error: any): Error {
      let message = 'An authentication error occurred';
      
      if (error instanceof Error) {
        switch (error.message) {
          case 'auth/email-already-in-use':
            message = 'This email is already registered';
            break;
          case 'auth/invalid-email':
            message = 'Invalid email format';
            break;
          case 'auth/operation-not-allowed':
            message = 'Operation not allowed';
            break;
          case 'auth/weak-password':
            message = 'Password is too weak';
            break;
          case 'auth/user-disabled':
            message = 'This user account has been disabled';
            break;
          case 'auth/user-not-found':
            message = 'User not found';
            break;
          case 'auth/wrong-password':
            message = 'Invalid password';
            break;
          default:
            message = error.message;
        }
      }
  
      return new Error(message);
    }
  }
  