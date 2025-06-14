import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from '../firebase'; // or wherever your firebase config is

const db = getFirestore(app);

export const checkIfUserProfileExists = async (uid) => {
  const userRef = doc(db, "users", uid); // "users" is your collection name
  const userSnap = await getDoc(userRef);
  return userSnap.exists(); // returns true/false
};
