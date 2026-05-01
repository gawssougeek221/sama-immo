'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Play,
  X,
  RotateCcw,
  Move,
  ZoomIn,
  Layers,
  MapPin,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// ─── DATA ──────────────────────────────────────────────────
interface TourRoom {
  id: string
  name: string
  image: string
  hotspots: {
    x: number
    y: number
    label: string
    targetRoom?: string
  }[]
}

interface TourProperty {
  id: number
  title: string
  category: string
  location: string
  rooms: TourRoom[]
}

const TOUR_PROPERTIES: TourProperty[] = [
  {
    id: 1,
    title: "Villa Luxe Almadies",
    category: "Villa",
    location: "Almadies, Dakar",
    rooms: [
      {
        id: 'salon',
        name: 'Grand Salon',
        image: '/villa-ngor.jpg',
        hotspots: [
          { x: 75, y: 45, label: 'Terrasse', targetRoom: 'terrasse' },
          { x: 25, y: 50, label: 'Cuisine', targetRoom: 'cuisine' },
          { x: 50, y: 85, label: 'Suite Master', targetRoom: 'suite' },
        ],
      },
      {
        id: 'terrasse',
        name: 'Terrasse & Piscine',
        image: '/villa-almadies.jpg',
        hotspots: [
          { x: 30, y: 40, label: 'Grand Salon', targetRoom: 'salon' },
          { x: 70, y: 60, label: 'Jardin', targetRoom: 'jardin' },
        ],
      },
      {
        id: 'cuisine',
        name: 'Cuisine Premium',
        image: '/appartement-plateau.jpg',
        hotspots: [
          { x: 60, y: 50, label: 'Grand Salon', targetRoom: 'salon' },
          { x: 20, y: 70, label: 'Salle à manger', targetRoom: 'salle-manger' },
        ],
      },
      {
        id: 'suite',
        name: 'Suite Master',
        image: '/penthouse-plateau.jpg',
        hotspots: [
          { x: 40, y: 50, label: 'Salle de bain', targetRoom: 'sdb' },
          { x: 70, y: 80, label: 'Grand Salon', targetRoom: 'salon' },
        ],
      },
      {
        id: 'sdb',
        name: 'Salle de Bain',
        image: '/residence-mermoz.jpg',
        hotspots: [
          { x: 50, y: 70, label: 'Suite Master', targetRoom: 'suite' },
        ],
      },
      {
        id: 'jardin',
        name: 'Jardin Paysager',
        image: '/villa-ngor.jpg',
        hotspots: [
          { x: 40, y: 30, label: 'Terrasse & Piscine', targetRoom: 'terrasse' },
        ],
      },
      {
        id: 'salle-manger',
        name: 'Salle à Manger',
        image: '/appartement-plateau.jpg',
        hotspots: [
          { x: 50, y: 50, label: 'Cuisine Premium', targetRoom: 'cuisine' },
        ],
      },
    ],
  },
]

export function VirtualTourSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const panoramaRef = useRef<HTMLDivElement>(null)
  const [selectedProperty, setSelectedProperty] = useState(TOUR_PROPERTIES[0])
  const [currentRoom, setCurrentRoom] = useState<TourRoom>(TOUR_PROPERTIES[0].rooms[0])
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [isPanning, setIsPanning] = useState(false)
  const [showHelp, setShowHelp] = useState(true)

  // GSAP scroll animations
  useGSAP(
    () => {
      gsap.from('.tour-label', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
      })
      gsap.from('.tour-title-line', {
        y: 100,
        rotationX: -40,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
      })
      gsap.from('.tour-desc', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 55%' },
      })
      gsap.from('.tour-gold-line', {
        scaleX: 0,
        duration: 1.5,
        ease: 'power4.inOut',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 55%' },
      })
      gsap.from('.tour-viewer-container', {
        y: 80,
        opacity: 0,
        scale: 0.95,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 45%' },
      })
    },
    { scope: sectionRef }
  )

  // Mouse move for panoramic effect
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!panoramaRef.current) return
    const rect = panoramaRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMousePos({ x, y })
  }, [])

  // Navigate to room
  const navigateToRoom = (roomId: string) => {
    const room = selectedProperty.rooms.find((r) => r.id === roomId)
    if (room) {
      setCurrentRoom(room)
    }
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Hide help after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowHelp(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  // Panoramic transform values
  const panX = (mousePos.x - 0.5) * -30
  const panY = (mousePos.y - 0.5) * -15
  const scale = isPanning ? 1.3 : 1.15

  // Current room index for navigation
  const currentRoomIndex = selectedProperty.rooms.findIndex((r) => r.id === currentRoom.id)

  const goToNextRoom = () => {
    const nextIndex = (currentRoomIndex + 1) % selectedProperty.rooms.length
    setCurrentRoom(selectedProperty.rooms[nextIndex])
  }

  const goToPrevRoom = () => {
    const prevIndex = (currentRoomIndex - 1 + selectedProperty.rooms.length) % selectedProperty.rooms.length
    setCurrentRoom(selectedProperty.rooms[prevIndex])
  }

  return (
    <section
      ref={sectionRef}
      id="visite-virtuelle"
      className="bg-noir-light relative overflow-hidden py-28 lg:py-44"
    >
      {/* Giant background watermark */}
      <div className="absolute top-[5%] -left-10 font-serif text-[20rem] lg:text-[35rem] font-bold text-cream/[0.015] leading-none select-none pointer-events-none whitespace-nowrap">
        360°
      </div>

      {/* Decorative vertical lines */}
      <div className="absolute top-0 left-[20%] w-px h-full bg-gradient-to-b from-transparent via-gold/8 to-transparent hidden lg:block" />
      <div className="absolute top-0 right-[30%] w-px h-full bg-gradient-to-b from-transparent via-gold/5 to-transparent hidden lg:block" />

      {/* Floating decorative elements */}
      <div className="absolute top-[15%] right-[6%] w-32 h-32 border border-gold/8 rotate-45 hidden lg:block" />
      <div className="absolute bottom-[20%] left-[4%] w-20 h-20 border border-cream/[0.03] rounded-full hidden lg:block" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="mb-16 lg:mb-24">
          <span className="tour-label block font-sans text-[10px] tracking-[0.5em] uppercase text-gold mb-6">
            Immersion
          </span>
          <h2 className="tour-title-line font-serif text-5xl sm:text-7xl lg:text-8xl font-bold text-cream leading-[0.9]">
            Visite
          </h2>
          <h2 className="tour-title-line font-serif text-5xl sm:text-7xl lg:text-8xl font-bold text-gold italic leading-[0.9]">
            Virtuelle
          </h2>
          <p className="tour-desc font-sans text-sm lg:text-base text-warm-gray/50 max-w-lg mt-6 leading-relaxed">
            Explorez nos propriétés d&apos;exception comme si vous y étiez. Déplacez-vous de pièce en pièce et découvrez chaque détail en immersive 360°.
          </p>
          <div className="tour-gold-line w-24 h-px bg-gold mt-8 origin-left" />
        </div>

        {/* Tour viewer */}
        <div className="tour-viewer-container relative">
          {/* Main panoramic viewer */}
          <div
            className={`relative overflow-hidden bg-noir border border-noir-mid/50 group ${
              isFullscreen
                ? 'fixed inset-0 z-[9998] border-none'
                : 'aspect-[16/9] lg:aspect-[21/9]'
            }`}
          >
            {/* Panoramic image with mouse-driven parallax */}
            <div
              ref={panoramaRef}
              className="absolute inset-0 overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseDown={() => setIsPanning(true)}
              onMouseUp={() => setIsPanning(false)}
              onMouseLeave={() => setIsPanning(false)}
              style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentRoom.id}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{
                    opacity: 1,
                    scale,
                    x: panX,
                    y: panY,
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    opacity: { duration: 0.5 },
                    scale: { duration: 0.3 },
                    x: { duration: 0.15, ease: 'linear' },
                    y: { duration: 0.15, ease: 'linear' },
                  }}
                  className="absolute inset-[-15%]"
                >
                  <img
                    src={currentRoom.image}
                    alt={currentRoom.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Dark vignette overlay */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: 'radial-gradient(ellipse at center, transparent 50%, rgba(12,10,9,0.6) 100%)',
              }} />

              {/* Top gradient */}
              <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-noir/50 to-transparent pointer-events-none z-10" />
              {/* Bottom gradient */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-noir/80 to-transparent pointer-events-none z-10" />
            </div>

            {/* Hotspots */}
            <AnimatePresence>
              {currentRoom.hotspots.map((hotspot, i) => (
                <motion.div
                  key={`${currentRoom.id}-${i}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 300 }}
                  className="absolute z-20"
                  style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                >
                  <button
                    onClick={() => hotspot.targetRoom && navigateToRoom(hotspot.targetRoom)}
                    className="group/hotspot relative flex items-center justify-center"
                  >
                    {/* Pulse ring */}
                    <span className="absolute w-10 h-10 rounded-full bg-gold/20 animate-ping" />
                    {/* Hotspot dot */}
                    <span className="relative w-4 h-4 rounded-full bg-gold/80 border-2 border-cream/60 flex items-center justify-center hover:bg-gold transition-colors duration-300 hover:scale-125 transform">
                      <span className="w-1.5 h-1.5 bg-cream rounded-full" />
                    </span>
                    {/* Label */}
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-noir/80 backdrop-blur-sm border border-gold/20 whitespace-nowrap opacity-0 group-hover/hotspot:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-gold">
                        {hotspot.label}
                      </span>
                      {hotspot.targetRoom && (
                        <span className="ml-2 text-cream/40">
                          <ChevronRight size={10} className="inline" />
                        </span>
                      )}
                    </span>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Top left — Room name */}
            <div className="absolute top-6 left-6 z-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentRoom.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center bg-noir/50 backdrop-blur-sm">
                    <Eye size={14} className="text-gold" />
                  </div>
                  <div>
                    <span className="font-sans text-[8px] tracking-[0.4em] uppercase text-gold/60 block">
                      {selectedProperty.title}
                    </span>
                    <span className="font-serif text-lg font-bold text-cream">
                      {currentRoom.name}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Top right — Controls */}
            <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
              <button
                onClick={() => setIsPanning(!isPanning)}
                className={`w-9 h-9 rounded-full border flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
                  isPanning
                    ? 'border-gold bg-gold/20 text-gold'
                    : 'border-cream/20 bg-noir/50 text-cream/60 hover:border-gold/50 hover:text-gold'
                }`}
                title="Zoom"
              >
                <ZoomIn size={14} />
              </button>
              <button
                onClick={toggleFullscreen}
                className="w-9 h-9 rounded-full border border-cream/20 bg-noir/50 backdrop-blur-sm flex items-center justify-center text-cream/60 hover:border-gold/50 hover:text-gold transition-all duration-300"
                title="Plein écran"
              >
                {isFullscreen ? <X size={14} /> : <Maximize2 size={14} />}
              </button>
            </div>

            {/* Bottom — Room navigation arrows + counter */}
            <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={goToPrevRoom}
                  className="w-10 h-10 rounded-full border border-cream/20 bg-noir/50 backdrop-blur-sm flex items-center justify-center text-cream/60 hover:border-gold/50 hover:text-gold transition-all duration-300"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={goToNextRoom}
                  className="w-10 h-10 rounded-full border border-cream/20 bg-noir/50 backdrop-blur-sm flex items-center justify-center text-cream/60 hover:border-gold/50 hover:text-gold transition-all duration-300"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Room counter */}
              <div className="flex items-center gap-2 px-4 py-2 bg-noir/50 backdrop-blur-sm border border-cream/10 rounded-full">
                <span className="font-serif text-sm font-bold text-gold">
                  {String(currentRoomIndex + 1).padStart(2, '0')}
                </span>
                <span className="w-4 h-px bg-cream/20" />
                <span className="font-sans text-[10px] tracking-[0.2em] text-cream/40">
                  {String(selectedProperty.rooms.length).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Help overlay */}
            <AnimatePresence>
              {showHelp && !isFullscreen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
                >
                  <div className="flex items-center gap-4 px-6 py-4 bg-noir/70 backdrop-blur-md border border-gold/20 rounded-lg">
                    <Move size={18} className="text-gold/60" />
                    <span className="font-sans text-sm text-cream/70">
                      Déplacez la souris pour explorer
                    </span>
                    <span className="w-px h-4 bg-cream/20" />
                    <span className="font-sans text-sm text-cream/70">
                      Cliquez sur les points pour naviguer
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 360° badge */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
              <div className="flex items-center gap-2 px-4 py-2 bg-gold/10 backdrop-blur-sm border border-gold/30 rounded-full">
                <RotateCcw size={12} className="text-gold" />
                <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-gold font-semibold">
                  360°
                </span>
              </div>
            </div>
          </div>

          {/* Room thumbnails bar */}
          <div className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {selectedProperty.rooms.map((room, i) => (
              <button
                key={room.id}
                onClick={() => setCurrentRoom(room)}
                className={`relative flex-shrink-0 w-28 h-20 overflow-hidden border transition-all duration-500 group/thumb ${
                  currentRoom.id === room.id
                    ? 'border-gold/60 ring-1 ring-gold/30'
                    : 'border-noir-mid/50 opacity-50 hover:opacity-80 hover:border-cream/20'
                }`}
              >
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-700"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-noir/40 group-hover/thumb:bg-noir/20 transition-colors duration-300" />
                <div className="absolute bottom-0 inset-x-0 p-1.5">
                  <span className="font-sans text-[8px] tracking-[0.15em] uppercase text-cream/80 block truncate">
                    {room.name}
                  </span>
                </div>
                {currentRoom.id === room.id && (
                  <div className="absolute top-1 right-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Bottom info bar */}
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-gold/50" />
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-warm-gray/40">
                  {selectedProperty.rooms.length} pièces
                </span>
              </div>
              <div className="w-px h-4 bg-noir-mid" />
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-gold/50" />
                <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-warm-gray/40">
                  {selectedProperty.location}
                </span>
              </div>
            </div>
            <a
              href="#contact"
              className="magnetic group inline-flex items-center gap-3 px-8 py-3 bg-gold text-noir font-sans font-semibold text-[10px] tracking-[0.3em] uppercase hover:bg-gold-light transition-all duration-300"
            >
              <Play size={12} className="group-hover:translate-x-0.5 transition-transform" />
              Planifier une visite
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
