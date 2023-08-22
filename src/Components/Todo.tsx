import type { Todo } from "~/types";


type TodoProps = {
    todo: Todo
}

export default function Todo({ todo }: TodoProps) {
    const {id, text, done} = todo


    return (
        <>
        <div className="flex gap-2 items-center justify-between">
            <div className="flex gap-2 items-center">
                <input className="cursor-pointer w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:" 
                type="checkbox" name="done" id="done" checked={done} />
                <label htmlFor="done" className={'cursor-pointer'}>
                    {text}
                </label>
            </div>
            <button className="text-white bg-blue-700 p-1 hover:bg-blue-800 rounded focus:ring-4 focus:outline-no">
                Delete</button>
        </div>
        </>
    )
};