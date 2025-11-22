import React, { useEffect, useState } from "react";
import { getUserLoans } from "../services/firebase";

const LibraryTable = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load books from Firestore
  useEffect(() => {
    async function load() {
      try {
          // Use the uid from the URL query param if provided, otherwise fall
          // back to the active mock uid chosen at app startup. This ensures
          // the Dashboard shows the same user when navigated from a profile.
          const params = new URLSearchParams(window.location.search);
          let uid = params.get("uid");
          if (!uid) {
            const { getActiveMockUid } = await import("../services/firebase");
            uid = getActiveMockUid();
          }
          const loans = await getUserLoans(uid);

        const mapped = loans.map((loan, index) => {
          const today = new Date();
          const rawDue = loan.dueDate;
          const due = rawDue && rawDue !== "-" ? new Date(rawDue) : null;

          let status = loan.status || "BORROWED";
          if (!loan.status) {
            if (due && due < today && Number(loan.fines || 0) > 0)
              status = "OVERDUE";
          }

          return {
            id: loan.id || index,
            title: loan.title,
            cover: loan.bookCover,
            author: loan.author,
            genre: Array.isArray(loan.genre)
              ? loan.genre
              : [loan.genre].filter(Boolean),
            dueDate: loan.dueDate,
            fine: Number(loan.fines || 0),
            status,
            hasHold: Boolean(loan.hasHold),
          };
        });

        setBooks(mapped);
      } catch (e) {
        console.error("Error loading loans:", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const actionButton = (book) => {
    if (book.status === "RETURNED") {
      return (
        <button className="btn btn-returned" disabled>
          Returned
        </button>
      );
    }

    if (book.status === "OVERDUE" && book.fine > 0) {
      return <button 
        className="btn btn-fine"
        onClick={() => alert("Pay fines logic goes here")}
        >
      Pay Fine</button>;
    }

    if (book.status === "BORROWED" && !book.hasHold) {
      return <button className="btn btn-renew">Renew</button>;
    }

    if (book.status === "BORROWED" && book.hasHold) {
      const ttId = `tt-${book.id}`;
      return (
        <span className="tooltip-wrapper" tabIndex={0} aria-describedby={ttId}>
          <button className="btn btn-disabled" disabled aria-hidden="true">
            Renew
          </button>
          <span className="tooltip-text" role="tooltip" id={ttId}>
            Cannot renew — there is a hold on this book
          </span>
        </span>
      );
    }

    return null;
  };

  if (loading) return <p>Loading your books...</p>;

  const totalFine = books.reduce((sum, book) => sum + book.fine, 0);
  const finedBooks = books.filter((book) => book.fine > 0);

  return (
    <div className="library-table-container">
      <div className="table-wrapper">
        <table className="library-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Genre</th>
              <th>Due Date</th>
              <th>Fine</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  You have no checked-out books.
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book.id}>
                  <td>
                    <div className="title-wrapper">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="book-cover"
                      />
                      <span>{book.title}</span>
                    </div>
                  </td>

                  <td>{book.author}</td>

                  <td>
                    {book.genre.map((g, i) => (
                      <span key={i} className="genre-tag">
                        {g}
                      </span>
                    ))}
                  </td>

                  <td>{book.dueDate}</td>

                  <td>
                    {book.fine > 0 ? `$${book.fine.toFixed(2)}` : "$0.00"}
                  </td>

                  <td>{actionButton(book)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="library-summary">
        <div className="summary-info">
          <h3>Fine Summary</h3>

          {totalFine === 0 ? (
            <p>You have no outstanding fines.</p>
          ) : (
            <>
              <ul className="fines-list">
                {finedBooks.map((book) => (
                  <li key={book.id}>
                    <span className="book-title">{book.title}</span>
                    <span className="fine-amount">${book.fine.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="summary-footer">
                <p className="summary-total">
                  <strong>Total fines: ${totalFine.toFixed(2)}</strong>
                </p>
                <button
                  className="btn btn-pay-all"
                  disabled={totalFine === 0}
                  onClick={() => alert("Pay all fines logic goes here")}
                >
                  Pay All Fines
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LibraryTable;
