// src/firebase/firebaseAuth.ts
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { firebaseAuth } from './firebaseConfig';

export const loginWithEmail = async (email: string, password: string): Promise<FirebaseAuthTypes.UserCredential> => {
  try {
    return await firebaseAuth.signInWithEmailAndPassword(email, password);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const registerWithEmail = async (
  email: string,
  password: string,
  name: string
): Promise<FirebaseAuthTypes.UserCredential> => {
  try {
    const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
    await userCredential.user.updateProfile({ displayName: name });
    return userCredential;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const logout = async () => {
  try {
    await firebaseAuth.signOut();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getCurrentUser = (): Promise<FirebaseAuthTypes.User | null> => {
  return Promise.resolve(firebaseAuth.currentUser);
};

export { firebaseAuth as auth };
