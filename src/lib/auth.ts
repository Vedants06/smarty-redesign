import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const signupWithEmail = async (email: string, password: string, name?: string) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);

  if (name) {
    await updateProfile(userCred.user, { displayName: name });
  }

  const userDoc = doc(db, "users", userCred.user.uid);
  await setDoc(userDoc, {
    uid: userCred.user.uid,
    email: userCred.user.email,
    name: name || userCred.user.displayName || "",
    createdAt: new Date().toISOString(),
  });

  return userCred.user;
};

export const loginWithEmail = async (email: string, password: string) => {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user;
};
