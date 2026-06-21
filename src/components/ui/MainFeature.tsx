import { useState } from "react"
import Routemap from "./Routemap"
import RoutesElem, { type Data } from "./RoutesElem"
import type { HalteProps, PenumpangProps } from "../../api/routeHalte"
import Routeinfo from "./Routeinfo"

const MainFeature = () => {
    const [data,setData] = useState<Data>()
    const [halteAwal,setHalteAwal] = useState<HalteProps>()
    const [halteAkhir,setHalteAkhir] = useState<HalteProps>()
    const [passenger, setPassenger] = useState<PenumpangProps>()
    const handleData = (data:Data, a:HalteProps, b:HalteProps, c:PenumpangProps) => {
        setData(data)
        console.log(a,b)
        setHalteAwal(a)
        setHalteAkhir(b)
        setPassenger(c)
    }
    return (
        <>
            <main className=" p-8 rounded-2xl shadow w-fit h-fit">
                <section className=" mb-4">
                    <p className=' text-blue-800 text-xl'>Hello, selamat datang driver</p>
                    <p className=' text-neutral-400 text-sm'>Mari mulai perjalananmu hari ini</p>
                </section>
                <section>
                    <RoutesElem func={handleData} />
                    <Routeinfo halte_awal={halteAwal} halte_akhir={halteAkhir}/>
                </section>
            </main>
            <Routemap data={data} halte_awal={halteAwal} halte_akhir={halteAkhir} passenger={passenger}/>
        </>
    )
}

export default MainFeature