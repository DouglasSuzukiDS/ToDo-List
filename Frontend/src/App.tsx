import { useEffect, useContext, useState} from 'react'
import './App.css'
import { Form } from './components/Form'
import { TodoReducer } from './reducers/TodoReducer'
import { Todo } from './types/Todo'
import axios from 'axios'
import { TodosContext, TodosProvider } from './contexts/TodoContext'
import { TodoArea } from './components/TodoArea'

function App() {
  const [todo, setTodo] = useState('')
  const [idTodo, setIdTodo] = useState(0)
  const [toEdit, setToEdit] = useState(false)

  return (
    <TodosProvider>
      <main className='flex flex-col items-center h-screen p-4'>
        <h1 className='font-bold text-5xl text-blue-500'>Todo List</h1>

        <Form 
          todo={ todo } setTodo={ setTodo }
          idTodo={ idTodo } setIdTodo={ setIdTodo }
          toEdit={ toEdit } setToEdit={ setToEdit } />

        <TodoArea 
          todo={ todo } setTodo={ setTodo }
          idTodo={ idTodo } setIdTodo={ setIdTodo }
          toEdit={ toEdit } setToEdit={ setToEdit } />
    </main>
    </TodosProvider>
  )
}

export default App