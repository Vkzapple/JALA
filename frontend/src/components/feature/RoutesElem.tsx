import React, { useRef, useState } from 'react';
import routeData from '../../data/v1.json'
import { routeHandlerAPI } from '../../api/routemap';
import type { HalteProps, PenumpangProps } from '../../api/routeHalte';

interface RouteElemProp {
    func: (a: Data, b: HalteProps, c: HalteProps, d: PenumpangProps) => void
    func2: (order: number) => void
}
export interface Data {
    periode_data: string;
    kategori: string;
    kode: string;
    jurusan: string;
}

const RoutesElem = ({ func, func2 }: RouteElemProp) => {
    const [category, setCategory] = useState<string>("")

    const ruteRef = useRef<HTMLSelectElement>(null)

    const categories: string[] = ["ANGKUTAN UMUM INTEGRASI", "MIKROTRANS", "ANGKUTAN PENGUMPAN"]
    const data: Data[] = routeData as Data[]

    const handleCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(e.target.value)
        if (ruteRef.current) {
            ruteRef.current.value = ""
        }
    }
    const handleRoute = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const result = routeHandlerAPI(e.target.value)
        func(result.data_passed, result.halte_awal, result.halte_akhir, result.passenger)
        func2(1)
    }
    return (
        <main className=' flex gap-4'>
            <section>
                <select name="" id="" className=' p-2 px-4 rounded-xl outline-none border border-neutral-400'
                    onChange={(e) => handleCategory(e)}>
                    <option value="default" hidden>Pilih kategori</option>
                    {categories.map((a, index) => {
                        return (
                            <option value={a} key={index}>{a}</option>
                        )
                    })}
                </select>
            </section>
            <section>
                <select name="" id="" className=' p-2 px-4 rounded-xl outline-none border border-neutral-400
                disabled:opacity-50 disabled:cursor-not-allowed'
                    disabled={category == "" ? true : false} ref={ruteRef}
                    onChange={(e) => handleRoute(e)}>
                    <option value="default" hidden>Pilih rute</option>
                    {data
                        .filter((a) => a.kategori == category)
                        .map((a, index) => {
                            return (
                                <option value={a.kode} key={index}>{a.kode.toUpperCase()}</option>
                            )
                        })}
                </select>
            </section>
        </main>
    )
}

export default RoutesElem