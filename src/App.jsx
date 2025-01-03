import { createBook, getBooks, deleteBook, updateBook } from "./services/api";
import { useState, useEffect } from "react";

const App = () => {
  const [title, setTitle] = useState();
  const [id, setId] = useState();
  const  [books, setBooks] = useState();

  useEffect(() => { 
    showBooks(); 
  }, [])

  const showBooks = () => {
    getBooks().then( data => setBooks(data));
  }
  return (
    <>
      <input type="text" onChange={e => setTitle(e.target.value)} placeholder="title" /> 
      <input type="text" onChange={e => setId(e.target.value)} placeholder="id"/>
      <button onClick={async () => {
        createBook({title}) 
        showBooks();
      }}>Insert book</button>

      <button onClick={
        async () => {
          deleteBook(id);
          showBooks();
        }
      }>Delete book</button>

      <button onClick={
        async () => {
          updateBook(id, {title});
          showBooks();
        }
      }>Update book</button>

      <table border="1px">
        {
          books?.map(book => <tr key={book.id}><td>{book.title}</td>- <td>{book.id}</td></tr>)
        }
      </table>
    </>
  )
}

export default App
