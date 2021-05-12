export const STORAGE_KEY = 'axw.buy';

export const getItemsFromStorage = () => {
  let todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
    {
      columnId: 'col-0',
      columnName: 'High Priority',
      lists: [
        {
          index: 0,
          name: '',
          id: 111,
          tasks: [{ index: 0, name: 'Hi!', tag: '@example', priority: 1, deadline: '2020-07-08', complete: false }],
        },
      ],
    },
    {
      columnId: 'col-1',
      columnName: 'Medium Priority',
      lists: [{ index: 0, name: '', id: 222, tasks: [] }],
    },
    {
      columnId: 'col-2',
      columnName: 'Low Priority',
      lists: [
        {
          index: 0,
          name: '',
          id: 333,
          tasks: [],
        },
      ],
    },
  ];

  return todos;
};

export const saveToLocalStorage = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
