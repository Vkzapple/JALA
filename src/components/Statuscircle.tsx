interface StatusProps {
    order: number
    status: string
    text: string
}
const Statuscircle = ({ order, status }: StatusProps) => {
    return (
        <div className={`w-6 h-6 rounded-full border flex justify-center items-center 
            ${status == "completed"
                ? "bg-blue-800 text-neutral-100"
                : status == "current"
                    ? "border-blue-800 text-blue-800"
                    : "border-neutral-200 text-neutral-200"}`}>
            <span>{order}</span>
        </div>
    )
}

export default Statuscircle