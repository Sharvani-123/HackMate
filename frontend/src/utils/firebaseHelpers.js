import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from '../firebase';

const db = getFirestore(app);

export const checkIfUserProfileExists = async (uid) => {
  const userRef = doc(db, "users", uid); 
  const userSnap = await getDoc(userRef);
  return userSnap.exists(); // returns true/false
};
