import * as storageCtrl from './storageCtrl.js';
import * as dataCtrl from './dataCtrl.js';
import * as uiCtrl from './uiCtrl.js';

const loadEventListeners = () => {
  const uiSelectors = uiCtrl.getSelectors();

  document.addEventListener('submit', (e) => {
    e.preventDefault();
  });

  //nav edit - not in list so seperate

  document.querySelector('[data-nav-edit-form]').addEventListener('submit', (e) => {
    updateTaskSubmit();
  });

  //add event listener each list
  document.querySelectorAll(uiSelectors.listContainer).forEach((list) => {
    list.addEventListener('click', (e) => {
      const listContainerId = list.dataset.listContainer;
      //console.log(list.dataset.listContainer); //print out id
      console.log(e);
      // console.log(e.target.dataset);

      if (e.target.dataset.newTask == 'btn') {
        newTaskSubmit(listContainerId);
      }

      if (e.target.dataset.newList == 'btn') {
        newListSubmit(listContainerId);
      }

      if (e.target.dataset.task == 'delete') {
        const deletedTask = e.target.parentElement;
        deleteTaskSubmit(deletedTask, listContainerId);
      }

      if (e.target.dataset.listDelete == 'btn') {
        deleteListSubmit(listContainerId);
      }

      if (e.detail == 1 && (e.target.dataset.task == 'checkbox' || e.target.dataset.task == 'label' || e.target.dataset.taskTag == '')) {
        let taskIndex;
        if (e.target.dataset.taskTag == '') {
          taskIndex = e.target.parentElement.parentElement.dataset.taskIndex;
        } else {
          taskIndex = e.target.parentElement.dataset.taskIndex;
        }
        toggleTaskCompleteSubmit(taskIndex, listContainerId);
      }

      if (e.detail == 2 && (e.target.dataset.task == 'label' || e.target.dataset.taskTag == '')) {
        let taskIndex;
        if (e.target.dataset.taskTag == '') {
          taskIndex = e.target.parentElement.parentElement.dataset.taskIndex;
        } else {
          taskIndex = e.target.parentElement.dataset.taskIndex;
        }
        editTaskClick(taskIndex, listContainerId);
      }

      if (e.target.dataset.newTask == 'prompt' || e.target.dataset.newTask == 'span' || e.target.dataset.newTask == 'p') {
        toggleNewTaskInputClick(listContainerId);
      }

      if (e.target.dataset.newList == 'hover') {
        toggleAddListInputClick(listContainerId);
      }
    });
  });
};

const newTaskSubmit = (listContainerId) => {
  const input = uiCtrl.getTaskInput(listContainerId);
  if (input.taskInput === '' || input.taskInput === null) return;
  // console.log(input);
  const newTask = dataCtrl.createTask(input.taskInput, input.taskDeadline, listContainerId);
  console.log(newTask);
  dataCtrl.addTask(newTask, listContainerId);
  uiCtrl.renderTasks(listContainerId, dataCtrl.findTargetList(listContainerId).tasks);
  uiCtrl.clearInput(listContainerId);
  uiCtrl.toggleNewTaskInput(listContainerId);
  storageCtrl.saveToLocalStorage(dataCtrl.todoData);
  // console.log(dataCtrl.todoData);
};

const editTaskClick = (taskIndex, listContainerId) => {
  let input = dataCtrl.getTaskValue(taskIndex, listContainerId);
  uiCtrl.setInputToTaskValue(input.string, input.date);
  dataCtrl.setEditedTask(taskIndex, listContainerId);
};

//TODO:
const updateTaskSubmit = () => {
  //delete task
  let editedTaskData = dataCtrl.getEditedTask();
  dataCtrl.deleteTask(editedTaskData.taskIndex, editedTaskData.containerId);
  //make new task
  const input = uiCtrl.getEditedTaskInput();
  const newTask = dataCtrl.createTask(input.taskInput, input.taskDeadline, editedTaskData.containerId);
  dataCtrl.addTask(newTask, editedTaskData.containerId);
  uiCtrl.renderTasks(editedTaskData.containerId, dataCtrl.findTargetList(editedTaskData.containerId).tasks);
  //clear input & save to storage
  uiCtrl.clearEditInput();
  storageCtrl.saveToLocalStorage(dataCtrl.todoData);
};

const deleteTaskSubmit = (deletedTask, listContainerId) => {
  const taskIndex = deletedTask.dataset.taskIndex;
  console.log(taskIndex);
  dataCtrl.deleteTask(taskIndex, listContainerId);
  uiCtrl.renderTasks(listContainerId, dataCtrl.findTargetList(listContainerId).tasks);
  storageCtrl.saveToLocalStorage(dataCtrl.todoData);
};

const newListSubmit = (listContainerId) => {
  // console.log('new list');
  const parentColumn = uiCtrl.getParentColumn(listContainerId);
  console.log(parentColumn);

  const input = uiCtrl.getListInput(listContainerId, parentColumn);
  if (input === '' || input === null) return;
  const newList = dataCtrl.createList(input, listContainerId);
  console.log(newList);
  dataCtrl.addList(newList, parentColumn);
  uiCtrl.renderList(listContainerId, newList);
  loadEventListeners();
  uiCtrl.clearInput(listContainerId);
  uiCtrl.toggleAddListInput(listContainerId);
  storageCtrl.saveToLocalStorage(dataCtrl.todoData);
};

const deleteListSubmit = (listContainerId) => {
  const parentColumn = uiCtrl.getParentColumn(listContainerId);
  // console.log(parentColumn);
  dataCtrl.deleteList(listContainerId, parentColumn);
  storageCtrl.saveToLocalStorage(dataCtrl.todoData);
  init();
};

const toggleTaskCompleteSubmit = (taskIndex, listContainerId) => {
  // console.log(taskIndex);
  dataCtrl.toggleTaskComplete(taskIndex, listContainerId);
  uiCtrl.renderTasks(listContainerId, dataCtrl.findTargetList(listContainerId).tasks);
  storageCtrl.saveToLocalStorage(dataCtrl.todoData);
};

const toggleNewTaskInputClick = (listContainerId) => {
  uiCtrl.toggleNewTaskInput(listContainerId);
};

const toggleAddListInputClick = (listContainerId) => {
  uiCtrl.toggleAddListInput(listContainerId);
};

const init = () => {
  const items = dataCtrl.todoData;
  // const items = storageCtrl.getItemsFromStorage();
  console.log(items);
  uiCtrl.renderPage(items);
  loadEventListeners();
};
const today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //As January is 0.
var yyyy = today.getFullYear();

if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;
document.querySelector('[data-logo]').innerHTML = `${dd}.${mm}.${yyyy}`;
init();
