import { initializeApp } from "firebase/app";
import { 
  getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where, updateDoc
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA5Q_MVI7W1F58N9cKyDuSmFVsW3QlSTt8",
  authDomain: "cps714-group-3-subproject-4.firebaseapp.com",
  databaseURL: "https://cps714-group-3-subproject-4-default-rtdb.firebaseio.com",
  projectId: "cps714-group-3-subproject-4",
  storageBucket: "cps714-group-3-subproject-4.firebasestorage.app",
  messagingSenderId: "989632490584",
  appId: "1:989632490584:web:4f79336c85fd314d272e2d"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export async function getUserProfile(uid) {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
}

export async function updateUserProfile(uid, updatedData) {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, updatedData);
  console.log("Profile updated in Firestore:", updatedData);
}

export async function getUserLoans(uid) {
  const q = query(collection(db, "loans"), where("userId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getUserFines(uid) {
  const q = query(collection(db, "fines"), where("userId", "==", uid));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}


// Create mock profile
export async function seedMockProfile() {
  await setDoc(doc(db, "users", "u_jane"), {
    profilePic: "https://portraitpal.ai/wp-content/uploads/2024/10/preparing-for-headshot.jpg.webp",
    firstName: "Jessica",
    lastName: "Doe",
    dateOfBirth: "2003-03-03",
    email: "JessicaDoe@example.com",
    phone: "123-456-7890",
    gender: "Female",
    streetAddress: "321 Town Street",
    aptNumber: "",
    postal: "A1B 2C3",
    city: "Aurora",
    province: "ON"
  });
}

// Create mock checked-out books 
export async function seedMockLoans() {
  const loans = [
    {
      id: "L1001",
      data: {
        userId: "u_jane",
        itemId: "BK-1001",
        title: "Mockingjay",
        author: "Suzanne Collins",
        genre: "Young Adult",
        bookCover:
          "https://m.media-amazon.com/images/I/71Cpfb-DMIL._UF1000,1000_QL80_.jpg",
        dueDate: "2025-12-01",
        renewable: true,
        hasHold: false,
        fines: 0
      }
    },
    {
      id: "L1002",
      data: {
        userId: "u_jane",
        itemId: "BK-2002",
        title: "The Maze Runner",
        author: "James Dashner",
        genre: "Young Adult",
        bookCover: "https://m.media-amazon.com/images/I/71fwo9096LL.jpg",
        dueDate: "2025-12-14",
        renewable: false,
        hasHold: true,
        fines: 0
      }
    },
    {
      id: "L1003",
      data: {
        userId: "u_jane",
        itemId: "BK-3003",
        title: "Divergent",
        author: "Veronica Roth",
        genre: "Young Adult",
        bookCover: "https://m.media-amazon.com/images/I/81H1MhBbPbL.jpg",
        dueDate: "2026-01-10",
        renewable: true,
        hasHold: false,
        fines: 0
      }
    }
  ];

  for (const loan of loans) {
    await setDoc(doc(db, "loans", loan.id), loan.data);
  }
}

// Create mock fines
export async function seedMockFines() {
  await setDoc(doc(db, "fines", "F1001"), {
    userId: "u_jane",
    amount: 6.50,
    reason: "Overdue: BK-0909",
    status: "unpaid",
    createdAt: "2025-02-01"
  });
}

// Run seeding functions for testing
seedMockProfile();
seedMockLoans();
seedMockFines();