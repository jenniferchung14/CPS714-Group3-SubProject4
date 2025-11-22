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

// Development helper: a list of mock user IDs used by seedAllMockData.
const MOCK_USER_IDS = ["user1", "user2", "user3", "user4"];
let _activeMockUid = null;

// Returns a deterministic random mock uid for the current page session.
export function getActiveMockUid() {
  if (!_activeMockUid) {
    const idx = Math.floor(Math.random() * MOCK_USER_IDS.length);
    _activeMockUid = MOCK_USER_IDS[idx];
    console.log('Active mock UID selected:', _activeMockUid);
  }
  return _activeMockUid;
}

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

// Seed mock data for testing (and so other sub-teams can see data from Firestore)
export async function seedAllMockData() {
  console.log("Starting mock data seeding...");

  // create mock users
  const users = [
    {
      id: "user1",
      data: {
        profilePic:
          "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
        firstName: "Jane",
        lastName: "Doe",
        dateOfBirth: "2003-03-03",
        email: "jane.doe@example.com",
        phone: "123-456-7890",
        gender: "Female",
        streetAddress: "321 Town Street",
        aptNumber: "",
        postal: "A1B 2C3",
        city: "Aurora",
        province: "ON",
        memberNumber: "1"
      }
    },
    {
      id: "user2",
      data: {
        profilePic:
          "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg",
        firstName: "Alex",
        lastName: "Nguyen",
        dateOfBirth: "2002-07-15",
        email: "alex.nguyen@example.com",
        phone: "647-555-2222",
        gender: "Male",
        streetAddress: "789 College Street",
        aptNumber: "502",
        postal: "M5B 1X2",
        city: "Toronto",
        province: "ON",
        memberNumber: "2"
      }
    },
    {
      id: "user3",
      data: {
        profilePic:
          "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
        firstName: "Sarah",
        lastName: "Kim",
        dateOfBirth: "2001-01-12",
        email: "sarah.kim@example.com",
        phone: "416-888-8777",
        gender: "Female",
        streetAddress: "55 King Street",
        aptNumber: "1603",
        postal: "M4C 2A1",
        city: "Markham",
        province: "ON",
        memberNumber: "3"
      }
    },
    {
      id: "user4",
      data: {
        profilePic:
          "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
        firstName: "Michael",
        lastName: "Reid",
        dateOfBirth: "1999-11-11",
        email: "michael.reid@example.com",
        phone: "905-333-5444",
        gender: "Male",
        streetAddress: "900 West Avenue",
        aptNumber: "",
        postal: "L4P 5V2",
        city: "Newmarket",
        province: "ON",
        memberNumber: "4"
      }
    }
  ];

  // create mock loans
  const loans = [
    // user1 - mixed statuses
    {
      id: "L1001",
      data: {
        userId: "user1",
        itemId: "BK-1001",
        title: "Mockingjay",
        author: "Suzanne Collins",
        genre: "Young Adult",
        bookCover:
          "https://m.media-amazon.com/images/I/71Cpfb-DMIL._UF1000,1000_QL80_.jpg",
        dueDate: "2025-12-01",
        status: "BORROWED",
        hasHold: false,
        fines: 0
      }
    },
    {
      id: "L1002",
      data: {
        userId: "user1",
        itemId: "BK-2002",
        title: "The Maze Runner",
        author: "James Dashner",
        genre: "Sci-Fi",
        bookCover: "https://m.media-amazon.com/images/I/71fwo9096LL.jpg",
        dueDate: "2025-10-01",
        status: "OVERDUE",
        hasHold: false,
        fines: 7.5
      }
    },
    {
      id: "L1003",
      data: {
        userId: "user1",
        itemId: "BK-3003",
        title: "Divergent",
        author: "Veronica Roth",
        genre: "Fantasy",
        bookCover: "https://m.media-amazon.com/images/I/81H1MhBbPbL.jpg",
        dueDate: "-",
        status: "RETURNED",
        hasHold: false,
        fines: 0
      }
    },
    {
      id: "L1004",
      data: {
        userId: "user1",
        itemId: "BK-3004",
        title: "Twilight",
        author: "Stephenie Meyer",
        genre: "Romance",
        bookCover: "https://m.media-amazon.com/images/I/61sW9OBNRxL.jpg",
        dueDate: "2025-11-02",
        status: "BORROWED",
        hasHold: true,
        fines: 0
      }
    },

    // user2 - all borrowed
    {
      id: "L2001",
      data: {
        userId: "user2",
        itemId: "BK-4001",
        title: "Clean Code",
        author: "Robert C. Martin",
        genre: "Computer Science",
        bookCover: "https://m.media-amazon.com/images/I/41xShlnTZTL.jpg",
        dueDate: "2025-12-15",
        status: "BORROWED",
        hasHold: false,
        fines: 0
      }
    },
    {
      id: "L2002",
      data: {
        userId: "user2",
        itemId: "BK-4002",
        title: "The Pragmatic Programmer",
        author: "Andrew Hunt",
        genre: "Computer Science",
        bookCover: "https://m.media-amazon.com/images/I/518FqJvR9aL.jpg",
        dueDate: "2025-11-22",
        status: "BORROWED",
        hasHold: false,
        fines: 0
      }
    },

    // user3 - all overdue w/ fines
    {
      id: "L3001",
      data: {
        userId: "user3",
        itemId: "BK-5001",
        title: "The Silent Patient",
        author: "Alex Michaelides",
        genre: "Mystery",
        bookCover: "https://m.media-amazon.com/images/I/81JJPDNlxSL._AC_UF1000,1000_QL80_.jpg",
        dueDate: "2025-06-01",
        status: "OVERDUE",
        hasHold: false,
        fines: 12.0
      }
    },
    {
      id: "L3002",
      data: {
        userId: "user3",
        itemId: "BK-5002",
        title: "Gone Girl",
        author: "Gillian Flynn",
        genre: "Thriller",
        bookCover: "https://m.media-amazon.com/images/I/81af+MCATTL._SL1500_.jpg",
        dueDate: "2025-05-20",
        status: "OVERDUE",
        hasHold: false,
        fines: 19.25
      }
    }

    // user4 — no loans 
    // (intentionally empty)
  ];

  // ================================
  // WRITE USERS TO FIRESTORE
  // ================================
  for (const user of users) {
    await setDoc(doc(db, "users", user.id), user.data);
  }

  // ================================
  // WRITE LOANS TO FIRESTORE
  // ================================
  for (const loan of loans) {
    await setDoc(doc(db, "loans", loan.id), loan.data);
  }

  console.log("Mock profiles + mock loan data created successfully!");
}

seedAllMockData();