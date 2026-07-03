interface StatusProps {
    status: string
}
const Statusline = ({ status }: StatusProps) => {
    return (
        <div className={`h-2 w-[12dvh] border rounded-full
        ${status == "completed"
                ? "bg-blue-800 border-blue-800"
                : "border-neutral-200"}`}></div>
    )
}

export default Statusline