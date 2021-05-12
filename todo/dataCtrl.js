import * as storageCtrl from './storageCtrl.js';

let trackedTaskIndex;
let trackedListContainerId;

export function createTask(inputValue, deadlineValue, listId) {
  let input = inputValue;
  let targetList = findTargetList(listId);

  const indexRegex = /\d+\)/g;
  let taskIndex = input.match(indexRegex);
  if (taskIndex === null) {
    taskIndex = targetList.tasks.length;
  } else if (taskIndex !== null && parseInt(taskIndex[0]) >= targetList.tasks.length) {
    taskIndex = targetList.tasks.length;
    input = input.replace(indexRegex, '');
  } else if (taskIndex !== null && parseInt(taskIndex[0]) < targetList.tasks.length) {
    taskIndex = parseInt(taskIndex[0].replace(/\)/, '')) - 1;
    input = input.replace(indexRegex, '');
  }

  const tagRegex = /@\S+/g;
  let taskTag = input.match(tagRegex);
  if (taskTag === null) {
    taskTag = '';
  } else if (taskTag !== null) {
    input = input.replace(tagRegex, '');
    taskTag = taskTag[0];
  }

  const tagPriority = /p[1-4]/g;
  let taskPriority = input.match(tagPriority);
  if (taskPriority === null) {
    taskPriority = 4;
  } else if (taskPriority !== null) {
    taskPriority = parseInt(taskPriority[0].replace('p', ''));
    input = input.replace(tagPriority, '');
  }

  const firstSpaceRegex = /^\s+/g;
  let tempName = input.match(firstSpaceRegex);
  if (tempName == null) {
    tempName = input;
  } else {
    tempName = input.replace(firstSpaceRegex, '');
  }
  const lastSpaceRegex = /\s+$/g;
  let taskName;
  taskName = tempName.match(lastSpaceRegex);
  if (taskName == null) {
    taskName = tempName;
  } else {
    taskName = tempName.replace(lastSpaceRegex, '');
  }

  let taskDeadline = deadlineValue;

  return { index: taskIndex, name: taskName, tag: taskTag, priority: taskPriority, deadline: taskDeadline, complete: false };
}
/* ------------------------------------------------ */

export function createList(inputValue, currentListId) {
  const input = inputValue;
  const targetList = findTargetList(currentListId);
  const targetListIndex = targetList.index + 1;
  const newListId = Date.now();

  return { index: targetListIndex, name: input, id: newListId, tasks: [] };
}

/* ------------------------------------------------ */

// export let todoData = storageCtrl.getItemsFromStorage();
export let todoData = storageCtrl.getItemsFromStorage();

export const findTargetList = (listId) => {
  let targetList;
  for (let i = 0; i < todoData.length; i++) {
    targetList = todoData[i].lists.find((list) => list.id == listId);
    if (targetList != undefined) {
      return targetList;
    }
  }
};

const increaseIndexValues = (referenceIndex, listArray) => {
  listArray.forEach((item) => {
    if (referenceIndex <= item.index) {
      item.index += 1;
    }
  });
};

const decreaseIndexValues = (referenceIndex, listArray) => {
  listArray.forEach((item) => {
    if (referenceIndex < item.index) {
      item.index -= 1;
    }
  });
};

const sortByIndex = (list) => {
  list.sort((a, b) => a.index - b.index);
  console.log(list);
};

export const addTask = (newTask, listId) => {
  let targetList = findTargetList(listId);
  increaseIndexValues(newTask.index, targetList.tasks);
  targetList.tasks.push(newTask);
  sortByIndex(targetList.tasks);
};

export const getTaskValue = (taskIndexString, listContainerId) => {
  let targetListTasks = findTargetList(listContainerId).tasks;
  const taskIndex = parseInt(taskIndexString);
  let editString = `${targetListTasks[taskIndex].tag}  ${targetListTasks[taskIndex].name} p${targetListTasks[taskIndex].priority} ${
    targetListTasks[taskIndex].index + 1
  }) `;
  let editDate = targetListTasks[taskIndex].deadline;
  // console.log(editDate);
  return { string: editString, date: editDate };
};

export const setEditedTask = (taskIndex, listContainerId) => {
  // console.log('current task ' + ' ' + taskIndex + ' ' + listContainerId);
  trackedTaskIndex = taskIndex;
  trackedListContainerId = listContainerId;
};

export const getEditedTask = () => {
  return { taskIndex: trackedTaskIndex, containerId: trackedListContainerId };
};

export const deleteTask = (taskIndexString, listContainerId) => {
  const taskIndex = parseInt(taskIndexString);
  let targetListTasks = findTargetList(listContainerId).tasks;
  targetListTasks.splice(taskIndex, 1);
  decreaseIndexValues(taskIndex, targetListTasks);
  console.log(targetListTasks);
};

export const toggleTaskComplete = (taskIndexString, listContainerId) => {
  const taskIndex = parseInt(taskIndexString);
  let targetListTasks = findTargetList(listContainerId).tasks;
  targetListTasks[taskIndex].complete == false
    ? (targetListTasks[taskIndex].complete = true)
    : (targetListTasks[taskIndex].complete = false);
  console.log(targetListTasks);
};

const findTargetColumn = (columnName) => {
  for (let i = 0; i < todoData.length; i++) {
    if (todoData[i].columnId == columnName) {
      return todoData[i];
    }
  }
};

export const deleteList = (listContainerId, parentColumnName) => {
  const columnLists = findTargetColumn(parentColumnName).lists;
  let targetListIndex = findTargetList(listContainerId).index;
  columnLists.splice(targetListIndex, 1);
  decreaseIndexValues(targetListIndex, columnLists);
  console.log(columnLists);
};

export const addList = (newList, parentColumn) => {
  let targetColumn = findTargetColumn(parentColumn);
  // console.log(targetColumn);
  increaseIndexValues(newList.index, targetColumn.lists);
  targetColumn.lists.push(newList);
  sortByIndex(targetColumn.lists);
};
