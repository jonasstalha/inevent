// src/firebase/firebaseAuth.ts
// FAKE AUTH: Always succeed for login/register, no backend
export const loginWithEmail = async (email: string, password: string) => {
  return Promise.resolve();
};

export const registerWithEmail = async (email: string, password: string, name: string) => {
  return Promise.resolve({ user: { uid: 'fake-uid', email, displayName: name } });
};

export const logout = async () => {
  return Promise.resolve();
};
