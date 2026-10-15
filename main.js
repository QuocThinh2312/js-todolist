const todoForm = document.querySelector('#todo-form');
const taskList = document.querySelector('#task-list');
const input = document.querySelector('#todo-form > input');
const emptyMessage = document.querySelector('#empty-message');

let tasks = JSON.parse(localStorage.getItem('tasks')) ?? [];

function escapeHTML(data) {
  return data.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function appendTaskElement(task, isUpdating = false) {
  const taskItemEl = document.createElement('li');
  taskItemEl.className = 'bg-primary rounded-md px-4 py-3 transition-opacity duration-150 hover:opacity-90';
  taskItemEl.dataset.id = task.id;
  taskItemEl.innerHTML = `
            <div class="task-wrapper flex items-center justify-between">
              <span data-role="title" title="Click to mark this task as done" class="cursor-pointer select-none ${task.hasCompleted ? 'line-through text-white/60' : ''}">${escapeHTML(task.title)}</span>
              <div class="flex items-center gap-3">
                <button data-role="edit" title="Edit task" class="transition-scale duratio150 hover:scale-110 active:opacity-80">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                 </svg>
                </button>
                
                <button data-role="delete" title="Delete task" class="transition-scale duration-150 hover:scale-110 active:opacity-80">
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
    return taskItemEl;
  }
  taskList.prepend(taskItemEl);
}

function renderTasks() {
  if (!tasks.length) {
    emptyMessage.hidden = false;
    return;
  }
  emptyMessage.hidden = true;
  tasks.forEach((task) => appendTaskElement(task));
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
    id: Date.now().toString(),
    title: newTitle,
    hasCompleted: false,
  };

  if (!isDuplicateTask(newTitle)) {
    tasks.push(newTask);
    saveTasks();
    appendTaskElement(newTask);
    emptyMessage.hidden = true;
  }

  input.value = '';
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function isDuplicateTask(newTitle, ignoreId = null) {
  const isDuplicate = tasks.some((task) => task.title.toLowerCase() === newTitle.toLowerCase() && task.id !== ignoreId);

  if (isDuplicate) {
    alert('Task with this title already exists! Please use a different task title!');
  }

  return isDuplicate;
}

function getTaskById(taskId) {
  let l = 0;
  let r = tasks.length - 1;
  while (l <= r) {
    const m = Math.floor((l + r) / 2);
    if (+tasks[m].id === +taskId) return tasks[m];
    if (+tasks[m].id < +taskId) l = m + 1;
    else r = m - 1;
  }
  return null;
}

function handleTaskActions(e) {
  const titleEl = e.target.closest('[data-role="title"]');
  const editBtn = e.target.closest('[data-role="edit"]');
  const deleteBtn = e.target.closest('[data-role="delete"]');

  if (!titleEl && !editBtn && !deleteBtn) return;

  const taskItemEl = e.target.closest('li');
  const task = getTaskById(taskItemEl.dataset.id);

  if (!taskItemEl || !task) return;

  if (titleEl) {
    task.hasCompleted = !task.hasCompleted;
    titleEl.classList.toggle('line-through', task.hasCompleted);
    titleEl.classList.toggle('text-white/60', task.hasCompleted);
    saveTasks();
    return;
  }

  if (editBtn) {
    const originalTaskItemEl = taskItemEl.cloneNode(true);
    const html = `
      <form action="" class="flex">
        <input
          type="text"
          class="bg-[#1a1a40] px-4 py-2 border min-w-75 border-primary outline-0 text-sm placeholder:text-[#8d8ca0]"
          placeholder="Update task"
          spellcheck="false"
          value="${escapeHTML(task.title)}"
        />
        <button class="text-sm p-2 bg-primary w-full">Save</button>
      </form>`;
    taskItemEl.innerHTML = html;
    taskItemEl.className = '';

    const formUpdate = taskItemEl.querySelector('form');
    const inputUpdate = taskItemEl.querySelector('form > input');

    if (!formUpdate || !inputUpdate) return;

    inputUpdate.focus();
    inputUpdate.setSelectionRange(inputUpdate.value.length, inputUpdate.value.length); //Đặt dấu nháy về cuối text

    inputUpdate.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        taskItemEl.replaceWith(originalTaskItemEl);
      }
    });

    formUpdate.addEventListener('submit', (e) => {
      e.preventDefault();

      const newTitle = inputUpdate.value.trim();
      if (!newTitle) {
        alert('Task title cannot be empty!');
        inputUpdate.value = '';
        inputUpdate.focus();
        return;
      }

      if (isDuplicateTask(newTitle, task.id)) {
        inputUpdate.value = '';
        inputUpdate.focus();
        return;
      }

      task.title = newTitle;
      const newTaskEl = appendTaskElement(task, true);
      taskItemEl.replaceWith(newTaskEl);
      saveTasks();
    });

    return;
  }

  if (deleteBtn) {
    const isConfirmed = confirm(`Are you sure you want to delete "${task.title}"?`);
    if (isConfirmed) {
      tasks = tasks.filter((taskItem) => task.id !== taskItem.id);
      taskItemEl.remove();
      saveTasks();
      if (!tasks.length) {
        emptyMessage.hidden = false;
      }
    }
  }
}

todoForm.addEventListener('submit', addTask);
taskList.addEventListener('click', handleTaskActions);

renderTasks();
