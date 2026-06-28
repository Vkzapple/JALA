import { useEffect, useState } from "react"

import RoutesElem, { type Data } from "./RoutesElem"
import type { HalteProps, PenumpangProps } from "../../api/routeHalte"

import Routemap from "./Routemap"
import Routeinfo from "./Routeinfo"
import StatusElem from "./StatusElem"
import AbsensiElem from "./AbsensiElem"
import MulaiPerjalananElem from "./MulaiPerjalananElem"
import { editTask, getTasks, type TaskProps } from "../../api/routeTask"
import axios from "axios"

const MainFeature = () => {

    const [data, setData] = useState<Data>()
    const [halteAwal, setHalteAwal] = useState<HalteProps>()
    const [halteAkhir, setHalteAkhir] = useState<HalteProps>()
    const [passenger, setPassenger] = useState<PenumpangProps>()

    const [tasks, setTasks] = useState<TaskProps[]>()
    const [upBtn, setUpBtn] = useState<number>(0)

    useEffect(() => {
        axios.get("")
            .then(() => {
                setTasks(getTasks())
            })
    }, [upBtn])

    const handleData = (data: Data, a: HalteProps, b: HalteProps, c: PenumpangProps) => {
        setData(data)
        setHalteAwal(a)
        setHalteAkhir(b)
        setPassenger(c)
    }

    const handleUpBtn = (order: number) => {
        setUpBtn(upBtn + 1)
        editTask(order, "completed")
        editTask(order + 1, "current")
    }

    const currentTask = tasks?.find((t) => t.status === "current")

    return (
        <>
            <main className=" flex flex-col gap-8 items-center">
                {tasks && (
                    <StatusElem tasks={tasks} />
                )}
                <section className=" flex gap-4">
                    <aside className=" p-8 rounded-2xl shadow w-fit h-fit">
                        <div className=" mb-4">
                            <p className=' text-blue-800 text-xl font-semibold'>Hello, selamat datang driver</p>
                            <p className=' text-neutral-400 text-sm'>Mari mulai perjalananmu hari ini</p>
                        </div>
                        <div>
                            <RoutesElem func={handleData} func2={handleUpBtn}/>
                            <Routeinfo halte_awal={halteAwal} halte_akhir={halteAkhir}/>

                            {currentTask?.order === 3 && (
                                <AbsensiElem
                                    halteAwal={halteAwal}
                                    onSukses={() => handleUpBtn(3)}
                                />
                            )}
                        </div>
                    </aside>
                    <Routemap data={data} halte_awal={halteAwal} halte_akhir={halteAkhir} passenger={passenger} func={handleUpBtn}/>
                </section>
            </main>

            {currentTask?.order === 4 && (
                <MulaiPerjalananElem
                    halteAwal={halteAwal}
                    halteAkhir={halteAkhir}
                    onSelesai={() => handleUpBtn(4)}
                />
            )}
        </>
    )
}

export default MainFeature