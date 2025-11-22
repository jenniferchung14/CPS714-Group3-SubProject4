import React from "react";
import { render, screen } from "@testing-library/react";
import Profile from "../pages/Profile";
import { MemoryRouter, Routes, Route } from "react-router-dom";

vi.mock("../services/firebase");

import { getUserProfile } from "../services/firebase";

describe("Profile Component", () => {
  const mockProfile = {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@test.com",
    phone: "111-222-3333",
    city: "Vancouver",
    province: "BC",
    postal: "B2B 2B2",
    streetAddress: "789 Road",
    aptNumber: "12",
    gender: "Female",
    dateOfBirth: "1999-02-02",
    profilePic: "testpic.jpg",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    getUserProfile.mockResolvedValue(mockProfile);
  });

  function renderProfile() {
    return render(
      <MemoryRouter initialEntries={["/profile/abc123"]}>
        <Routes>
          <Route path="/profile/:uid" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    );
  }

  test("shows loading message initially", () => {
    getUserProfile.mockReturnValueOnce(null);
    renderProfile();
    expect(screen.getByText("Loading Profile...")).toBeInTheDocument();
  });

  test("displays user name, email, and phone", async () => {
    renderProfile();

    expect(await screen.findByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getAllByText("jane@test.com")).toHaveLength(2);
    expect(screen.getAllByText("111-222-3333")).toHaveLength(2);
  });

  test("shows city and province together", async () => {
    renderProfile();
    expect(await screen.findByText("Vancouver BC")).toBeInTheDocument();
  });

  test("edit button links to the correct URL", async () => {
    renderProfile();

    const btn = await screen.findByText("Edit Profile");
    expect(btn.closest("a").getAttribute("href")).toBe("/editProfile/abc123");
  });
});