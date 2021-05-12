//TODO: rename data-list-container to - - only, no =
export const uiSelectors = {
  contentElement: '#content',
  listTemplate: '#list-template',
  listContainer: '[data-list-container]',
  listContainerName: 'data-list-container',
  listHeader: '[data-list-header]',
  listDeleteBtn: '[data-list-delete]',
  listTaskRenderLocation: '[data-tasks]',
  newListInput: '[data-new-list="input"]',
  taskTemplate: '#task-template',
  newTaskInput: '[data-new-task="input"]',
  newTaskDeadline: '[data-new-task="deadline"]',
  newTaskBtn: '[data-new-task="btn"]',
};

export const renderTasks = (listId, tasksArray) => {
  //select that task list -> rennder items
  const listElement = document.querySelector(`[${uiSelectors.listContainerName}='${listId}']`);
  let tasksElement = listElement.querySelector(`${uiSelectors.listTaskRenderLocation}`);
  tasksElement.innerHTML = '';
  // console.log(tasksElement);
  tasksArray.forEach((task) => {
    const taskTemplate = document.importNode(document.querySelector(uiSelectors.taskTemplate).content, true);
    const taskLocation = listElement.querySelector(uiSelectors.listTaskRenderLocation);
    const taskDiv = taskTemplate.querySelector('div');
    taskDiv.dataset.taskIndex = task.index;

    const label = taskTemplate.querySelector('label');
    label.append(task.name);
    if (task.complete == true) taskDiv.classList.add('complete');

    const tagElement = taskTemplate.querySelector('[data-task-tag]');
    if (task.tag !== '') tagElement.innerText = task.tag + ' ';
    const deadlineElement = taskTemplate.querySelector('[data-task-deadline]');
    if (task.deadline !== '') deadlineElement.innerText = renderDeadline(task.deadline);
    const checkElement = taskTemplate.querySelector('input[type="checkbox"]');
    checkElement.checked = task.complete;
    checkElement.classList.add(`p${task.priority}`);
    //add task index to delete button for easy reference
    const deleteBtn = taskTemplate.querySelector('[data-task="delete"]');
    deleteBtn.append(`${task.index + 1}`);
    taskLocation.appendChild(taskTemplate);
  });
};

export const renderList = (listId, newList) => {
  const listElement = document.querySelector(`[${uiSelectors.listContainerName}='${listId}']`);
  console.log(listElement);
  const listTemplate = document.importNode(document.querySelector(uiSelectors.listTemplate).content, true);
  const listTitle = listTemplate.querySelector(uiSelectors.listHeader);
  listTitle.innerText = newList.name;
  listTemplate.querySelector(uiSelectors.listContainer).dataset.listContainer = newList.id;
  listElement.parentNode.insertBefore(listTemplate, listElement.nextSibling); //add new list behind current list
};

export const clearInput = (listId) => {
  const listElement = document.querySelector(`[${uiSelectors.listContainerName}='${listId}']`);
  let inputElements = listElement.querySelectorAll('input[type="text"], input[type="date"]');
  inputElements.forEach((input) => {
    input.value = '';
  });
};

export const clearEditInput = () => {
  document.querySelector('[data-nav-edit-input]').value = '';
  document.querySelector('[data-nav-edit-deadline]').value = '';
  document.querySelector('[data-nav-edit-form]').classList.add('transparent');
};

export const renderPage = (items) => {
  let contentElement = document.querySelector(uiSelectors.contentElement);
  contentElement.innerHTML = '';
  items.forEach((col) => {
    //column render
    let columnElement = document.createElement('div');
    columnElement.dataset.colId = col.columnId;
    let columnHeader = document.createElement('h2');
    columnHeader.innerText = col.columnName;
    columnElement.appendChild(columnHeader);
    contentElement.appendChild(columnElement);
    //list render
    col.lists.forEach((list) => {
      const listElement = document.importNode(document.querySelector(uiSelectors.listTemplate).content, true);
      const listTitle = listElement.querySelector(uiSelectors.listHeader);
      listTitle.innerText = list.name;
      listElement.querySelector(uiSelectors.listContainer).dataset.listContainer = list.id;
      //task render
      list.tasks.forEach((task) => {
        //TODO: make this a function
        const taskTemplate = document.importNode(document.querySelector(uiSelectors.taskTemplate).content, true);
        const taskLocation = listElement.querySelector(uiSelectors.listTaskRenderLocation);
        const label = taskTemplate.querySelector('label');
        const taskDiv = taskTemplate.querySelector('div');
        taskDiv.dataset.taskIndex = task.index;

        label.append(task.name);
        if (task.complete == true) taskDiv.classList.add('complete');
        const tagElement = taskTemplate.querySelector('[data-task-tag]');
        if (task.tag !== '') tagElement.innerText = task.tag + ' ';
        const deadlineElement = taskTemplate.querySelector('[data-task-deadline]');
        if (task.deadline !== '') deadlineElement.innerText = renderDeadline(task.deadline);
        const checkElement = taskTemplate.querySelector('input[type="checkbox"]');
        checkElement.checked = task.complete;
        checkElement.classList.add(`p${task.priority}`);
        //add task index to delete button for easy reference
        const deleteBtn = taskTemplate.querySelector('[data-task="delete"]');
        deleteBtn.append(`${task.index + 1}`);

        //
        taskLocation.appendChild(taskTemplate);
      });
      columnElement.appendChild(listElement);
    });
  });
};

export const setInputToTaskValue = (textInput, dateInput) => {
  document.querySelector('[data-nav-edit-form]').classList.remove('transparent');

  let navInputElement = document.querySelector('[data-nav-edit-input]');
  const navDeadlineElement = document.querySelector('[data-nav-edit-deadline]');
  navInputElement.value = textInput;
  navDeadlineElement.value = dateInput;
};

export const toggleNewTaskInput = (listContainerId) => {
  const listElement = document.querySelector(`[data-list-container='${listContainerId}']`);
  const promptElement = listElement.querySelector('[data-new-task="prompt"]');
  promptElement.classList.toggle('hide');
  const formElement = listElement.querySelector('[data-new-task="form"]');
  formElement.classList.toggle('hide');
  const input = listElement.querySelector('input[type="text"]');
  input.focus();
  console.log(listElement);
};

export const toggleAddListInput = (listContainerId) => {
  const listElement = document.querySelector(`[data-list-container='${listContainerId}']`);
  const hoverElement = listElement.querySelector('[data-new-list="hover"]');
  hoverElement.classList.toggle('hide');
  const formElement = listElement.querySelector('[data-new-list="form"]');
  formElement.classList.toggle('hide');
  const input = listElement.querySelector('input[type="text"]');
  input.focus();
  console.log(listElement);
};

const renderDeadline = (deadline) => {
  let dueDate = new Date(deadline);
  dueDate = new Date(dueDate.getUTCFullYear(), dueDate.getUTCMonth(), dueDate.getUTCDate());
  let todayDate = new Date();
  todayDate = new Date(todayDate.getUTCFullYear(), todayDate.getUTCMonth(), todayDate.getUTCDate());
  let tomorrowDate = new Date();
  tomorrowDate = new Date(todayDate.getUTCFullYear(), todayDate.getUTCMonth(), todayDate.getUTCDate() + 1);
  let weekDate = new Date();
  weekDate = new Date(todayDate.getUTCFullYear(), todayDate.getUTCMonth(), todayDate.getUTCDate() + 7);
  let formattedDate;
  let weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  if (todayDate > dueDate) {
    formattedDate = `\u2297 ${dueDate.getDate()}-${dueDate.getMonth() + 1}-${dueDate.getFullYear()}`;
  } else if (todayDate.toDateString() == dueDate.toDateString()) {
    formattedDate = 'Today';
  } else if (tomorrowDate.toDateString() == dueDate.toDateString()) {
    formattedDate = 'Tomorrow';
  } else if (weekDate > dueDate) {
    formattedDate = weekday[dueDate.getDay()];
  } else if (weekDate <= dueDate) {
    formattedDate = `${dueDate.getDate()}-${dueDate.getMonth() + 1}-${dueDate.getFullYear()}`;
  }
  return formattedDate;
};

export const getTaskInput = (listContainerId) => {
  const targetList = document.querySelector(`[${uiSelectors.listContainerName}='${listContainerId}']`);
  return {
    taskInput: targetList.querySelector(uiSelectors.newTaskInput).value,
    taskDeadline: targetList.querySelector(uiSelectors.newTaskDeadline).value,
  };
};

export const getEditedTaskInput = () => {
  return {
    taskInput: document.querySelector('[data-nav-edit-input]').value,
    taskDeadline: document.querySelector('[data-nav-edit-deadline]').value,
  };
};

export const getListInput = (listContainerId) => {
  const targetList = document.querySelector(`[${uiSelectors.listContainerName}='${listContainerId}']`);
  console.log(targetList);
  return targetList.querySelector(uiSelectors.newListInput).value;
  // return {
  // listName: targetList.querySelector(uiSelectors.newListInput).value
  // };
};

export const getParentColumn = (listContainerId) => {
  const targetList = document.querySelector(`[${uiSelectors.listContainerName}='${listContainerId}']`);
  return targetList.parentElement.dataset.colId;
};

export const getSelectors = () => {
  return uiSelectors;
};
