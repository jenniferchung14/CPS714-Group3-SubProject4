import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database"

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

function writeBookData(bookId, imageUrl, bookTitle, author, genre, dueDate, fines) {
  const db = getDatabase();
  const reference = ref(db, 'bookId/' + bookId);

  set(reference, {
    bookCover: imageUrl,
    bookTitle: bookTitle,
    author: author,
    genre: genre,
    dueDate: dueDate,
    fines: fines
  })
}

writeBookData("12345", "https://m.media-amazon.com/images/I/71Cpfb-DMIL._UF1000,1000_QL80_.jpg", "Mockingjay", "Suzanne Collins", "Young Adult", "December 1, 2025", 0);