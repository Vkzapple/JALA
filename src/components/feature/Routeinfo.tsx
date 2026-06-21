import type { HalteProps } from "../../api/routeHalte"

interface RouteInfoProps {
    halte_awal: HalteProps | undefined,
    halte_akhir: HalteProps | undefined
}

const Routeinfo = ({ halte_awal, halte_akhir }: RouteInfoProps) => {
    return (
        <main className=" mt-4 p-2">
            <p className=" text-neutral-800 font-semibold mb-4">Informasi Rute</p>
            <section className=" flex flex-col gap-2">
                <div className=" flex flex-col gap-2">
                    <div className=" w-full flex justify-between gap-4">
                        <p className=" font-light text-neutral-400">Awal Rute</p>
                        <p className=" font-light text-neutral-400">Akhir Rute</p>
                    </div>
                    <div className=" w-full flex justify-between gap-4">
                        <p>{halte_awal ? halte_awal.nama_halte : "-"}</p>
                        <p>{halte_akhir ? halte_akhir.nama_halte : "-"}</p>
                    </div>
                </div>
                <div className=" flex flex-col gap-2">
                    <div className=" w-full flex justify-between gap-4">
                        <p className=" font-light text-neutral-400">Lokasi</p>
                        <p className=" font-light text-neutral-400"></p>
                    </div>
                    <div className=" w-full flex justify-between gap-4">
                        <p>{halte_awal ? halte_awal.lokasi : "-"}</p>
                        <p>{halte_akhir ? halte_akhir.lokasi : "-"}</p>
                    </div>
                </div>
                <div className=" flex flex-col gap-2">
                    <div className=" w-full flex justify-between gap-4">
                        <p className=" font-light text-neutral-400">Kecamatan</p>
                        <p className=" font-light text-neutral-400"></p>
                    </div>
                    <div className=" w-full flex justify-between gap-4">
                        <p>{halte_awal ? halte_awal.kecamatan : "-"}</p>
                        <p>{halte_akhir ? halte_akhir.kecamatan : "-"}</p>
                    </div>
                </div>
                <div className=" flex flex-col gap-2">
                    <div className=" w-full flex justify-between gap-4">
                        <p className=" font-light text-neutral-400">Kelurahan</p>
                        <p className=" font-light text-neutral-400"></p>
                    </div>
                    <div className=" w-full flex justify-between gap-4">
                        <p>{halte_awal ? halte_awal.kelurahan : "-"}</p>
                        <p>{halte_akhir ? halte_akhir.kelurahan : "-"}</p>
                    </div>
                </div>
                <div className=" flex flex-col gap-2">
                    <div className=" w-full flex justify-between gap-4">
                        <p className=" font-light text-neutral-400">Wilayah</p>
                        <p className=" font-light text-neutral-400"></p>
                    </div>
                    <div className=" w-full flex justify-between gap-4">
                        <p>{halte_awal ? halte_awal.wilayah : "-".replace("KOTA ADM.", "")}</p>
                        <p>{halte_akhir ? halte_akhir.wilayah.replace("KOTA ADM.", "") : "-"}</p>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Routeinfo