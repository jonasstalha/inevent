import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { app } from './firebaseConfig';

const db = getFirestore(app);

export const createUserProfile = async (uid: string, data: any) => {
  try {
    await setDoc(doc(db, 'users', uid), {
      ...data,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserRole = async (uid: string): Promise<string | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data()?.role || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting user role:', error);
    throw error;
  }
};

export const getUserProfile = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};
