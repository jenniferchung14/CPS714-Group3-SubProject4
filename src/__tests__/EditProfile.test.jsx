import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditProfile from "../pages/EditProfile";
import { MemoryRouter, Route, Routes } from "react-router-dom";

vi.mock("../services/firebase");

import {
  getUserProfile,
  updateUserProfile,
} from "../services/firebase";

describe("EditProfile Component", () => {
  const mockProfile = {
    firstName: "John",
    lastName: "Doe",
    email: "john@test.com",
    phone: "123-456-7890",
    streetAddress: "123 Street",
    aptNumber: "10",
    city: "Toronto",
    province: "ON",
    postal: "A1A 1A1",
    gender: "Male",
    dateOfBirth: "2000-01-01",
    profilePic: "test.jpg",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    getUserProfile.mockResolvedValue(mockProfile);
  });

  function renderPage() {
    return render(
      <MemoryRouter initialEntries={["/editProfile/123"]}>
        <Routes>
          <Route path="/editProfile/:uid" element={<EditProfile />} />
        </Routes>
      </MemoryRouter>
    );
  }

  test("shows loading text on first render", () => {
    getUserProfile.mockReturnValueOnce(null);
    renderPage();
    expect(screen.getByText("Loading profile...")).toBeInTheDocument();
  });

  test("loads and displays profile fields", async () => {
    renderPage();

    expect(await screen.findByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john@test.com")).toBeInTheDocument();
  });

  test("shows validation error for invalid email", async () => {
    renderPage();

    const email = await screen.findByDisplayValue("john@test.com");
    fireEvent.change(email, { target: { value: "wrongemail.com" } });

    fireEvent.click(screen.getByText("Save"));

    expect(await screen.findByText("Invalid email.")).toBeInTheDocument();
  });

  test("calls updateUserProfile when save is pressed and fields valid", async () => {
    renderPage();

    fireEvent.click(await screen.findByText("Save"));

    await waitFor(() => {
      expect(updateUserProfile).toHaveBeenCalledWith(
        "123",
        expect.any(Object)
      );
    });
  });

  test("allows typing into phone input", async () => {
    renderPage();

    const phoneInput = await screen.findByDisplayValue("123-456-7890");
    fireEvent.change(phoneInput, { target: { value: "555-555-5555" } });

    expect(phoneInput.value).toBe("555-555-5555");
  });
});
