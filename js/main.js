const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';


function generateId() {
  return +new Date();
}

function generateBookObject(id, judul, penulis, tahun, isCompleted) {
  return {
    id,
    judul: judul.value,
    penulis: penulis.value,
    tahun: Number(tahun.value),
    isCompleted
  };
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung web storage");
    return false;
  }
  return true;
};

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {

  const {id, judul, penulis, tahun, isCompleted} = bookObject;

  const textTitle = document.createElement('h2');
  textTitle.innerText = judul;

  const textPenulis = document.createElement('p');
  textPenulis.innerText = penulis;
  
  const textTahun = document.createElement('p');
  textTahun.innerText = tahun;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textPenulis, textTahun);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow')
  container.append(textContainer);
  container.setAttribute('id', `book-${id}`);

  if (isCompleted) {

    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.addEventListener('click', function () {
      const customAlert = document.createElement("div");
      customAlert.classList.add("alert");
      customAlert.innerText = "Berhasil Dipindahkan!";

      document.body.insertBefore(customAlert, document.body.children[0]);
      setTimeout(function() {
          customAlert.remove();
      }, 2000);
      undoTaskFromCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      const customAlert = document.createElement("div");
      customAlert.classList.add("alert");
      customAlert.innerText = "Berhasil Dihapus!";

      document.body.insertBefore(customAlert, document.body.children[0]);
      setTimeout(function () {
          customAlert.remove();
      }, 2000);
      removeTaskFromCompleted(id);
    });

    container.append(undoButton, trashButton);
  } else {

    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    checkButton.addEventListener('click', function () {
      const customAlert = document.createElement("div");
      customAlert.classList.add("alert");
      customAlert.innerText = "Berhasil Dipindahkan!";

      document.body.insertBefore(customAlert, document.body.children[0]);
      setTimeout(function() {
          customAlert.remove();
      }, 2000);
      addTaskToCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      const customAlert = document.createElement("div");
      customAlert.classList.add("alert");
      customAlert.innerText = "Berhasil Dihapus!";

      document.body.insertBefore(customAlert, document.body.children[0]);
      setTimeout(function () {
          customAlert.remove();
      }, 2000);
      removeTaskFromCompleted(id);
    });

    container.append(checkButton, trashButton);
  }

  return container;
}

function addBook() {
  const textBook = document.getElementById('inputBookTitle');
  const textPenulis = document.getElementById('inputBookAuthor');
  const tahun = document.getElementById('inputBookYear');
  const bookHasFinished = document.getElementById("inputBookIsComplete");
  let bookStatus;

  if (bookHasFinished.checked) {
    bookStatus = true;
  } else {
    bookStatus = false;
  }

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, textBook, textPenulis, tahun, bookStatus);
  books.push(bookObject);

  textBook.value = null;
  textPenulis.value = null;
  tahun.value = null;
  bookHasFinished.checked = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addTaskToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}



function removeTaskFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(bookId) {

  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {
  if (isStorageExist()) {
    loadDataFromStorage();
  }

  const submitForm = document.getElementById('form');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  const searchForm = document.getElementById("formSearch");
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        search();
    });

});

function search() {
  const search = document.getElementById("inputSearchBook").value.toLowerCase();
  const bookItems = document.getElementsByClassName("item");

  for (let i = 0; i < bookItems.length; i++) {
      const itemTitle = bookItems[i].querySelector("h2");
      if (itemTitle.textContent.toLowerCase().includes(search)) {
          bookItems[i].classList.remove("hidden");
      } else {
          bookItems[i].classList.add("hidden");
      }
  }
};

document.addEventListener(SAVED_EVENT, () => {
  const customAlert = document.createElement("div");
  customAlert.classList.add("alert");
  customAlert.innerText = "Berhasil Disimpan!";

  document.body.insertBefore(customAlert, document.body.children[0]);
    setTimeout(function() {
      customAlert.remove();
    }, 2000);
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKList = document.getElementById('books');
  const listCompleted = document.getElementById('completed-books');

  uncompletedBOOKList.innerHTML = '';
  listCompleted.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      listCompleted.append(bookElement);
    } else {
      uncompletedBOOKList.append(bookElement);
    }
  }
});

