import { 
    Firestore, 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc,
    query,
    QueryConstraint,
    WithFieldValue,
    DocumentData
  } from 'firebase/firestore';
  
  export class FirestoreService {
    private db: Firestore;
  
    constructor(firestoreInstance: Firestore) {
      this.db = firestoreInstance;
    }
  
    /**
     * Create a new document in a collection
     * @param collectionName The name of the collection
     * @param data The data to be stored
     * @param customId Optional custom document ID
     */
    async create<T extends WithFieldValue<DocumentData>, U>(collectionName: string, data: T, customId?: string): Promise<U> {
      try {
        const collectionRef = collection(this.db, collectionName);
        const docRef = customId ? doc(collectionRef, customId) : doc(collectionRef);
        
        await setDoc(docRef, data);
        return {
          id: docRef.id,
          ...data
        } as U;
      } catch (error) {
        throw new Error(`Error creating document: ${error}`);
      }
    }
  
    /**
     * Read a document by ID
     * @param collectionName The name of the collection
     * @param documentId The document ID
     */
    async read<T>(collectionName: string, documentId: string): Promise<T | null> {
      try {
        const docRef = doc(this.db, collectionName, documentId);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          return docSnap.data() as T;
        }
        return null;
      } catch (error) {
        throw new Error(`Error reading document: ${error}`);
      }
    }
  
    /**
     * Update a document
     * @param collectionName The name of the collection
     * @param documentId The document ID
     * @param data The data to update
     */
    async update<T extends WithFieldValue<DocumentData>>(collectionName: string, documentId: string, data: T): Promise<T> {
      try {
        // Define docRef con el tipo adecuado
        const docRef = doc(this.db, collectionName, documentId);
        
        // Ejecutar la actualización con el tipo de data como Partial<WithFieldValue<T>>
        await updateDoc(docRef, data);
  
        // Obtener el documento actualizado
        const docSnap = await getDoc(docRef);
        
        // Devolver el documento con el tipo T
        return {
          id: docRef.id,
          ...docSnap.data() as T,
        };
      } catch (error) {
        throw new Error(`Error updating document: ${error}`);
      }
    }
  
    /**
     * Delete a document
     * @param collectionName The name of the collection
     * @param documentId The document ID
     */
    async delete(collectionName: string, documentId: string): Promise<void> {
      try {
        const docRef = doc(this.db, collectionName, documentId);
        await deleteDoc(docRef);
      } catch (error) {
        throw new Error(`Error deleting document: ${error}`);
      }
    }
  
    /**
     * Get all documents from a collection
     * @param collectionName The name of the collection
     */
    async getAll<T>(collectionName: string): Promise<T[]> {
      try {
        const querySnapshot = await getDocs(collection(this.db, collectionName));
        const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as T })) as T[];
        console.log("Documents", documents)
        return documents
      } catch (error) {
        throw new Error(`Error getting all documents: ${error}`);
      }
    }
  
    /**
     * Query documents with conditions
     * @param collectionName The name of the collection
     * @param conditions Array of query constraints
     */
    async query(collectionName: string, conditions: QueryConstraint[]): Promise<{ id: string; }[]> {
      try {
        const q = query(collection(this.db, collectionName), ...conditions);
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as { id: string; }[];
      } catch (error) {
        throw new Error(`Error querying documents: ${error}`);
      }
    }
  }
  