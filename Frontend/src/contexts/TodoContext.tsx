import { useReducer, useState, createContext, Dispatch, ReactNode } from 'react'
import { Todo } from '../types/Todo'
import { todoReducer, TodosAction } from '../reducers/TodoReducer'
import axios from 'axios'

export type TodosContextType = {
   todos: Todo[]
   dispatch: Dispatch<TodosAction>
   getTodos: () => void
   addTodo: (newTodo: Todo) => void
   editTodo: (idTodo: number, todo: string) => void
   deleteTodo: (idTodo: number) => void
   toggleDoneTodo: (idTodo: number, isDone: boolean) => void
   listAllTodos: () => void
   listAllDoneTodos: (todos: Todo[]) => void
   listAllWithoutDoneTodos: (todos: Todo[]) => void
} 

export type TodosContextProviderType = {
   children: ReactNode
}

const baseURL = axios.create({
   baseURL: 'http://localhost:3001'
})

const initialValue: Todo[] = [] 

export const TodosContext= createContext<TodosContextType | null>(null)

export const TodosProvider = ({ children }: TodosContextProviderType) => {
   // using Redux
   const [todos, dispatch] = useReducer(todoReducer, initialValue)
   const [saveTodo, setSaveTodo] = useState<Todo[]>([])

   const getTodos = async () => {
      await baseURL.get(`/todos`)
         .then(res => {
            console.log(res.data.result)
            dispatch({
               type: 'get',
               payload: res.data.result
   
            })
            
         })
         .catch(err => console.log(err))
   }

   const addTodo = async(newTodo: Todo) => {
      await baseURL.post(`/2`, newTodo)
         .then(res => {
            res.status === 201 && getTodos()
         })
         .catch(err => console.log(err))
   }

   const editTodo = async(idTodo: number, todo: string) => {
      // alert(`${idTodo} - ${ todo }`)
      await baseURL.put(`/edit/todo/${ idTodo }`, {
         iIdTodos: idTodo,
         sTodoTodos: todo
      })
         .then(res => {
            res.status === 200 && getTodos()
         })
         .catch(err => console.log(err))
   }
   
   const toggleDoneTodo = async(idTodo: number, isDone: boolean) => {
      // alert(`${ server }/edit/done/${ idTodo }, ${isDone}`)

      await baseURL.put(`/edit/done/${ idTodo }`, {
         iIdTodos: idTodo,
         bDoneTodos: !isDone
      })
         .then(res => {
            res.status === 200 && getTodos()
         })
         .catch(err => console.log(err))
   }

   const deleteTodo = async(idTodo: number) => {
      await baseURL.delete(`/delete/todos/${ idTodo }`)
         .then(res => {
            res.status === 200 && getTodos()
         })
         .catch(err => console.log(err))
   }

   const listAllTodos = () => {
      setSaveTodo(todos)
   }

   const listAllDoneTodos = (todos: Todo[]) => {
      //console.log(`${todos} - ${ isDone }`)
      return todos.filter(todo => todo.bDoneTodos)
   }

   const listAllWithoutDoneTodos = (todos: Todo[]) => {
      return todos.filter(todo => !todo.bDoneTodos)
   }

   return(
      <TodosContext.Provider value={{ todos, dispatch, getTodos, addTodo, editTodo, toggleDoneTodo, deleteTodo, listAllTodos, listAllDoneTodos, listAllWithoutDoneTodos }}>
         { children }
      </TodosContext.Provider>
   )
}