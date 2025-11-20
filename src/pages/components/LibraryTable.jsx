import React, { useEffect, useState } from "react";
import { getUserLoans } from "../../services/firebase";

const LibraryTable = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load books from Firestore
  useEffect(() => {
    async function load() {
      try {
        // Use the active mock UID chosen at app startup so different dev sessions
        // can show different users.
        const { getActiveMockUid } = await import("../../services/firebase");
        const uid = getActiveMockUid();
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
      return <button className="btn btn-fine">Pay Fine</button>;
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

                <td>{book.fine > 0 ? `$${book.fine.toFixed(2)}` : "$0.00"}</td>

                <td>{actionButton(book)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="library-summary">
        <div className="summary-info">
          <h4>Fine Summary</h4>

          {totalFine === 0 ? (
            <p>You have no outstanding fines.</p>
          ) : (
            <>
              <ul>
                {finedBooks.map((book) => (
                  <li key={book.id}>
                    {book.title} — ${book.fine.toFixed(2)}
                  </li>
                ))}
              </ul>
              <p className="summary-total">
                <strong>Total fines: ${totalFine.toFixed(2)}</strong>
              </p>
            </>
          )}
        </div>

        <button
          className="btn btn-pay-all"
          disabled={totalFine === 0}
          onClick={() => alert("Pay all fines logic goes here")}
        >
          Pay All Fines
        </button>
      </div>
    </div>
  );
};

export default LibraryTable;
