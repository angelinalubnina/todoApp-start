
// 1. Добавление задач в список дел
// 1.1 Находиим местоположение формы в коду HTML
const form = document.querySelector('#form');

// 1.2 Находим инпут, в который мы быдем записывать задачи
// его id="taskInput"
const taskInput = document.querySelector('#taskInput');

// 1.7 Добавим константу для того, чтобы найти местоположение 
// тега tasksList
const tasksList = document.querySelector('#tasksList');

// 1.9 Найдем emptyList в HTML
const emptyList = document.querySelector('#emptyList');

// 4.1 Содадим массив, который будет хранить все задачи
let tasks = [];

/* 7. Проверим, если в Local Storage есть какие-то данные, мы их достанем
и запишем в массив */

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'));
	tasks.forEach((task) => renderTask(task));
}

checkEmptyList();


// 4.2 Добавление задачи


// 1.3 Повесим прослушку на форму. Нам надо, чтобы введеные строки
//заносились в задачи

/* отправка формы будет осуществляться нажатием на кнопку 'Добавить'
Метод addEventListener принимает 2 аргумента, 1- это событие, которое 
мы хотим отследить (submit), 2 - функция, которая будет выполнена, когда 
произойдет нужное нам событие 
Чтобы отменить перезагрузку страницы необходимо отменить стандартное поведение
формы - перезагрузка после отправки. Сделать это можно, написав слово 
event как параметр функции.*/

form.addEventListener('submit', addTask)

// 2. Удаление задач
/* То есть у нас есть кнопочки с крестиками и при нажатии на них должна будаляться
задача, которая была добавлена. То есть подождать клика на крестик, потом соответствующую
задачу сразу удалить. Кнопки крестики добавляются после в проуцессе работы кода,
поэтому просто повесить клик на кнопку не получится. Придется добавлять клик на вск поле
tasksList. То есть, если клик произошел о кнопке крестик внутри поля tasksList, то
удалить */

tasksList.addEventListener('click', deleteTask)

// 3. Отмечаем задачу завершенной

tasksList.addEventListener('click', doneTask)

/*  4. Передадим хранение данных в массив

// 6. Сохранение данных после обновления страницы
/* Local Storage - это хранилище данных в браузере, которое есть для каждого сайта
На вкладке Application есть папка Storage. там и лежит Local Storage*/

/* 5. Так как теперь данные хранятся в массиве необходимо 
сделать скрытие картинки "список задач пуст" тоже на основе данных 
То есть если массив tasks пустой, то надпись надо разместить на экране*/





// ФУНКЦИИ
function addTask(event) {
  /* preventDefault этот метод отменяет стандартное поведение формы  */
  event.preventDefault();
  // 1.4 Достаем текст из input. Теперь в этой переменной будет
  // лежать значение, которое мы вводим в поле
  const taskText = taskInput.value;

  // 4.3 Создадим объект, который будет описывать нашу задачу
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  }
  // Добавим объект в массив с задачами
  tasks.push(newTask);

  saveToLocalStorage();
  
  renderTask(newTask);
  // 1.8 Необходимо удалить содержимое input после добавления в список.
  // То есть удаляем поле ввода и возвращаем на него фокус
  taskInput.value = ''; // очищаем
  taskInput.focus();  // возвращаем фокус

  checkEmptyList();

  
}

function deleteTask(event) {
  // в CSS есть свойство .btn-action img, которое снимает все события с данного 
  // элемента и клик проходит сквозь него, то есть не по картинке img, а по button
  /* У кнопок есть такой атрибут как data-action, у кнопки delete - это
  data-action = 'delete', а у кнопки выполнено 'done'*/


  if(event.target.dataset.action !== 'delete') return;

  // Чтобы удалить задачу надо от этой кнопки найдем тег li и удалим этот тег
  
  const parenNode = event.target.closest('li') // closest производит поиск среди родителей этой кнопки
  
  // Определяем id задачи
  const id = Number(parenNode.id);

  // Находим индекс задачи в массиве
  tasks = tasks.filter((task) => task.id !== id);

  // // Удалим задачу из массива
  // tasks.splice(index, 1);

  saveToLocalStorage();

  parenNode.remove(); // метод удаления тега 
  
  // checkEmptyList();
}

function doneTask(event) {
  if(event.target.dataset.action !== 'done') return;
  

  // мы будем добавлять к span class='task-title' специальный класс task-title--done
  // этот класс зачеркивает нашу строку 
  const parentNode = event.target.closest('.list-group-item');

  const id = Number(parentNode.id);

  const task =  tasks.find((task) => task.id === id);
   
  task.done = !task.done;

  saveToLocalStorage();

  const taskTitle = parentNode.querySelector('.task-title');
  taskTitle.classList.toggle('task-title--done'); /* то есть этот класс будет добавлен к задаче(будет 
  делать текст серым), toggle будет позволять делать серым и возвращать обратно в зависимости
  от того, есть сейчас класс или нет*/
}

function checkEmptyList() {
  if (tasks.length === 0) {
		const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список дел пуст</div>
				</li>`;
		tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
	}

  if(tasks.length > 0) {
    const emptyListEl = document.querySelector('#emptyList');
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() { //6.1
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
  // Формируем css класс

  const cssClass = task.done? "task-title task-title--done" : "task-title";
  
  const taskHTML = `<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                      <span class="${cssClass}">${task.text}</span>
                      <div class="task-item__buttons">
                        <button type="button" data-action="done" class="btn-action">
                          <img src="./img/tick.svg" alt="Done" width="18" height="18">
                        </button>
                        <button type="button" data-action="delete" class="btn-action">
                          <img src="./img/cross.svg" alt="Done" width="18" height="18">
                        </button>
                      </div>
                    </li>`;
  // 1.6 Добавляем задачу на страницу
  // Мы хотим наш тег li из 1.5 добавить в тег ul с id tasksList
  // Нас интересует именно insertAdjacentHTML, так как мы вставляем
  // именно HTML код (аргумент 1 - куда будет добавлен этот кусок кода,
  // аргумент 2 - кусок разметки, который мы хотим отобразить)
  tasksList.insertAdjacentHTML('beforeend', taskHTML);
}