import type { TaskProps } from '../../api/routeTask'
import Statuscircle from '../Statuscircle'
import Statusline from '../Statusline'

const StatusElem = ({tasks}:{tasks:TaskProps[]}) => {

    return (
        <main>
            {tasks && (
                <section className=" flex justify-center gap-2">
                    {tasks.map((a, index) => {
                        return (
                            <div className=" flex flex-col gap-2" key={index}>
                                <aside className=" flex items-center gap-2">
                                    <Statuscircle order={a.order} status={a.status} text={a.text} />
                                    <Statusline status={a.status} />
                                </aside>
                                <aside className={`text-sm
                                ${a.status == "completed"
                                        ? "text-blue-800"
                                        : a.status == "current"
                                            ? "text-blue-800"
                                            : "text-neutral-400"}`}>
                                    {a.text}
                                </aside>
                            </div>
                        )
                    })}
                    {tasks[tasks.length - 1].status == "completed" && (
                        <div className={`w-6 h-6 rounded-full border flex justify-center items-center bg-blue-800 text-neutral-100 text-center`}>
                            <i className="bi bi-check2 text-sm leading-0"></i>
                        </div>
                    )}
                </section>
            )}
        </main>
    )
}

export default StatusElem