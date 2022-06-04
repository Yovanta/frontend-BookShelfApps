const UNCOMPLETE_LIST_BOOK = "incompleteBookshelfList";
const COMPLETE_LIST_BOOK = "completeBookshelfList" ;
const BOOK_ITEMID = "itemId";

function addBook() {
    const incompletedReadBookList = document.getElementById(UNCOMPLETE_LIST_BOOK);
    const completedReadBookList = document.getElementById(COMPLETE_LIST_BOOK);

    const titleBook = document.getElementById("inputBookTitle").value;
    const authorBook = document.getElementById("inputBookAuthor").value;
    const yearBook = document.getElementById("inputBookYear").value;
    const isCompleted = document.getElementById("inputBookIsComplete").checked;

    const book = listBook(titleBook, authorBook, yearBook, isCompleted);
    const bookObject = composeBookObject(titleBook, authorBook, yearBook, isCompleted);
    
    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    if(isCompleted) {
        completedReadBookList.append(book);
    } else {
        incompletedReadBookList.append(book);
    }
    updateDataToStorage();
}

function listBook(title, author, year, isCompleted) {
    const textTitle = document.createElement("h2");
    textTitle.innerText = title;
    const textAuthor = document.createElement("h4");
    textAuthor.innerText = author;
    const textYear = document.createElement("p");
    textYear.innerText = year;

    const textContainer = document.createElement("bookList");
    textContainer.classList.add("inner")
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement("bookList");
    container.classList.add("item", "shadow")
    container.append(textContainer);

    if (isCompleted) {
        container.append(createUndoButton(), createDeleteButton());  
    } else {
        container.append(createButtonCeklist(), createDeleteButton());
    }
    return container;
}

function createButton (buttonTypeClass, eventListener) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.addEventListener('click', function(event) {
        eventListener(event);
    });
    return button;
}

function addBookToCompleted(bookList){
    const bookTitle = bookList.querySelector(".inner > h2").innerText;
    const bookAuthor = bookList.querySelector(".inner > h4").innerText;
    const bookYear = bookList.querySelector(".inner > p").innerText;

    const newBook = listBook(bookTitle, bookAuthor, bookYear, true);
    const completedReadBookList = document.getElementById(COMPLETE_LIST_BOOK);
    const book = findBook(bookList[BOOK_ITEMID]);
    book.isCompleted = true;
    newBook[BOOK_ITEMID] = book.id;
    
    completedReadBookList.append(newBook);
    bookList.remove();
    updateDataToStorage();
}

function createButtonCeklist() {
    return createButton("check-button", function(event) {
        addBookToCompleted(event.target.parentElement);
        alert('Buku telah selesai dibaca');
    });
} 

function removeBookFromCompleted(bookList) {
    const bookPosition = findBookIndex(bookList[BOOK_ITEMID]);
    books.splice(bookPosition, 1);

    bookList.remove();
    updateDataToStorage();
}

function createDeleteButton() {
    return createButton("delete-button", function(event) {
        removeBookFromCompleted(event.target.parentElement);
        alert('Buku di hapus dari daftar');
    })
}

function undoBookFromCompleted (bookList) {
    const bookUncompleted = document.getElementById(UNCOMPLETE_LIST_BOOK);
    const bookTitle = bookList.querySelector(".inner > h2").innerText;
    const bookAuthor = bookList.querySelector(".inner > h4").innerText;
    const bookYear = bookList.querySelector(".inner > p").innerText;

    const newBook = listBook(bookTitle, bookAuthor, bookYear, false);
    const book = findBook(bookList[BOOK_ITEMID]);
    book.isCompleted = false;
    newBook[BOOK_ITEMID] = book.id;

    bookUncompleted.append(newBook);
    bookList.remove();
    alert('Buku di kembalikan dalam daftar belum dibaca');
    updateDataToStorage();
}

function createUndoButton() {
    return createButton("undo-button", function(event) {
        undoBookFromCompleted(event.target.parentElement);
    });
}

function refreshDataFromBooks() {
    const listUncompleted = document.getElementById(UNCOMPLETE_LIST_BOOK);
    const listCompleted = document.getElementById(COMPLETE_LIST_BOOK);

    for(book of books) {
        const newBook = listBook(book.title, book.author, book.year, book.isCompleted);
        newBook[BOOK_ITEMID] = book.id;

        if (book.isCompleted) {
            listCompleted.append(newBook);
        } else {
            listUncompleted.append(newBook);
        }
    }
}

const searchTitle = document.getElementById('searchSubmit');
searchTitle.addEventListener('click', (event) => {
    event.preventDefault();

    const inputTitle = document.getElementById("searchBookTitle").value.toLowerCase();
    const book = document.querySelectorAll("bookList");

    for(bookList of book) {
        const title = bookList.firstElementChild.textContent.toLowerCase();

        if(title.indexOf(inputTitle) != -1) {
            bookList.style.display = "";
            console.log(title);
        } else {
            bookList.style.display = "none";
        }
    }
})