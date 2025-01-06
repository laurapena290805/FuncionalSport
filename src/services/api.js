import {auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, fetchSignInMethodsForEmail, sendEmailVerification,db, doc, getDoc, getDocs, collection, setDoc, updateDoc, deleteDoc, addDoc, query, where, onSnapshot} from "./firebase";

const collectionName = "personas";

// Create con ID personalizado
export const createPersona = async (id, obj) => {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, obj); // setDoc en lugar de addDoc para un ID personalizado
}

// Update
export const updatePersona = async (id, obj) => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, obj);
}

// Read todas las personas
export const getPersonas = async () => {
    const colRef = collection(db, collectionName);
    const result = await getDocs(query(colRef));
    return getArrayFromCollection(result);
}

// Read por ID
export const getPersonaById = async (id) => {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
}

// Delete
export const deletePersona = async (id) => {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
}

const getArrayFromCollection = (collection) => {
    return collection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};


const collectionClasses = "clases";

// Create una clase con ID personalizado
export const createClase = async (id, obj) => {
    const docRef = doc(db, collectionClasses, id);
    await setDoc(docRef, obj);
}

// Update una clase
export const updateClase = async (id, obj) => {
    const docRef = doc(db, collectionClasses, id);
    await updateDoc(docRef, obj);
}

// Read todas las clases
export const getClases = async () => {
    const colRef = collection(db, collectionClasses);
    const result = await getDocs(query(colRef));
    return getArrayFromCollection(result);
}

// Read clase por ID
export const getClaseById = async (id) => {
    const docRef = doc(db, collectionClasses, id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
}

// Delete una clase
export const deleteClase = async (id) => {
    const docRef = doc(db, collectionClasses, id);
    await deleteDoc(docRef);
}

