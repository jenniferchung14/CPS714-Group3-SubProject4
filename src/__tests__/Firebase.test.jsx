// src/__tests__/Firebase.test.jsx
import { describe, test, expect, vi, beforeEach } from "vitest";

// --- Mock firebase SDK modules --- //

// firebase/app
vi.mock("firebase/app", () => ({
  initializeApp: vi.fn(() => ({})),
}));

// firebase/auth
vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({})),
}));

// firebase/firestore
vi.mock("firebase/firestore", () => {
  const getFirestore = vi.fn(() => ({}));
  const collection = vi.fn();
  const doc = vi.fn(() => ({ _fakeRef: true })); // return fake ref object
  const getDoc = vi.fn();
  const getDocs = vi.fn();
  const setDoc = vi.fn();
  const updateDoc = vi.fn();
  const query = vi.fn();
  const where = vi.fn();

  return {
    __esModule: true,
    getFirestore,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    query,
    where,
  };
});

// Now import the functions we want to test
import {
  getUserProfile,
  updateUserProfile,
  getUserLoans,
  getActiveMockUid,
  seedAllMockData,
} from "../services/firebase";

// And import the mocked firestore functions so we can control & assert them
import {
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  doc,
  collection,
  query,
  where,
} from "firebase/firestore";

describe("firebase.js service functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("getUserProfile returns profile data when document exists", async () => {
    const fakeSnap = {
      exists: () => true,
      data: () => ({
        firstName: "Jane",
        email: "jane.doe@example.com",
      }),
    };

    getDoc.mockResolvedValueOnce(fakeSnap);

    const result = await getUserProfile("user1");

    expect(doc).toHaveBeenCalledWith(expect.anything(), "users", "user1");
    expect(result).toEqual({
      firstName: "Jane",
      email: "jane.doe@example.com",
    });
  });

  test("getUserProfile returns null when document does not exist", async () => {
    const fakeSnap = {
      exists: () => false,
      data: () => null,
    };

    getDoc.mockResolvedValueOnce(fakeSnap);

    const result = await getUserProfile("user999");

    expect(result).toBeNull();
  });

  test("updateUserProfile calls updateDoc with correct parameters", async () => {
    // doc() already returns { _fakeRef: true } from our mock factory
    updateDoc.mockResolvedValueOnce(undefined);

    const updatedData = { city: "Waterloo", phone: "111-222-3333" };
    await updateUserProfile("user2", updatedData);

    // check that doc() was called correctly
    expect(doc).toHaveBeenCalledWith(expect.anything(), "users", "user2");

    // check updateDoc called with the ref returned by doc() and the update data
    expect(updateDoc).toHaveBeenCalledWith(
      { _fakeRef: true },
      updatedData
    );
  });

  test("getUserLoans returns mapped loans and normalizes dueDate", async () => {
    // Simulate three types of dueDate
    const tsDueDate = { toDate: () => new Date("2025-12-13T10:00:00Z") };
    const jsDateDueDate = new Date("2025-10-01T10:00:00Z");
    const stringDueDate = "2025-11-02";

    const fakeDocs = [
      {
        id: "L1001",
        data: () => ({
          userId: "user1",
          title: "Mockingjay",
          dueDate: tsDueDate,
          fines: 0,
        }),
      },
      {
        id: "L1002",
        data: () => ({
          userId: "user1",
          title: "The Maze Runner",
          dueDate: jsDateDueDate,
          fines: 7.5,
        }),
      },
      {
        id: "L1003",
        data: () => ({
          userId: "user1",
          title: "Twilight",
          dueDate: stringDueDate,
          fines: 0,
        }),
      },
      {
        id: "L1004",
        data: () => ({
          userId: "user1",
          title: "Divergent",
          // no dueDate to test default "-"
          fines: 0,
        }),
      },
    ];

    getDocs.mockResolvedValueOnce({ docs: fakeDocs });

    const loans = await getUserLoans("user1");

    expect(query).toHaveBeenCalled();
    expect(where).toHaveBeenCalledWith("userId", "==", "user1");
    expect(loans).toHaveLength(4);

    const [loan1, loan2, loan3, loan4] = loans;

    // Timestamp → "YYYY-MM-DD"
    expect(loan1.dueDate).toBe("2025-12-13");
    // Date object → "YYYY-MM-DD"
    expect(loan2.dueDate).toBe("2025-10-01");
    // String unchanged
    expect(loan3.dueDate).toBe("2025-11-02");
    // Missing → "-"
    expect(loan4.dueDate).toBe("-");
  });

  test("getUserLoans returns empty array when no loans found", async () => {
    getDocs.mockResolvedValueOnce({ docs: [] });

    const loans = await getUserLoans("user4");

    expect(Array.isArray(loans)).toBe(true);
    expect(loans).toHaveLength(0);
  });

  test("getActiveMockUid returns a consistent mock user ID and only calls Math.random once", () => {
    const spyRandom = vi.spyOn(Math, "random").mockReturnValue(0.25); // 0.25 → index 1 → user2

    const uid1 = getActiveMockUid();
    const uid2 = getActiveMockUid(); // should reuse cached value

    expect(uid1).toBe(uid2);
    expect(["user1", "user2", "user3", "user4"]).toContain(uid1);
    expect(spyRandom).toHaveBeenCalledTimes(1);

    spyRandom.mockRestore();
  });

  test("seedAllMockData writes all users and loans via setDoc", async () => {
    // Clear any calls triggered by module import / initial seeding
    setDoc.mockClear();

    await seedAllMockData();

    // 4 users + 8 loans = 12 setDoc calls
    expect(setDoc).toHaveBeenCalledTimes(12);

    // Basic sanity: first few calls go to the right collections
    // We know firebase.js calls: setDoc(doc(db,"users","user1"), {...})
    // and setDoc(doc(db,"loans","L1001"), {...}) etc.
    expect(doc).toHaveBeenCalledWith(expect.anything(), "users", "user1");
    expect(doc).toHaveBeenCalledWith(expect.anything(), "loans", "L1001");

    const firstCallArgs = setDoc.mock.calls[0];
    const loanCallArgs = setDoc.mock.calls[4];

    // first user data
    expect(firstCallArgs[1]).toMatchObject({
      firstName: "Jane",
      lastName: "Doe",
    });

    // first loan data
    expect(loanCallArgs[1]).toMatchObject({
      title: "Mockingjay",
      userId: "user1",
    });
  });
});
