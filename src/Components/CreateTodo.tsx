import { useState } from "react"
import { toast } from "react-hot-toast"
import { todoInput } from "~/types"
import { api } from "~/utils/api"

export default function CreateTodos(){
    const [newTodo, setNewTodo] = useState("")

    const trpc = api.useContext()
    
    const {mutate} = api.todo.create.useMutation({
        
        onMutate: async (newTodo) => {

            // Cancel any outgoing refreshes so they don't overwrite optimistic update
            await trpc.todo.all.cancel()

            // Snapshot the previous value of the todos
            const previousTodos = trpc.todo.all.getData()

            // Optimistically update to the new value
            trpc.todo.all.setData(undefined, (prev) => {
                const optimisticTodo = {
                    id: "optimistic-todo-id",
                    text: newTodo,
                    done: false,
                }
                if(!prev) return [optimisticTodo]
                
                return [...prev, optimisticTodo]

            })

            setNewTodo("")

            return ({previousTodos})
        },

        onError: (err, newTodo, context) => {
            toast.error("An error occured when creating todo. Please try again.")
            setNewTodo(newTodo)
            trpc.todo.all.setData(undefined, () => context?.previousTodos)

        },

        onSettled: async () => {
            await trpc.todo.all.invalidate()
        }
    })

    return (
      <div>
        <form 
            onSubmit={(e) => {
                e.preventDefault()

                const result = todoInput.safeParse(newTodo)

                if (!result.success) {
                    toast.error(result.error.format()._errors.join("\n"))
                    return
                } 

                mutate(newTodo)

            }}
            className="flex gap-4">
            <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg"
            placeholder="Create a new todo..."
            type="text" name="new-todo" id="new-todo" value={newTodo} 
            onChange={(e) =>{
                setNewTodo(e.target.value)
            }}/>
            <button className="text-white bg-blue-700 p-1 hover:bg-blue-800 rounded focus:ring-4 focus:outline-no">
                Create</button>
        </form>
      </div>
    )
}