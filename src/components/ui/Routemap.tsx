import { useState } from "react"
import type { HalteProps, PenumpangProps } from "../../api/routeHalte"
import type { Data } from "./RoutesElem"

interface RouteMapProps {
    data: Data | undefined
    halte_awal: HalteProps | undefined,
    halte_akhir: HalteProps | undefined
    passenger: PenumpangProps | undefined
    func: (order: number) => void

}
const Routemap = ({ data, halte_awal, halte_akhir, passenger, func }: RouteMapProps) => {

    const [isAssign, setAssign] = useState<boolean>(false)

    const handleAssign = () => {
        func(2)
        setAssign(true)
    }

    return (
        <main className=' p-4 flex flex-col gap-4'>
            {data && (
                <section className=" flex flex-col gap-4 justify-between">
                    <section className=' flex flex-col gap-2 justify-between'>
                        <div className=" ">
                            <p className=" font-light text-neutral-400">Kode Rute : </p>
                            <p className=" font-semibold text-blue-800">{data.kode} </p>
                        </div>
                        <div className=" ">
                            <div className=" w-full flex justify-between">
                                <p className=" font-light text-neutral-400">Awal Rute</p>
                                <p className=" font-light text-neutral-400">Akhir Rute</p>
                            </div>
                            <div className=" w-full flex justify-between">
                                <p className=" text-blue-800 font-semibold">{halte_awal ? halte_awal.nama_halte : data.jurusan.split(" - ")[0]}</p>
                                <p>-</p>
                                <p className=" text-blue-800 font-semibold">{halte_akhir ? halte_akhir.nama_halte : data.jurusan.split(" - ")[1]}</p>
                            </div>
                        </div>
                    </section>
                    <section>
                        <div className=" w-[48dvh] h-[32dvh] rounded-2xl shadow border border-neutral-200 flex justify-center items-center">
                            [ceritanya map]
                        </div>
                    </section>
                    <section className=" flex justify-between">
                        <p className=" text-neutral-400">{data.kategori}</p>
                        <p>{passenger ? passenger.jumlah_penumpang : "-"}</p>
                    </section>
                    <section>
                        <button type="button" className=" p-2 px-4 rounded-lg border border-blue-800 shadow text-blue-800 duration-500 transition-all
                        hover:opacity-75 hover:bg-blue-100 active:bg-blue-800 active:text-neutral-100 active:scale-95
                        disabled:bg-blue-800 disabled:text-neutral-100 disabled:cursor-not-allowed"
                            disabled={isAssign}
                            onClick={() => handleAssign()}>
                                {!isAssign ? "Assign Job" : "Assigned"}
                        </button>
                    </section>
                </section>
            )}
            {data == undefined && (
                <section className=" flex flex-col gap-4 justify-between">
                    <section className=' flex flex-col gap-2'>
                        <div className=" flex flex-col">
                            <p className=" font-light text-neutral-400">Nama Rute : </p>
                            <p className=" font-semibold text-blue-800">- </p>
                        </div>
                        <div className=" flex flex-col">
                            <p className=" font-light text-neutral-400">Kode Rute : </p>
                            <p className=" font-semibold text-blue-800">- </p>
                        </div>
                        <div className=" flex flex-col">
                            <p className=" font-light text-neutral-400">Alur Rute : </p>
                            <p className=" font-semibold text-blue-800">- </p>
                        </div>
                    </section>
                    <section>
                        <div className=" w-[48dvh] h-[32dvh] rounded-3xl shadow border border-neutral-200 flex justify-center items-center">
                            [ceritanya map]
                        </div>
                    </section>
                    <section>
                        <button type="button" className=" p-2 px-4 rounded-lg border border-neutral-400 shadow text-neutral-400 cursor-not-allowed">
                            Assign Job
                        </button>
                    </section>
                </section>
            )}
        </main>
    )
}

export default Routemap