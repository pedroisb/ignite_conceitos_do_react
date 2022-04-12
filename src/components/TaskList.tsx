import { useState } from 'react'

import '../styles/tasklist.scss'

import { FiTrash, FiCheckSquare } from 'react-icons/fi'

interface Task {
  id: number;
  title: string;
  isComplete: boolean;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  function handleCreateNewTask() {
    // Crie uma nova task com um id random, não permita criar caso o título seja vazio.

    // created object newTask to store values of new task
    const newTask: Task = {
      id: Math.floor(Math.random()*101),
      title: `${newTaskTitle}`,
      isComplete: false,
    }

    // trim() will remove whitespaces, so as to make it easier to check for empty strings
    if(newTaskTitle.trim() !== ''){ 
      // since tasks is an array, we'll need to use spread operator in order to update it's value with the new element
      // the order here matters
      setTasks([
        ...tasks,
        newTask
      ])
    }
  }

  function handleToggleTaskCompletion(id: number) {
    // Altere entre `true` ou `false` o campo `isComplete` de uma task com dado ID

    // need to use any for type since undefined is a potential return type in find()
    const foundTask: any = tasks.find(el => el.id === id);

    // found task index in order to swap it later on
    const foundTaskIndex = tasks.indexOf(foundTask);

    // updated foundTask isComplete prop
    foundTask['isComplete'] = true;

    // created updatedTaskList and set it to tasks
    const updatedTaskList = tasks;

    // swapping old task with updated one
    updatedTaskList[foundTaskIndex] = foundTask;

    // usage of spread operator is mandatory here, otherwise React won't trigger re-render, it'll not compare the values of the old state with the updated one
    // in depth: updatedTaskList isn't a new array, it's the same array stored in tasks, but mutated
    // handleRemoveTask works without spread because filteredTaskList is indeed a NEW array; remember that filter() returns a new array, it doesn't mutate the original one
    setTasks([...updatedTaskList]);
  }

  function handleRemoveTask(id: number) {
    // Remova uma task da listagem pelo ID

    // filter() returns a new array list, which is ideal to be used with a setState(). I don't want to alter the original array, but set a new one, in order to trigger a re-render
    const filteredTaskList: Task[] = tasks.filter(el => el.id !== id);

    setTasks(filteredTaskList);
  }

  return (
    <section className="task-list container">
      <header>
        <h2>Minhas tasks</h2>

        <div className="input-group">
          <input 
            type="text" 
            placeholder="Adicionar novo todo" 
            onChange={(e) => setNewTaskTitle(e.target.value)}
            value={newTaskTitle}
          />
          <button type="submit" data-testid="add-task-button" onClick={handleCreateNewTask}>
            <FiCheckSquare size={16} color="#fff"/>
          </button>
        </div>
      </header>

      <main>
        <ul>
          {tasks.map(task => (
            <li key={task.id}>
              <div className={task.isComplete ? 'completed' : ''} data-testid="task" >
                <label className="checkbox-container">
                  <input 
                    type="checkbox"
                    readOnly
                    checked={task.isComplete}
                    onClick={() => handleToggleTaskCompletion(task.id)}
                  />
                  <span className="checkmark"></span>
                </label>
                <p>{task.title}</p>
              </div>

              <button type="button" data-testid="remove-task-button" onClick={() => handleRemoveTask(task.id)}>
                <FiTrash size={16}/>
              </button>
            </li>
          ))}
          
        </ul>
      </main>
    </section>
  )
}