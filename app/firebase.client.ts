import { initializeApp } from "firebase/app";
import { getAuth, inMemoryPersistence, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // @ts-expect-error unable to type this
  apiKey: window.ENV.FIREBASE_API_KEY,
  authDomain: "darf-game.firebaseapp.com",
  projectId: "darf-game",
  storageBucket: "darf-game.appspot.com",
  messagingSenderId: "641891580551",
  appId: "1:641891580551:web:eaf91ff0b4489909439622",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// Let Remix handle the persistence via session cookies.
setPersistence(auth, inMemoryPersistence);

const db = getFirestore(app);

export { auth, db };
