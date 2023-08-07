import { Todo } from "../types/Todo"

type GetTodoAction = {
   type: 'get',
   payload: []
}

type AddTodoAction = {
   type: 'add'
   payload: {
      iIdUsers?: number
      sTodoTodos: string
      bDoneTodos: boolean
   }
}

type EditTodoAction = {
   type: 'edit'
   payload: {
      iIdTodos: number
      sTodoTodos: string
   }
}

type ToggleDoneTodoAction = {
   type: 'toggleDone',
   payload: {
      iIdTodos: number
      b_done_todos: boolean
   }
}

type allDoneTodoAction = {
   type: 'allDone', 
   payload: {}
}

type allWithoutDoneTodoAction = {
   type: 'withoutDone', 
   payload: {}
}

type DeleteTodoAction = {
   type: 'delete'
   payload: {
      iIdTodos: number
   }
}

type DeleteAllTodoAction = {
   type: 'deleteAll'
   payload: {}
}

export type TodosAction = GetTodoAction | AddTodoAction | EditTodoAction | ToggleDoneTodoAction | allDoneTodoAction | allWithoutDoneTodoAction | DeleteTodoAction | DeleteAllTodoAction

type TodoReducerType = {
   todos: Todo[]
   action: TodosAction
}

export const todoReducer = (todos: Todo[], action: TodosAction): any=> {
   switch(action.type) {
      case 'get': 
         return action.payload
      case 'add': 
         return [...todos, {
            iIdTodos: todos.length,
            i_id_users: action.payload.iIdUsers,
            sTodoTodos: action.payload.sTodoTodos,
            b_done_todos: action.payload.bDoneTodos,
         }]
      case 'edit':
         return [
            ...todos, {
               iIdTodos: action.payload.iIdTodos,
               sTodoTodos: action.payload.sTodoTodos
            }
         ]
      case 'toggleDone': 
         return todos.map(todo => todo.iIdTodos === action.payload.iIdTodos ? 
            { ...todo, 
               b_done_todos: action.payload.b_done_todos 
            } : todo
         ) 
      case 'allDone':
         return todos.filter(todo => todo.bDoneTodos === true) 
      case 'withoutDone': 
         return todos.filter(todo => todo.bDoneTodos === false) 
      case 'delete':
         return todos.filter(todo => todo.iIdTodos !== action.payload.iIdTodos)
      case 'deleteAll':
         return []
      default: 
         return todos
   }
}