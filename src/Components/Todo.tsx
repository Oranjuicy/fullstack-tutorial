import type { Todo } from "~/types";
import { api } from "~/utils/api";


type TodoProps = {
    todo: Todo
}

export default function Todo({ todo }: TodoProps) {
    const {id, text, done} = todo

    const trpc = api.useContext()

    const {mutate: doneMutation} = api.todo.toggle.useMutation({
        onSettled: async () => {
            await trpc.todo.all.invalidate()
        }
    })

    const {mutate: deleteMutation} = api.todo.delete.useMutation({
        onSettled: async () => {
            await trpc.todo.all.invalidate()
        }
    })


    return (
        <>
        <div className="flex gap-2 items-center justify-between">
            <div className="flex gap-2 items-center">
                <input className="cursor-pointer w-4 h-4 border border-gray-300 rounded bg-gray-50" 
                type="checkbox" name="done" id="done" checked={done} 
                onChange={(e) => {
                    doneMutation({id, done: e.target.checked})
                }}/>
                <label htmlFor="done" className={'cursor-pointer'}>
                    {text}
                </label>
            </div>
            <button className="text-white bg-blue-700 p-1 hover:bg-blue-800 rounded focus:ring-4 focus:outline-no"
             onClick={() => {
                deleteMutation(id)
            }}>
                Delete</button>
        </div>
        </>
    )
};