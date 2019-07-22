// create a book class
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class handle user interface
class UI {
    // using static we need not to instanciate class object to use this method
    static displayBooks() {

        const books = Store.getBook();

        books.forEach(book => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.getElementById('book-list');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</td>
        `;
        list.appendChild(row);
    }

    static delete(el) {
        if(el.classList.contains('delete')) {
            Store.removeBook(el.parentElement.previousElementSibling.textContent);            
            el.parentElement.parentElement.remove(); 
            UI.showAlert('Book Deleted Successfully', 'success');

        }
    }

    static clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }

    static showAlert(msg, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.append(document.createTextNode(msg));
        const container = document.querySelector('.container');
        const form = document.getElementById('book-form');
        container.insertBefore(div, form);
        setTimeout(() => div.style.display='none', 1500);
    }
}

// store class local storage
class Store {
    static getBook() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {
        let status = true;
        const books = Store.getBook();
        books.forEach(checkBook => {
            if(checkBook.isbn === book.isbn) {
                status =  false;
            }
        });
        if(status) {
            books.push(book);
            localStorage.setItem('books', JSON.stringify(books));
        }
        return status;
    }

    static removeBook(isbn) {
        const books = Store.getBook();
        
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}


// Events to show all books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event to create a new book
document.getElementById('book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    if(title === '' || author === '' || isbn === '') {
        UI.showAlert('Please Fill All Fields', 'danger');        
    } else {
        const book = new Book(title, author, isbn);
        let status = Store.addBook(book);
        if(!status) {
            UI.showAlert('This ISBN already exists', 'danger');
        } else {
            UI.addBookToList(book);
            UI.showAlert('Book Added Sucessfully', 'success');  
            UI.clearFields();
        }
    }
});

// Event to delete a book
document.getElementById('book-list').addEventListener('click', e => {
    UI.delete(e.target);
})

