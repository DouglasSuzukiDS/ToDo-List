import { FormEvent, useContext, useState } from 'react'
import { TodosContext } from '../contexts/TodoContext'
import { EditType } from '../types/EditType'


export const Form = ({ todo, setTodo, idTodo, setIdTodo, toEdit, setToEdit }: EditType) => {

   const todosCTX = useContext(TodosContext)

   const btnHover = [
      'hover:text-dark',
      'hover:border-blue-300',
      'hover:bg-blue-600'
   ].join(' ')

   const handleAddToDo = (e: FormEvent) => {
      e.preventDefault()

      todosCTX?.addTodo({
         iIdUsers: 2,
         sTodoTodos: todo
      })

      setTodo('')
   }

   const handleEditToDo = (e: FormEvent) => {
      e.preventDefault()

      todosCTX?.editTodo(idTodo, todo)

      setToEdit(false)
      setTodo('')
      setIdTodo(0)
   }

   return(
      <form className="flex max-w-[640px] p-4 my-6 gap-4 border border-sky-600 rounded-md">
         <input 
            type="text" 
            placeholder="Tarefa ..." 
            className="p-3 rounded-md font-bold text-center text-dark bg-blue-300 outline-none " 
            value={ todo }
            onChange={ e => setTodo(e.target.value) } /> 

         { !toEdit ?
            <button 
               className={ `font-bold border border-blue-600 text-light rounded-md py-2 px-4 outline-none transition-all duration-1000 ${btnHover}` }
               onClick={ handleAddToDo }>
               Adicionar
            </button> : 
            <button 
               className={ `font-bold border border-blue-600 text-light rounded-md py-2 px-4 outline-none transition-all duration-1000 w-[106.38px] ${btnHover} ` }
               onClick={ handleEditToDo }>
               Editar
            </button>
         }
         
      </form>
   )
}