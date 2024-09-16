import { userStateContext } from "../contexts/ContextProvider"

export default function Toast() {
    const { toast} = userStateContext();
    return (
        <>
            {
             toast.show && 
             (<div className = "py-2 px-3 text-white rounded bg-emerald-500 ixed left-2 bottom-2 z-50 animate-fade-in-down ">
                {toast.message}
             </div>
            )}

        </>
    )
}