// __mocks__/firebase.js

export const getUserProfile = vi.fn();
export const updateUserProfile = vi.fn();
export const getUserLoans = vi.fn();

// Mock auth object if needed
export const auth = {
  currentUser: { uid: "test-user-123" }
};