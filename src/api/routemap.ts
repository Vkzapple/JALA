import type { Data } from "../components/ui/RoutesElem"
import type { HalteProps, PenumpangProps } from "./routeHalte";

import routeData from "../data/v1.json"
import halteData from "../data/halte.json"
import penumpangData from "../data/penumpang.json"

const data: Data[] = routeData as Data[];
const halte:HalteProps[] = halteData as HalteProps[]
const penumpang:PenumpangProps[] = penumpangData as PenumpangProps[]
export const routeHandlerAPI = (b: string) => {
  const dataPassed: Data = data.filter((a) => a.kode == b)[0];

  const jurusanAwal:string = dataPassed.jurusan.split(" - ")[0]
  const jurusanAkhir:string = dataPassed.jurusan.split(" - ")[1]

  const halteAwal = (halte.filter((a)=>a.nama_halte.toLowerCase() == jurusanAwal.toLowerCase()))
  const halteAkhir = (halte.filter((a)=>a.nama_halte.toLowerCase() == jurusanAkhir.toLowerCase()))

  const passengers = penumpang.filter((a)=> a.kode_trayek == b)
  let passengerTotal = 0
  passengers.map((a)=>{
    passengerTotal+=a.jumlah_penumpang
  })
  console.log(passengerTotal)
  const passenger:PenumpangProps = passengers[passengers.length - 1]
  if(passenger){
    passenger.jumlah_penumpang = passengerTotal
    console.log(passenger)
  }
  const objResult = {
    "data_passed":dataPassed,
    "halte_awal":halteAwal[halteAwal.length - 1],
    "halte_akhir":halteAkhir[halteAkhir.length - 1],
    "passenger":passenger
  }
  return objResult;
};

