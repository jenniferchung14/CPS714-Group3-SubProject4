import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import LibraryTable from "../components/LibraryTable";

// Mock firebase services used by LibraryTable
vi.mock("../services/firebase", () => {
  return {
    getUserLoans: vi.fn(), // we will set per test
    renewUserLoan: vi.fn(), // we will assert calls
    getActiveMockUid: vi.fn(() => "u1"), // needed for LibraryTable's useEffect
  };
});

import { getUserLoans, renewUserLoan } from "../services/firebase";

const makeLoans = () => [
  {
    id: "L1001",
    title: "Mockingjay",
    author: "Suzanne Collins",
    bookCover: "https://example.com/mockingjay.jpg",
    genre: "Young Adult",
    dueDate: "2025-12-01",
    fines: 0,
    status: "BORROWED",
    hasHold: false,
    renewCount: 0,
  },
  {
    id: "L2001",
    title: "The Overdue Book",
    author: "Over Due",
    bookCover: "https://example.com/overdue.jpg",
    genre: "Fiction",
    dueDate: "2025-01-01",
    fines: 3.5,
    status: "OVERDUE",
    hasHold: false,
    renewCount: 0,
  },
  {
    id: "L3001",
    title: "Held Book",
    author: "Holdy McHold",
    bookCover: "https://example.com/hold.jpg",
    genre: "Mystery",
    dueDate: "2025-06-01",
    fines: 0,
    status: "BORROWED",
    hasHold: true,
    renewCount: 0,
  },
];

describe("LibraryTable", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("shows loading state then renders user loans", async () => {
    getUserLoans.mockResolvedValue(makeLoans());

    render(<LibraryTable />);

    expect(screen.getByText(/Loading your books/i)).toBeInTheDocument();

    const bookTitle = await screen.findByText("Mockingjay");
    expect(bookTitle).toBeInTheDocument();

    expect(screen.getByText("Author")).toBeInTheDocument();
    expect(screen.getByText("Due Date")).toBeInTheDocument();
  });

  test("shows a Renew button for an eligible BORROWED book", async () => {
    getUserLoans.mockResolvedValue(makeLoans());

    render(<LibraryTable />);

    await screen.findByText("Mockingjay");

    const renewButton = screen.getByRole("button", { name: /renew/i });
    expect(renewButton).toBeEnabled();
  });

  test("calls renewUserLoan and updates due date when Renew is clicked", async () => {
    // loan with a fixed date we can assert against
    const loans = makeLoans();
    loans[0].dueDate = "2025-12-01";
    loans[0].renewCount = 0;
    getUserLoans.mockResolvedValue(loans);

    render(<LibraryTable />);

    await screen.findByText("Mockingjay");

    const renewButton = screen.getByRole("button", { name: /renew/i });
    fireEvent.click(renewButton);

    // renewUserLoan should be called with new date and renewCount 1
    await waitFor(() => {
      expect(renewUserLoan).toHaveBeenCalledTimes(1);
    });

    const [loanId, newDueDate, newRenewCount] = renewUserLoan.mock.calls[0];
    expect(loanId).toBe("L1001");
    expect(newRenewCount).toBe(1);
    // newDueDate should be 14 days after 2025-12-01
    expect(newDueDate).toBe("2025-12-15");

    // UI should show the updated due date
    expect(screen.getByText("2025-12-15")).toBeInTheDocument();
  });

  test("disables Renew and shows tooltip when renew limit reached", async () => {
    const loans = makeLoans();
    loans[0].renewCount = 2; // already renewed twice
    getUserLoans.mockResolvedValue(loans);

    render(<LibraryTable />);

    await screen.findByText("Mockingjay");

    // tooltip for renewal limit is visible
    const tooltip = screen.getByRole("tooltip", {
      name: /cannot renew —\s*renewal limit of 2 reached/i,
    });
    expect(tooltip).toBeInTheDocument();

    // should not be able to access renew button
    // (the actual button is aria-hidden="true" so it's hidden)
    expect(
      screen.queryByRole("button", { name: /renew/i })
    ).not.toBeInTheDocument();
  });

  test("shows Pay Fine button for overdue loans and includes fines in summary", async () => {
    getUserLoans.mockResolvedValue(makeLoans());

    render(<LibraryTable />);

    await screen.findByText("Mockingjay");

    // pay fine button exists for overdue loan
    const payFineButton = screen.getByRole("button", { name: /pay fine/i });
    expect(payFineButton).toBeInTheDocument();

    // summary should contain total fines ($3.50 in mock)
    expect(screen.getByText(/Total fines: \$3\.50/i)).toBeInTheDocument();
  });
});
