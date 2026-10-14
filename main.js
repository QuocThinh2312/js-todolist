const todoForm = document.querySelector('#todo-form');
const taskList = document.querySelector('#task-list');
const input = document.querySelector('#todo-form > input');

const tasks = JSON.parse(localStorage.getItem('tasks')) ?? [];

function appendTaskElement(task, index, isUpdating = false) {
  const taskItem = document.createElement('li');
  taskItem.classList = 'bg-primary rounded-md px-4 py-3';
  taskItem.setAttribute('data-index', index);
  taskItem.innerHTML = `
            <div class="task-wrapper flex items-center justify-between">
              <span data-role="title" class="cursor-pointer select-none ${task.hasCompleted ? 'line-through text-white/60' : ''}">${task.title}</span>
              <div class="flex items-center gap-3">
                <button data-role="edit">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                 </svg>
                </button>
                
                <button data-role="delete">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>`;

  if (isUpdating) {
    taskList.insertBefore(taskItem, taskList.children[tasks.length - index - 1]);
    return;
  }
  taskList.prepend(taskItem);
}

function renderTasks() {
  tasks.forEach((task, index) => appendTaskElement(task, index));
}

function addTask(e) {
  e.preventDefault();

  const newTitle = input.value.trim();
  if (!newTitle) {
    alert('Please write something!');
    input.value = '';
    return;
  }

  const newTask = {
    title: newTitle,
    hasCompleted: false,
  };

  if (!isDuplicateTask(newTitle)) {
    tasks.push(newTask);
    saveTasks();
    appendTaskElement(newTask, tasks.length - 1);
  }

  input.value = '';
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function isDuplicateTask(newTitle, currentTitle = null) {
  const isDuplicate = tasks.some((task) => task.title.toLowerCase() === newTitle.toLowerCase() && newTitle !== currentTitle);

  if (isDuplicate) {
    alert('Task with this title already exists! Please use a different task title!');
  }

  return isDuplicate;
}

function handleTaskActions(e) {
  const title = e.target.closest('[data-role="title"]');
  const editBtn = e.target.closest('[data-role="edit"]');
  const deleteBtn = e.target.closest('[data-role="delete"]');

  if (!title && !editBtn && !deleteBtn) return;

  const taskItem = e.target.closest('li');
  const taskIndex = +taskItem.dataset.index;
  const task = tasks[taskIndex];

  if (title) {
    task.hasCompleted = !task.hasCompleted;
    if (task.hasCompleted) {
      title.classList.add('line-through', 'text-white/60');
    } else {
      title.classList.remove('line-through', 'text-white/60');
    }
    saveTasks();
    return;
  }

  if (editBtn) {
    const taskWrapper = taskItem.querySelector('.task-wrapper');
    const html = `
      <form id="update-form" action="" class="flex">
        <input
          type="text"
          class="bg-[#1a1a40] px-4 py-2 border min-w-75 border-primary outline-0 text-sm placeholder:text-[#8d8ca0]"
          placeholder="Update task"
          spellcheck="false"
          value=${task.title}
        />
        <button class="text-sm p-2 bg-primary w-full">Save</button>
      </form>`;
    taskItem.removeChild(taskWrapper);
    taskItem.innerHTML = html;
    taskItem.classList = '';

    const formUpdate = taskItem.querySelector('#update-form');
    const inputUpdate = taskItem.querySelector('#update-form > input');

    inputUpdate.focus();
    inputUpdate.setSelectionRange(inputUpdate.value.length, inputUpdate.value.length); //Đặt dấu nháy về cuối text

    formUpdate.addEventListener('submit', (e) => {
      e.preventDefault();

      const newTitle = inputUpdate.value.trim();
      if (!newTitle) {
        alert('Task title cannot be empty!');
      }

      if (!newTitle || isDuplicateTask(newTitle, task.title)) {
        inputUpdate.value = '';
        inputUpdate.focus();
        return;
      }

      tasks[taskIndex].title = newTitle;
      taskItem.remove();
      appendTaskElement(tasks[taskIndex], taskIndex, true);
      saveTasks();
    });

    return;
  }

  if (deleteBtn) {
    const isConfirmed = confirm(`Are you sure you want to delete "${task.title}"?`);
    if (isConfirmed) {
      tasks.splice(taskIndex, 1);
      taskItem.remove();
      saveTasks();
    }
  }
}

todoForm.addEventListener('submit', addTask);
taskList.addEventListener('click', handleTaskActions);

renderTasks();
