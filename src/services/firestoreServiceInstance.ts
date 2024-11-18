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
  
  export class FirestoreServiceInstance<T> {
    private db: Firestore;
    private collectionName: string;
  
    constructor(firestoreInstance: Firestore, collectionName: string) {
      this.db = firestoreInstance;
      this.collectionName = collectionName
    }
  
    /**
     * Create a new document in a collection
     * @param data The data to be stored
     * @param customId Optional custom document ID
     */
    async create(data: Omit<T, "id">, customId?: string): Promise<T> {
      try {
        const collectionRef = collection(this.db, this.collectionName);
        const docRef = customId ? doc(collectionRef, customId) : doc(collectionRef);
        
        await setDoc(docRef, data as WithFieldValue<DocumentData>);
        return {
          id: docRef.id,
          ...data as T
        };
      } catch (error) {
        throw new Error(`Error creating document: ${error}`);
      }
    }
  
    /**
     * Read a document by ID
     * @param documentId The document ID
     */
    async read(documentId: string): Promise<T | null> {
      try {
        const docRef = doc(this.db, this.collectionName, documentId);
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
     * @param documentId The document ID
     * @param data The data to update
     */
    async update(documentId: string, data: T): Promise<T> {
      try {
        const docRef = doc(this.db, this.collectionName, documentId);
        await updateDoc(docRef, data as WithFieldValue<DocumentData>);
        const docSnap = await getDoc(docRef);
        return {
          id: docRef.id,
          ...docSnap.data() as T
        }; 
      } catch (error) {
        throw new Error(`Error updating document: ${error}`);
      }
    }
  
    /**
     * Delete a document
     * @param documentId The document ID
     */
    async delete(documentId: string): Promise<void> {
      try {
        const docRef = doc(this.db, this.collectionName, documentId);
        await deleteDoc(docRef);
      } catch (error) {
        throw new Error(`Error deleting document: ${error}`);
      }
    }
  
    /**
     * Get all documents from a collection
     */
    async getAll(): Promise<T[]> {
      try {
        const querySnapshot = await getDocs(collection(this.db, this.collectionName));
        const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as T })) as T[];
        return documents
      } catch (error) {
        throw new Error(`Error getting all documents: ${error}`);
      }
    }
  
    /**
     * Query documents with conditions
     * @param conditions Array of query constraints
     */
    async query(conditions: QueryConstraint[]): Promise<{ id: string; }[]> {
      try {
        const q = query(collection(this.db, this.collectionName), ...conditions);
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as { id: string; }[];
      } catch (error) {
        throw new Error(`Error querying documents: ${error}`);
      }
    }
  }
  