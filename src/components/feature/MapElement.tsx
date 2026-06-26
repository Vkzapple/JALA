import type { HalteProps } from '@/api/routeHalte'
import { Card } from '../ui/card'
import { Map, MapControls, MapMarker, MapRoute, MarkerContent } from '../ui/map'
import { BusFrontIcon, Clock, Route } from 'lucide-react'
import { Button } from "@/components/ui/button";

import { Badge } from '../ui/badge'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { countZoomValue, fetchRoutes, formatDistance, formatDuration, type RouteData } from '@/api/routemap';
import { useStatusPenumpang, cekAdaPenumpang } from '@/api/routePenumpang';

interface MapProps {
    tujuan: HalteProps
    ruteAwal: HalteProps | undefined
    ruteAkhir: HalteProps | undefined
    zoom: boolean
}

const MapElement = ({ ruteAwal, ruteAkhir, tujuan, zoom }: MapProps) => {

    const [awal, setAwal] = useState<HalteProps>()
    const [akhir, setAkhir] = useState<HalteProps>()
    const [target, setTarget] = useState<HalteProps>()
    const [routes, setRoutes] = useState<RouteData[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const [zoomDigital, setZoomDigital] = useState<number>()
    const cardRef = useRef<HTMLDivElement>(null)

    // Polling status "ada penumpang" dari backend JALA (ESP32 -> server -> sini)
    const statusPenumpang = useStatusPenumpang(3000); // refresh tiap 3 detik

    useEffect(() => {
        axios.get("/")
            .then(() => {
                if (ruteAwal) {
                    setAwal(ruteAwal)
                } else if (ruteAkhir) {
                    setAkhir(ruteAkhir)
                }
                setTarget(tujuan)
                if (!zoom && ruteAwal && ruteAkhir) {

                    fetchRoutes(ruteAwal, ruteAkhir)
                        .then(data => {
                            if (data) {
                                setRoutes(data)
                            }
                        })
                    const selisihY = Math.abs(ruteAwal.koordinat_y - ruteAkhir.koordinat_y)
                    const selisihX = Math.abs(ruteAwal.koordinat_x - ruteAkhir.koordinat_x)
                    const centerTarget = {
                        ...tujuan,
                        koordinat_y: (Number(ruteAwal.koordinat_y) + Number(ruteAkhir.koordinat_y)) / 2,
                        koordinat_x: (Number(ruteAwal.koordinat_x) + Number(ruteAkhir.koordinat_x)) / 2
                    }
                    if (cardRef.current) {
                        const digiZoom = countZoomValue(selisihX, selisihY, cardRef.current.clientHeight)
                        if (digiZoom) {
                            setZoomDigital(digiZoom)
                        }
                        setTarget(centerTarget)
                    }
                }
            })
    }, [ruteAwal, ruteAkhir, tujuan, zoom])

    const sortedRoutes = routes
        .map((route, index) => ({ route, index }))
        .sort((a, b) => {
            if (a.index === selectedIndex) return 1;
            if (b.index === selectedIndex) return -1;
            return 0;
        });

    const mapStyle = {
        light: "https://tiles.openfreemap.org/styles/bright",
        dark: "https://tiles.openfreemap.org/styles/bright"
    }

    // Cek status ada penumpang untuk masing-masing halte awal/akhir
    const adaPenumpangAwal = cekAdaPenumpang(statusPenumpang, awal?.nama_halte);
    const adaPenumpangAkhir = cekAdaPenumpang(statusPenumpang, akhir?.nama_halte);

    return (
        <Card className="w-full h-full p-0 overflow-hidden" ref={cardRef}>
            {target && (

                <Map key={`${target.koordinat_y}-${target.koordinat_x}-${zoom ? "full" : "crop"}`}
                    center={[Number(target.koordinat_y), Number(target.koordinat_x)]} zoom={zoomDigital ? zoomDigital : zoom ? 16 : 10} styles={mapStyle}>
                    <MapControls
                        showZoom
                        showCompass
                        showLocate
                        position='top-right' />
                    {awal && akhir && sortedRoutes.map(({ route, index }) => {
                        const isSelected = index === selectedIndex;
                        return (
                            <MapRoute
                                key={index}
                                coordinates={route.coordinates}
                                color={isSelected ? "#6366f1" : "#94a3b8"}
                                width={isSelected ? 6 : 5}
                                opacity={isSelected ? 1 : 0.6}
                                onClick={() => setSelectedIndex(index)}
                            />
                        );
                    })}
                    {akhir && (
                        <MapMarker
                            longitude={akhir.koordinat_y}
                            latitude={akhir.koordinat_x}>
                            <MarkerContent>
                                <div className="relative">
                                    {adaPenumpangAkhir && (
                                        <span className="absolute -top-1 -right-1 flex h-3 w-3 z-10">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                                        </span>
                                    )}
                                    <Badge className={`bg-green-600 ${adaPenumpangAkhir ? "ring-2 ring-orange-400 ring-offset-1" : ""}`}>
                                        <BusFrontIcon className='h-36 w-36 text-neutral-100' />
                                        <div className=" text-neutral-100">
                                            {akhir.nama_halte}
                                            {adaPenumpangAkhir && (
                                                <span className="block text-[10px] font-semibold text-orange-200">
                                                    Ada Penumpang
                                                </span>
                                            )}
                                        </div>
                                    </Badge>
                                </div>
                            </MarkerContent>
                        </MapMarker>
                    )}
                    {awal && (
                        <MapMarker
                            longitude={awal.koordinat_y}
                            latitude={awal.koordinat_x}>
                            <MarkerContent>
                                <div className="relative">
                                    {adaPenumpangAwal && (
                                        <span className="absolute -top-1 -right-1 flex h-3 w-3 z-10">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                                        </span>
                                    )}
                                    <Badge className={`bg-red-600 ${adaPenumpangAwal ? "ring-2 ring-orange-400 ring-offset-1" : ""}`}>
                                        <BusFrontIcon className='h-36 w-36 text-neutral-100' />
                                        <div className=" text-neutral-100">
                                            {awal.nama_halte}
                                            {adaPenumpangAwal && (
                                                <span className="block text-[10px] font-semibold text-orange-200">
                                                    Ada Penumpang
                                                </span>
                                            )}
                                        </div>
                                    </Badge>
                                </div>
                            </MarkerContent>
                        </MapMarker>
                    )}
                    {routes.length > 0 && awal && akhir && (
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {routes.map((route, index) => {
                                const isActive = index === selectedIndex;
                                const isFastest = index === 0;
                                return (
                                    <Button
                                        key={index}
                                        size="sm"
                                        onClick={() => setSelectedIndex(index)}
                                        className={`justify-start p-2 py-5 rounded-full bg-neutral-100/48 backdrop-blur-xl text-neutral-800
                                        ${isActive
                                                ? " bg-neutral-100/64 backdrop-blur-2xl text-blue-800 border border-white shadow"
                                                : " bg-neutral-100/24 backdrop-blur-2xl opacity-80! "}
                                            hover:bg-neutral-100 hover:scale-95 active:scale-90    
                                            }`}
                                    >
                                        <div className="flex items-center gap-1">
                                            <Clock className="size-3" />
                                            <span className="font-medium">
                                                {formatDuration(route.duration)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-12 text-xs opacity-80">
                                            <Route className="size-3" />
                                            {formatDistance(route.distance)}
                                        </div>
                                        {isFastest && (
                                            <div className="text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 w-6 h-6 flex justify-center items-center
                                            text-center rounded-full">
                                                <i className="bi bi-lightning-charge leading-0"></i>
                                            </div>
                                        )}
                                    </Button>
                                );
                            })}
                        </div>
                    )}
                </Map>
            )}
        </Card>
    )
}

export default MapElement