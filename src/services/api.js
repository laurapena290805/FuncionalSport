import {auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail, fetchSignInMethodsForEmail, sendEmailVerification,db, doc, getDoc, getDocs, collection, setDoc, updateDoc, deleteDoc, addDoc, query, where, onSnapshot} from "./firebase";

const collectionName = "books";

//create
export const createBook = async (obj) => {
    const colRef = collection(db, 'books');
    const data = await addDoc(colRef, obj);
    return data.id;
}

//update
export const updateBook = async (id, obj) => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, obj);
}


//read
export const getBooks = async () => {
    const colRef = collection(db, collectionName);
    const result = await getDocs(query(colRef));
    return getArrayFromCollection(result);
}


//Read with where
export const getBooksByTitle = async (title) => {
    const colRef = collection(db, collectionName);
    const result = await getDocs(query(colRef, where("title", "==", title)));
    return getArrayFromCollection(result);
}


export const getItemById = async (id) => {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
}

//delete
export const deleteBook = async (id) => {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
}

const getArrayFromCollection = (collection) => {
    return collection.docs.map(doc => ({id: doc.id, ...doc.data()}));
}