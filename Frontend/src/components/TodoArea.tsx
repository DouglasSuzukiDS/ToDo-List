import { useEffect, useContext, useState } from 'react'
import { TodosContext } from "../contexts/TodoContext"
import { Square } from '../assets/Icons/Square'
import { SquareXMark } from '../assets/Icons/SquareXMark'
import { PenToSquare } from '../assets/Icons/PenToSquare'
import { EditType } from '../types/EditType'
import { Todo } from '../types/Todo'


export const TodoArea = ({ todo, setTodo, idTodo, setIdTodo, toEdit, setToEdit }: EditType) => {
   const todosCTX = useContext(TodosContext)
   const [saveTodo, setSaveTodo] = useState<Todo[]>([])

   const btnHover = [
      'hover:text-dark',
      'hover:border-red-300',
      'hover:bg-red-600'
   ].join(' ')

   useEffect(() => {
      todosCTX?.getTodos()
   }, [])

   useEffect(() => {
      setSaveTodo(todosCTX?.todos || [])
   }, [todosCTX?.todos])

   const handleListAllTodos = () => {
      /// setSaveTodo(todosCTX?.todos!)
      todosCTX?.getTodos()
   }

   const handleListAllDoneTodo = () => {
      todosCTX?.listAllDoneTodos(todosCTX.todos)
   }

   const handleListAllWithoutDoneTodo = () => {
      todosCTX?.listAllWithoutDoneTodos(todosCTX.todos)
   }

   const handleEditTodo = (todo: string, idTodo: number) => {
      setTodo(todo)
      setIdTodo(idTodo)
      setToEdit(true)
   }

   return ( 
      <ul className='border rounded-md overflow-y-hidden p-4 w-screen max-w-[640px]'>
         <section className='border w-full flex justify-between gap-4 hidden'>
            <button onClick={ handleListAllTodos }>Listar todos</button>
            <button onClick={ handleListAllDoneTodo }>Feitos</button>
            <button onClick={ handleListAllWithoutDoneTodo }>Fazer</button>
         </section>

         <section className='todoArea h-full w-full overflow-y-auto text-light'>
            { todosCTX?.todos.length! < 1 && 
               <p className='font-bold text-blue-500 text-center text-2xl'>Carregando ...</p> }

            {
               todosCTX?.todos.map(todo => (
               //saveTodo.map(todo => (
                  <li
                     key={todo.iIdTodos}
                     className={` todo flex justify-between items-center gap-4 p-4 border-b border-gray-600 cursor-pointer
                     `}>
                     <span className='flex items-center gap-4'>
                        { todo.bDoneTodos ? 
                           <SquareXMark w='24' h='24' fill='#3B82F6' 
                              onClick={ () => todosCTX.toggleDoneTodo(Number(todo.iIdTodos), todo.bDoneTodos!) } /> :
                           <Square w='24' h='24' fill='#3B82F6' 
                              onClick={ () => todosCTX.toggleDoneTodo(Number(todo.iIdTodos), todo.bDoneTodos!) } /> 
                        }
                        
                        <p
                           className={` ${ todo.bDoneTodos && 'line-through italic' } text-xl whitespace-break-spaces`}>
                           {todo.sTodoTodos}
                        </p>
                     </span>

                     <span className='flex justify-center items-center gap-4'>
                        { !todo.bDoneTodos && 
                           <button title='Editar' className='duration-700 hover:opacity-75'
                              onClick={ () => handleEditTodo(todo.sTodoTodos, Number(todo.iIdTodos)) }>
                              <PenToSquare w='24' h='24' fill='#0284C7' />
                           </button>
                        }

                        <button
                           className={`font-bold border border-red-600 text-light rounded-md py-2 px-4 outline-none transition-all duration-1000 ${ btnHover }`}
                           onClick={ () => todosCTX.deleteTodo(Number(todo.iIdTodos)) }>
                           Excluir
                        </button>
                     </span>
                  </li>
               ))
            }
         </section>
      </ul>

   )
}