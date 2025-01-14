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

// Función para obtener los conteos de los usuarios por pago y plan
const obtenerConteoUsuarios = async () => {
    try {
      // Obtener todos los usuarios de la colección personas
      const personasSnapshot = await getDocs(collection(db, 'personas'));
      
      let conteo = {
        transferencia: 0,
        efectivo: 0,
        plan1: 0,
        plan2: 0
      };
  
      // Iterar sobre cada documento (usuario) en la colección personas
      personasSnapshot.forEach((doc) => {
        const usuarioData = doc.data();
        
        // Contar por método de pago
        if (usuarioData.metodoPago === 'Transferencia') {
          conteo.transferencia += 1;
        } else if (usuarioData.metodoPago === 'Efectivo') {
          conteo.efectivo += 1;
        }
  
        // Contar por plan
        if (usuarioData.plan === 'plan1') {
          conteo.plan1 += 1;
        } else if (usuarioData.plan === 'plan2') {
          conteo.plan2 += 1;
        }
      });
  
      return conteo;
    } catch (error) {
      console.error('Error al obtener los conteos de usuarios:', error);
      throw error;
    }
  };
  
  export { obtenerConteoUsuarios };


 // Función para registrar el pago en Firebase
export const registerPago = async (mes, metodoPago, plan) => {
    try {
      const pagosRef = db.collection("pagos"); // Asegúrate de tener la colección "pagos" en Firebase
      const newPago = {
        mes,
        metodoPago,
        plan,
        fecha: new Date(),
      };
      await pagosRef.add(newPago); // Agregar el pago a la colección
      console.log("Pago registrado exitosamente en Firebase");
    } catch (error) {
      console.error("Error al registrar el pago en Firebase:", error);
      throw error;
    }
  };



const collectionName2 = "ventas";

// Create con ID personalizado
export const createVentas = async (id, obj) => {
    const docRef = doc(db, collectionName2, id);
    await setDoc(docRef, obj); // setDoc en lugar de addDoc para un ID personalizado
}

// Update
export const updateVentas = async (id, obj) => {
    const docRef = doc(db, collectionName2, id);
    await updateDoc(docRef, obj);
}

// Read todas las personas
export const getVentas = async () => {
    const colRef = collection(db, collectionName2);
    const result = await getDocs(query(colRef));
    return getArrayFromCollection(result);
}

// Read por ID
export const getVentaById = async (id) => {
    const docRef = doc(db, collectionName2, id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
}

// Delete
export const deleteVenta = async (id) => {
    const docRef = doc(db, collectionName2, id);
    await deleteDoc(docRef);
}

const collectionName3 = "credenciales";


// Read todas las personas
export const getCredenciales = async () => {
    const colRef = collection(db, collectionName3);
    const result = await getDocs(query(colRef));
    return getArrayFromCollection(result);
}
