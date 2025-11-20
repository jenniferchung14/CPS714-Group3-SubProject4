import React from "react";

// I'm assuming the statuses will be: "BORROWED" | "OVERDUE" | "RETURNED"
const borrowedBooks = [
  {
    id: 1,
    title: "The Lovely Bones",
    cover: "https://m.media-amazon.com/images/I/81ZE6HFYZoL.jpg",
    author: "Alice Sebold",
    genre: ["Mystery"],
    dueDate: "2025-03-10",
    fine: 4.5,
    status: "OVERDUE",
    hasHold: false, // has to pay fee bc overdue
  },
  {
    id: 2,
    title: "The Lovely Bones",
    cover: "https://m.media-amazon.com/images/I/81ZE6HFYZoL.jpg",
    author: "Alice Sebold",
    genre: ["Mystery"],
    dueDate: "2025-03-20",
    fine: 0,
    status: "BORROWED",
    hasHold: true, // cannot renew
  },
  {
    id: 3,
    title: "The Lovely Bones",
    cover: "https://m.media-amazon.com/images/I/81ZE6HFYZoL.jpg",
    author: "Alice Sebold",
    genre: ["Fiction"],
    dueDate: "2025-03-21",
    fine: 0,
    status: "RETURNED",
    hasHold: false, // returned book
  },
  {
    id: 4,
    title: "The Lovely Bones",
    cover: "https://m.media-amazon.com/images/I/81ZE6HFYZoL.jpg",
    author: "Alice Sebold",
    genre: ["Fiction"],
    dueDate: "2025-03-21",
    fine: 0,
    status: "BORROWED",
    hasHold: false, // can renew, book currently borrowed
  },
];

const LibraryTable = () => {
  const actionButton = (book) => {
    // scenario 1: book is returned, button is disabled, says "returned"
    if (book.status === "RETURNED") {
      return (
        <button className="btn btn-returned" disabled>
          Returned
        </button>
      );
    }

    // scenario 2: book is overdue, so button says "pay fine" and is supposed to lead to pay fine page
    if (book.status === "OVERDUE" && book.fine > 0) {
      return <button className="btn btn-fine">Pay Fine</button>;
    }

    // scenario 3: book is currently borrowed and can renew bc NO holds
    if (book.status === "BORROWED" && !book.hasHold) {
      return <button className="btn btn-renew">Renew</button>;
    }

    // scenario 4: book is borrowed but has hold and cannot renew, button is disabled, hover for tooltip
    if (book.status === "BORROWED" && book.hasHold) {
      return (
        <button
          className="btn btn-disabled"
          disabled
          title="Cannot renew — there is a hold on this book"
        >
          Renew
        </button>
      );
    }

    return null;
  };

  // for summary of fines:
  const totalFine = borrowedBooks.reduce((sum, book) => sum + book.fine, 0);
  const finedBooks = borrowedBooks.filter((book) => book.fine > 0);

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
          {borrowedBooks.map((book) => (
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
          ))}
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
          // later: onClick={() => navigate("/pay-fines")} or call API
          onClick={() => alert("Pay all fines logic goes here")}
        >
          Pay All Fines
        </button>
      </div>
    </div>
  );
};

export default LibraryTable;
