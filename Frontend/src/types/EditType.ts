import { Dispatch, SetStateAction } from "react"

export type EditType = {
   todo: string
   setTodo: Dispatch<SetStateAction<string>>

   idTodo: number
   setIdTodo: Dispatch<SetStateAction<number>>

   toEdit: boolean
   setToEdit: Dispatch<SetStateAction<boolean>>
}