# Firebase Services Library Documentation

## Table of Contents
1. [Overview](#overview)
2. [Installation](#installation)
3. [Services](#services)
   - [FirebaseInit](#firebaseinit)
   - [FirebaseService (Firestore)](#firebaseservice-firestore)
   - [FirebaseAuthService](#firebaseauthservice)
4. [Usage Examples](#usage-examples)
5. [Error Handling](#error-handling)
6. [Best Practices](#best-practices)

## Overview

This library provides a comprehensive wrapper for Firebase services, offering simplified interfaces for Firestore operations and Authentication services.

## Installation

```typescript
import { initializeFirebaseLib } from './services';
```

## Services

### FirebaseInit

#### Configuration

```typescript
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

const firebase = initializeFirebaseLib(firebaseConfig);
```

#### Available Methods

- `getFirebaseService()`: Returns Firestore service instance
- `getAuthService()`: Returns Authentication service instance
- `getFirestore()`: Returns raw Firestore instance
- `getAuth()`: Returns raw Auth instance
- `getApp()`: Returns Firebase App instance

### FirebaseService (Firestore)

Class for handling Firestore database operations.

#### CRUD Operations

##### Create Document
```typescript
async create<T>(collectionName: string, data: T, customId?: string): Promise<string>
```

Example:
```typescript
const userId = await firebaseService.create('users', {
  name: 'John Doe',
  email: 'john@example.com'
});
```

##### Read Document
```typescript
async read<T>(collectionName: string, documentId: string): Promise<T | null>
```

Example:
```typescript
const user = await firebaseService.read('users', userId);
```

##### Update Document
```typescript
async update<T>(collectionName: string, documentId: string, data: Partial<T>): Promise<void>
```

Example:
```typescript
await firebaseService.update('users', userId, {
  name: 'Jane Doe'
});
```

##### Delete Document
```typescript
async delete(collectionName: string, documentId: string): Promise<void>
```

Example:
```typescript
await firebaseService.delete('users', userId);
```

##### Get All Documents
```typescript
async getAll<T>(collectionName: string): Promise<T[]>
```

Example:
```typescript
const allUsers = await firebaseService.getAll('users');
```

##### Query Documents
```typescript
async query<T>(collectionName: string, conditions: QueryConstraint[]): Promise<T[]>
```

Example:
```typescript
const adultUsers = await firebaseService.query('users', [
  where('age', '>=', 18)
]);
```

### FirebaseAuthService

Class for handling Firebase Authentication operations.

#### Authentication Methods

##### Register with Email
```typescript
async registerWithEmail(email: string, password: string): Promise<UserCredential>
```

Example:
```typescript
await authService.registerWithEmail('user@example.com', 'password123');
```

##### Login with Email
```typescript
async loginWithEmail(email: string, password: string): Promise<UserCredential>
```

Example:
```typescript
await authService.loginWithEmail('user@example.com', 'password123');
```

##### Social Authentication
```typescript
async loginWithProvider(providerType: AuthProviderType): Promise<UserCredential>
```

Supported providers: 'google' | 'facebook' | 'github' | 'twitter'

Example:
```typescript
await authService.loginWithProvider('google');
```

##### Logout
```typescript
async logout(): Promise<void>
```

Example:
```typescript
await authService.logout();
```

##### Password Reset
```typescript
async resetPassword(email: string): Promise<void>
```

Example:
```typescript
await authService.resetPassword('user@example.com');
```

##### Email Verification
```typescript
async sendVerificationEmail(): Promise<void>
```

Example:
```typescript
await authService.sendVerificationEmail();
```

##### Update User Profile
```typescript
async updateUserProfile(displayName?: string, photoURL?: string): Promise<void>
```

Example:
```typescript
await authService.updateUserProfile('John Doe', 'https://example.com/photo.jpg');
```

##### Update User Email
```typescript
async updateUserEmail(newEmail: string): Promise<void>
```

Example:
```typescript
await authService.updateUserEmail('newemail@example.com');
```

##### Update User Password
```typescript
async updateUserPassword(newPassword: string): Promise<void>
```

Example:
```typescript
await authService.updateUserPassword('newPassword123');
```

##### Get Current User
```typescript
getCurrentUser(): User | null
```

Example:
```typescript
const currentUser = authService.getCurrentUser();
```

##### Auth State Observer
```typescript
onAuthStateChange(callback: (user: User | null) => void): () => void
```

Example:
```typescript
const unsubscribe = authService.onAuthStateChange((user) => {
  if (user) {
    console.log('User is signed in');
  } else {
    console.log('User is signed out');
  }
});
```

## Usage Examples

### Complete Authentication Flow

```typescript
// Initialize the library
const firebase = initializeFirebaseLib(firebaseConfig);
const authService = firebase.getAuthService();

// Register new user
try {
  const userCredential = await authService.registerWithEmail('user@example.com', 'password123');
  await authService.sendVerificationEmail();
  
  // Update profile
  await authService.updateUserProfile('John Doe');
  
  // Store user data in Firestore
  const firestoreService = firebase.getFirebaseService();
  await firestoreService.create('users', {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
    name: 'John Doe'
  });
} catch (error) {
  console.error('Registration failed:', error);
}
```

### Firestore CRUD Operations

```typescript
const firebase = initializeFirebaseLib(firebaseConfig);
const firestoreService = firebase.getFirebaseService();

interface User {
  name: string;
  email: string;
  age: number;
}

// Create
const userId = await firestoreService.create<User>('users', {
  name: 'John',
  email: 'john@example.com',
  age: 30
});

// Read
const user = await firestoreService.read<User>('users', userId);

// Update
await firestoreService.update<User>('users', userId, { age: 31 });

// Delete
await firestoreService.delete('users', userId);

// Query
const adultUsers = await firestoreService.query<User>('users', [
  where('age', '>=', 18)
]);
```

## Error Handling

The library implements comprehensive error handling for all operations. Errors are wrapped with meaningful messages.

```typescript
try {
  await authService.loginWithEmail('user@example.com', 'password');
} catch (error) {
  switch (error.message) {
    case 'auth/user-not-found':
      console.error('User not found');
      break;
    case 'auth/wrong-password':
      console.error('Invalid password');
      break;
    default:
      console.error('Authentication error:', error);
  }
}
```

## Best Practices

1. Always initialize the library at the application entry point
2. Implement proper error handling for all operations
3. Use TypeScript interfaces for data structures
4. Unsubscribe from auth state observers when no longer needed
5. Implement proper security rules in Firebase Console
6. Use environment variables for Firebase configuration
7. Implement proper loading states for async operations

## Security Considerations

1. Never expose Firebase configuration in client-side code in production
2. Use appropriate security rules in Firebase Console
3. Implement proper authentication and authorization checks