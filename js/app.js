// select the elements
const dateElement = document.getElementById('date');
const formElement = document.getElementById('form-add-todo');
const listElement = document.getElementById('list');
const addToDoInputElement = document.getElementById('input');

// class names for indicator icons
const PENDING_ICON = 'bi bi-circle indicator-icon';
const DONE_ICON = 'bi bi-check-circle-fill indicator-icon';

const EXAMPLE_TODO = { id: 0, text: 'Example TODO', status: 'pending' };

const LOCAL_STORAGE_ID = 'TODO';

// TODO SECTION
// initialize variables
let toDoList = [];

// synchronize current toDo state into localStorage
function saveCurrentToDoToLocalStorage() {
  localStorage.setItem(LOCAL_STORAGE_ID, JSON.stringify(toDoList));
}

// clear the local storage and reload page
function clearAllToDo() {
  const clearIcon = document.getElementById('clear-icon');
  clearIcon.className = 'clear clearAnimation';

  // wait 0.5second before clearing localStorage and reloading page
  // because there is animation :)
  setTimeout(() => {
    localStorage.clear();
    location.reload();
  }, 500);
}

// super simple function to create new DOM element with toDo
function createToDoElement(id, text, status) {
  return `<li class="item" id="${id}">
            <div class="item-group" onclick="toggleToDoStatus(${id})">
              <i class="${
                status === 'pending' ? PENDING_ICON : DONE_ICON
              }" status="${status}" id="statusIcon-${id}"></i>
              <span id="text-${id}" class="text ${
    status === 'done' ? 'crossed' : ''
  }">${text}</span>
            </div>
            <i class="bi bi-trash remove-icon" id="deleteIcon-${id}" onclick="removeToDo(${id})"></i>
          </li>`;
}

// generic add toDo function
function addToDo(id, text, status, saveToLocalStorage = false) {
  const newItem = createToDoElement(toDoList.length, text, status);

  const position = 'beforeend';
  listElement.insertAdjacentHTML(position, newItem);
  toDoList.push({ id, text, status });

  if (saveToLocalStorage) {
    saveCurrentToDoToLocalStorage();
  }
}

// generic delete toDo function
function removeToDo(id) {
  const itemElement = document.getElementById(`${id}`);

  toDoList = toDoList.filter(toDo => toDo.id !== id);
  listElement.removeChild(itemElement);

  saveCurrentToDoToLocalStorage();
}

// function to handle whether toDo has been completed or not
function toggleToDoStatus(itemId) {
  const iconElement = document.getElementById(`statusIcon-${itemId}`);
  const textElement = document.getElementById(`text-${itemId}`);
  const currentStatus = iconElement.attributes['status'].value;
  const nextStatus = currentStatus === 'pending' ? 'done' : 'pending';

  iconElement.className = currentStatus === 'pending' ? DONE_ICON : PENDING_ICON;
  iconElement.attributes['status'].value = nextStatus;

  textElement.className = nextStatus === 'pending' ? 'text' : 'text crossed';

  toDoList[itemId].status = nextStatus;

  saveCurrentToDoToLocalStorage();
}

// function to handle adding new toDos via form
// this is much better than adding event listener on input button
function handleForm(event) {
  // prevents page reload which is really really bad!
  event.preventDefault();
  const text = addToDoInputElement.value;

  if (text !== '') {
    addToDo(toDoList.length, text, 'pending', true);
    // reset input to initial value
    addToDoInputElement.value = '';
  }
}

// when loading page for the first time, safely deal with localStorage
function handleInitialData() {
  // get data from localstorage
  const localStorageData = localStorage.getItem(LOCAL_STORAGE_ID);

  if (localStorageData) {
    // using try/catch block is good safety measure when doing risky operation
    try {
      // this is risky operation
      const parsedLocalStorage = JSON.parse(localStorageData);
      // remove example TODO
      listElement.innerHTML = '';
      // populate our toDoList with localStorage data (which are saved in browser)
      parsedLocalStorage.forEach(({ id, text, status }) => addToDo(id, text, status));
    } catch (error) {
      // display error in console
      console.error('Data in localStorage are corrupt: ', error);
      // clean localStorage as data in there are corrupt...
      localStorage.clear();
    }
  } else {
    addToDo(EXAMPLE_TODO.id, EXAMPLE_TODO.text, EXAMPLE_TODO.status);
  }
}

// this event handler is called when all DOM elements are loading (basically when our page is being loaded)
window.addEventListener('load', () => {
  handleInitialData();
  formElement.addEventListener('submit', handleForm);
});

// DATE SECTION
const options = { weekday: 'long', month: 'short', day: 'numeric' };
const today = new Date();

// show today's date
dateElement.innerHTML = today.toLocaleDateString('en-US', options);
