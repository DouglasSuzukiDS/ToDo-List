import express, { json } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mysql from 'mysql2'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

dotenv.config()

const db = mysql.createPool({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_DATABASE
})

const server = express()

server.use(cors())
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

type Login = {
   sLoginUsers: string,
   sPasswordUsers: string
}

type Todo = {
   sTodoTodos: string
   bDoneTodos?: boolean
}

// Users
// List all users
server.get('/users', (req, res) => {
   let query = `SELECT * FROM users`

   db.query(query, (err, result) => {
      if (err) {
         console.log(err)
         res.status(404).send({ msg: 'Erro ao listar todos os usuários' })
      } else {
         res.status(200).send({ msg: 'Usuários localizados', result })
      }
   })
})

// Create new User
server.post('/newUser', (req, res) => {
   const { sLoginUsers, sPasswordUsers } = req.body

   let checkIfLoginExist = `SELECT * FROM users WHERE sLoginUsers = '${sLoginUsers}'`


   db.query(checkIfLoginExist, (err, result) => {
      if (err) {
         console.log(err)

         console.log(sLoginUsers, sPasswordUsers)

         res.status(404).send({ msg: 'Erro ao verificar se usuário existe' })

         console.log('SELECT * FROM users WHERE sLoginUsers = root')

      } else if (JSON.parse(JSON.stringify(result)).length > 0) {
         console.log(result)
         res.status(400).send({ msg: 'Login de Colaborador já existe' })
      } else {
         let hashPassword = bcrypt.hashSync(sPasswordUsers, 10)

         let query = `INSERT INTO users (sLoginUsers, sPasswordUsers) values ('${sLoginUsers}', '${hashPassword}')`

         db.query(query, (err, result) => {
            if (err) {
               console.log(err)
               res.status(404).send({ msg: 'Erro ao cadastrar usuário' })
            } else {
               console.log(result)
               res.status(201).send({ msg: 'Usuário cadastrado com sucesso!', result })
            }
         })
      }
   })

})

// Login
server.post('/login', (req, res) => {
   const { sLoginUsers, sPasswordUsers }: Login = req.body

   const checkIfUserExist = `SELECT * FROM users WHERE sLoginUsers = '${sLoginUsers}'`

   db.query(checkIfUserExist, (err, result) => {
      if (err) {
         console.log(err)
         res.status(404).send({ msg: 'Erro ao localizar usuário', result })
      } else if (JSON.parse(JSON.stringify(result)).length > 0) {
         const user: any = result
         // console.log(user)
         const compareHash = bcrypt.compareSync(sPasswordUsers, user[0].sPasswordUsers)
         console.log(compareHash)

         const secret: string = process.env.SECRET!

         if (compareHash) {
            const token = jwt.sign(
               { sLoginUsers: sLoginUsers, sPasswordUsers: sPasswordUsers },
               secret,
               { expiresIn: '2h' }
            )

            console.log(result)

            //console.log(`Logado como: ${ sLoginUsers }, Senha: ${ sPasswordUsers }, Token: ${ token }`)

            res.status(200).send({ msg: `Logado como: ${sLoginUsers}, Senha: ${sPasswordUsers}, Token: ${token}`, result })
         } else {
            console.log('Login / Senha não batem')
            res.status(400).send({ msg: 'Login / Senha não batem', result })
         }
      } else {
         res.status(400).send({ msg: 'Erro ao localizar usuáriOcorreu um erro, tende novamente', result })
      }
   })
})

// Edit user
server.put('/edit/user/:id', (req, res) => {
   const { id } = req.params
   const { sLoginUsers, sPasswordUsers }: Login = req.body

   const checkIfUserExist = `SELECT * FROM users WHERE iIdUsers = ${id}`

   db.query(checkIfUserExist, (err, result) => {
      if (err) {
         console.log(err)
         res.status(404).send({ msg: 'Erro ao tentar fazer a edição dos dados do usuário, por obséquio tente mais tarde.' })

      } else if (JSON.stringify(result).length < 1) {
         res.status(400).send({ msg: 'Esse login escolhido está indisponível no momento' })

      } else {
         const hashPassword = bcrypt.hashSync(sPasswordUsers, 10)

         const query = `UPDATE users SET sLoginUsers = '${sLoginUsers}', sPasswordUsers = '${hashPassword}' WHERE iIdUsers = ${id}`

         db.query(query, (err, result) => {
            if (err) {
               console.log(err)
               res.status(404).send({ msg: 'Erro ao editar os dados do colaborador. O login de colaborador pode já existir no sistema.' })
            } else {
               res.status(200).send({ msg: 'Cadastro do colaborador atualizado com Sucesso.', result })
            }
         })
      }
   })
})

// Delete user
server.delete('/delete/user/:id', (req, res) => {
   const { id } = req.params

   const checkIfLoginExist = `SELECT * FROM users WHERE iIdUsers = ${id}`

   db.query(checkIfLoginExist, (err, result) => {
      if (err) {
         console.log(err)
         res.status(404).send({ msg: 'Erro ao deletar usuário do sistema, por favor tente mais tarde.' })

      } else if (JSON.stringify(result).length < 1) {
         res.status(400).send({ msg: 'Não foi possível excluir o cadastro desse usuário. O cadastro pode não existir.' })
      } else {
         const query = `DELETE FROM users WHERE iIdUsers = ?`

         db.query(query, [id], (err, result) => {
            if (err) {
               console.log(err)
               res.status(404).send({ msg: 'Erro ao deletar o usuário do sistema.' })
            } else {
               res.status(200).send({ msg: 'Usuário deletado com sucesso.' })
            }
         })
      }
   })
})

// Todo's
// List all todos 
server.get('/todos', (req, res) => {
   let query = `SELECT * FROM todos`

   db.query(query, (err, result) => {
      if (err) {
         console.log(err)
         res.status(404).send({ msg: 'Erro ao listar as tarefas do usuário' })
      } else {
         res.status(200).send({ msg: 'Listas de tarefas localizadas', result })
      }
   })
})

// List all todo by user id
server.get('/todos/:id', (req, res) => {

   const { id } = req.params

   let query = `SELECT * FROM todos WHERE iIdUsers = ${id}`

   db.query(query, (err, result) => {
      if (err) {
         console.log(err)
         res.status(404).send({ msg: 'Erro ao listar as tarefas do usuário' })
      } else {
         res.status(200).send({ msg: 'Listas de tarefas localizadas', result })
      }
   })
})

// Post todo by id
server.post('/:id', (req, res) => {
   const { id } = req.params
   const { sTodoTodos }: Todo = req.body

   const query = `INSERT INTO todos (iIdUsers, sTodoTodos) VALUES (${id}, '${sTodoTodos}')`

   db.query(query, (err, result) => {
      if (err) {
         console.log(err)
         res.status(400).send({ msg: 'Erro ao tentar fazer o post da tarefa.' })
      } else {
         res.status(201).send({ msg: 'Tarefa adicionada com sucesso' })
      }
   })
})

// Edit todo by id
server.put('/edit/todo/:id', (req, res) => {
   const { id } = req.params
   const { sTodoTodos }: Todo = req.body

   const checkIfTodoExist = `SELECT * FROM todos WHERE iIdTodos = ${id}`

   db.query(checkIfTodoExist, (err, result) => {
      if (err) {
         console.log(err)
         res.status(404).send({ msg: 'Erro ao tentar localizar a Tarefa' })

      } else if (JSON.parse(JSON.stringify(result)).length === 1) {
         const query = `UPDATE todos SET sTodoTodos = '${sTodoTodos}' WHERE iIdTodos = ${id}`

         db.query(query, (err, result) => {
            if (err) {
               console.log(err)
               res.status(400).send({ msg: 'Erro ao editar a tarefa' })
            } else {
               res.status(200).send({ msg: 'Tarefa editada com sucesso.' })
            }
         })
      } else {
         res.status(400).send({ msg: 'Erro inesperado, por óbséquio, tente novamente' })
      }
   })
})

server.put('/edit/done/:id', (req, res) => {
   const { id } = req.params
   const { bDoneTodos }: Todo = req.body

   const checkIfTodoExist = `SELECT * FROM todos WHERE iIdTodos = ${id}`

   db.query(checkIfTodoExist, (err, result) => {
      if (err) {
         console.log(err)
         res.status(404).send({ msg: 'Erro ao tentar localizar a Tarefa' })

      } else if (JSON.parse(JSON.stringify(result)).length === 1) {
         const query = `UPDATE todos SET bDoneTodos = ${bDoneTodos} WHERE iIdTodos = ${id}`

         db.query(query, (err, result) => {
            if (err) {
               console.log(err)
               res.status(400).send({ msg: 'Erro ao editar a tarefa' })
            } else {
               res.status(200).send({ msg: 'Tarefa editada com sucesso.' })
            }
         })
      } else {
         res.status(400).send({ msg: 'Erro inesperado, por óbséquio, tente novamente' })
      }
   })
})

// Delete todo by id
server.delete('/delete/todos/:id', (req, res) => {
   const { id } = req.params

   const query = `DELETE FROM todos WHERE iIdTodos = ${id}`

   db.query(query, (err, result) => {
      if (err) {
         console.log(err)
         res.status(404).send({ msg: 'Erro ao deletar tarefa.' })
      } else {
         res.status(200).send({ msg: 'Tarefa deletada com sucesso.' })
      }
   })
})

// Delete all todos when user made logout
server.delete('/delete/todos', (req, res) => {
   const query = `DELETE FROM todos`
   const resetIdTodos = `ALTER TABLE todos AUTO_INCREMENT = 1`

   db.query(query, (err, result) => {
      if (err) {
         console.log(err)
         res.status(404).send({ msg: 'Erro ao deletar as tarefas do banco de dados.' })
      } else {
         db.query(resetIdTodos, (err, result) => {
            if(err) {
               console.log(err)
            res.status(404).send({ msg: 'Erro ao deletar as tarefas do banco de dados.' })
            } else {
               res.status(200).send({ msg: 'Tarefas deletadas com sucesso.' })
            }
         })
      }
   })
})

server.listen(3001, () => console.log('Running in port 3001'))