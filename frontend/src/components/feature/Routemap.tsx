import { useEffect, useState } from "react"
import type { HalteProps, PenumpangProps } from "../../api/routeHalte"
import type { Data } from "./RoutesElem"
import MapElement from "./MapElement"
import { Card } from "../ui/card"
import { Map, MapControls } from "../ui/map"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import axios from "axios"

interface RouteMapProps {
    data: Data | undefined
    halte_awal: HalteProps | undefined,
    halte_akhir: HalteProps | undefined
    passenger: PenumpangProps | undefined
    func: (order: number) => void

}
const Routemap = ({ data, halte_awal, halte_akhir, func }: RouteMapProps) => {

    const [isAssign, setAssign] = useState<boolean>(false)
    const [halte, setHalte] = useState<HalteProps | undefined>(halte_awal ? halte_awal : halte_akhir)
    const [zoom, setZoom] = useState<boolean>(false)


    useEffect(() => {
        axios.get("")
            .then(() => {
                if (halte_awal) {
                    setHalte(halte_awal)
                } else if (halte_akhir) {
                    setHalte(halte_akhir)
                }
            })
    }, [halte_awal, halte_akhir])

    const handleAssign = () => {
        func(2)
        setAssign(true)
    }

    const mapStyle = {
        light: "https://tiles.openfreemap.org/styles/liberty",
        dark: "https://tiles.openfreemap.org/styles/liberty"
    }

    const handleValueChange = (value: string) => {
        if (value == "semua") {
            console.log("harusnya mengubah zoom")
            setZoom(false)
        } else if (value == "awal") {
            setHalte(halte_awal)
            setZoom(true)
        } else if (value == "akhir") {
            setHalte(halte_akhir)
            setZoom(true)
        }
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
                        <div className=" w-[54dvh] h-[40dvh] rounded-2xl shadow border border-neutral-200 flex justify-center items-center">
                            {halte && (
                                <MapElement tujuan={halte} ruteAwal={halte_awal ? halte_awal : undefined} ruteAkhir={halte_akhir ? halte_akhir : undefined} zoom={zoom} />
                            )}
                            {!halte_awal && !halte_akhir && !halte && (
                                "Map Tidak tersedia"
                            )}
                        </div>

                        <div className=" pt-2 flex justify-between items-center">
                            <Tabs defaultValue="semua" className=" p-1 py-2 bg-neutral-100 rounded-3xl w-fit" onValueChange={handleValueChange}>
                                <TabsList variant={"default"} className=" gap-2">
                                    <TabsTrigger value="semua"
                                        className=" p-2 py-4 border focus:backdrop-blur-2xl rounded-full text-blue-800! focus:text-blue-800 focus:font-semibold not-focus:text-neutral-600!">
                                        Semua
                                    </TabsTrigger>
                                    <TabsTrigger value="awal" disabled={halte_awal ? false : true}
                                        className=" p-2 py-4 border focus:backdrop-blur-2xl rounded-full focus:text-blue-800 focus:font-semibold not-focus:text-neutral-600">
                                        Keberangkatan
                                    </TabsTrigger>
                                    <TabsTrigger value="akhir" disabled={halte_akhir ? false : true} aria-disabled={halte_akhir ? false : true}
                                        className=" p-2 py-4 border focus:backdrop-blur-2xl rounded-full focus:text-blue-800 focus:font-semibold not-focus:text-neutral-600
                                        disabled:cursor-not-allowed">
                                        Tujuan
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>

                            <button type="button" className=" p-2 px-4 rounded-full border border-blue-800 shadow text-blue-800 duration-500 transition-all
                        hover:opacity-75 hover:scale-95 active:bg-blue-800 active:text-neutral-100 active:scale-90
                        disabled:bg-blue-800 disabled:text-neutral-100 disabled:cursor-not-allowed disabled:hover:scale-100"
                                disabled={isAssign}
                                onClick={() => handleAssign()}>
                                {!isAssign ? "Assign Job" : "Assigned"}
                            </button>
                        </div>
                    </section>
                    {/* <section className=" flex justify-between">
                        <p className=" text-neutral-400">{data.kategori}</p>
                        <p>{passenger ? passenger.jumlah_penumpang : "-"}</p>
                    </section> */}
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
                        <div className=" w-[54dvh] h-[40dvh] rounded-3xl shadow border border-neutral-200 flex justify-center items-center">
                            <Card className="w-full h-full p-0 overflow-hidden">
                                <Map center={[Number(106.841083), Number(-6.1665326)]} zoom={17} styles={mapStyle}>
                                    <MapControls />
                                </Map>
                            </Card>
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