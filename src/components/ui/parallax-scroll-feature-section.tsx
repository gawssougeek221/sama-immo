'use client'

import { useRef } from "react"
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, MapPin, Bed, Bath, Maximize } from "lucide-react"

interface PropertySection {
  id: number
  title: string
  category: string
  description: string
  imageUrl: string
  price: string
  currency: string
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  reverse: boolean
}

const PROPERTY_SECTIONS: PropertySection[] = [
  {
    id: 1,
    title: "Villa Luxe\nAlmadies",
    category: "Villa",
    description: "Vue océan imprenable depuis cette villa d'exception aux Almadies. Piscine chauffée à débordement, jardin paysager de 800m², finitions en marbre italien et bois exotique. Un havre de paix où le luxe se conjugue avec l'art de vivre sénégalais.",
    imageUrl: "/villa-ngor.jpg",
    price: "850 000 000",
    currency: "CFA",
    location: "Almadies, Dakar",
    bedrooms: 5,
    bathrooms: 4,
    area: 520,
    reverse: false,
  },
  {
    id: 2,
    title: "Penthouse\nPlateau",
    category: "Penthouse",
    description: "Au sommet du Plateau, ce penthouse offre une vue panoramique à 180° sur l'Atlantique. Terrasse rooftop privée de 120m², intérieur marbre et bois précieux, domotique intégrée. L'adresse la plus prestigieuse de Dakar.",
    imageUrl: "/penthouse-plateau.jpg",
    price: "650 000 000",
    currency: "CFA",
    location: "Plateau, Dakar",
    bedrooms: 3,
    bathrooms: 2,
    area: 350,
    reverse: true,
  },
  {
    id: 3,
    title: "Résidence\nMermoz",
    category: "Appartement",
    description: "Dans le quartier résidentiel par excellence, cette résidence offre un raffinement discret. Cuisine entièrement équipée par un chef étoilé, parking souterrain sécurisé, conciergerie 24h/24. L'élégance au quotidien.",
    imageUrl: "/residence-mermoz.jpg",
    price: "520 000 000",
    currency: "CFA",
    location: "Mermoz, Dakar",
    bedrooms: 3,
    bathrooms: 2,
    area: 300,
    reverse: false,
  },
  {
    id: 4,
    title: "Villa Prestige\nAlmadies",
    category: "Villa",
    description: "Piscine à débordement face à l'océan, domotique intégrée de dernière génération, suite parentale avec dressing de 30m². Cette villa incarne l'excellence immobilière dakaroise, entre tradition et modernité absolue.",
    imageUrl: "/villa-almadies.jpg",
    price: "980 000 000",
    currency: "CFA",
    location: "Almadies, Dakar",
    bedrooms: 6,
    bathrooms: 5,
    area: 680,
    reverse: true,
  },
  {
    id: 5,
    title: "Appartement\nPlateau",
    category: "Appartement",
    description: "Lumineux et climatisé, cet appartement au coeur du Plateau est idéal pour l'investissement comme pour la résidence principale. Vue dégagée sur la ville, finitions haut de gamme, accès direct aux commerces et restaurants.",
    imageUrl: "/appartement-plateau.jpg",
    price: "380 000 000",
    currency: "CFA",
    location: "Plateau, Dakar",
    bedrooms: 2,
    bathrooms: 1,
    area: 180,
    reverse: false,
  },
]

export const Component = () => {
  // Create refs and animations for each section
  const sectionRefs = PROPERTY_SECTIONS.map(() => useRef<HTMLDivElement>(null))

  const scrollYProgresses = PROPERTY_SECTIONS.map((_, index) => {
    return useScroll({
      target: sectionRefs[index],
      offset: ["start end", "center start"],
    }).scrollYProgress
  })

  // Create animations for each section
  const opacityContents = scrollYProgresses.map((progress) =>
    useTransform(progress, [0, 0.5], [0, 1])
  )

  const clipProgresses = scrollYProgresses.map((progress) =>
    useTransform(progress, [0, 0.5], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"])
  )

  const translateContents = scrollYProgresses.map((progress) =>
    useTransform(progress, [0, 0.7], [-60, 0])
  )

  const scaleProgresses = scrollYProgresses.map((progress) =>
    useTransform(progress, [0, 0.7], [0.92, 1])
  )

  return (
    <section id="proprietes" className="bg-noir relative overflow-hidden">
      {/* Decorative vertical lines */}
      <div className="absolute top-0 left-[15%] w-px h-full bg-gradient-to-b from-transparent via-gold/8 to-transparent hidden lg:block" />
      <div className="absolute top-0 right-[25%] w-px h-full bg-gradient-to-b from-transparent via-gold/5 to-transparent hidden lg:block" />

      {/* Section intro — full height landing */}
      <div className="min-h-screen w-full flex flex-col items-center justify-center relative px-6">
        {/* Giant watermark number */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[25rem] lg:text-[40rem] font-bold text-cream/[0.02] leading-none select-none pointer-events-none">
          05
        </div>

        {/* Decorative elements */}
        <div className="absolute top-[20%] right-[8%] w-24 h-24 border border-gold/10 rotate-45 hidden lg:block" />
        <div className="absolute bottom-[25%] left-[6%] w-16 h-16 border border-cream/[0.04] rounded-full hidden lg:block" />

        <div className="text-center relative z-10">
          <span className="block font-sans text-[10px] tracking-[0.5em] uppercase text-gold mb-8">
            Collection
          </span>
          <h2 className="font-serif text-6xl sm:text-8xl lg:text-9xl font-bold text-cream leading-[0.85]">
            Nos
          </h2>
          <h2 className="font-serif text-6xl sm:text-8xl lg:text-9xl font-bold text-gold italic leading-[0.85]">
            Propriétés
          </h2>
          <div className="w-24 h-px bg-gold mx-auto mt-8 mb-8" />
          <p className="font-sans text-sm lg:text-base text-warm-gray/50 max-w-lg mx-auto leading-relaxed">
            Découvrez notre collection exclusive de propriétés d&apos;exception.
            Chaque résidence est sélectionnée pour son caractère unique et son emplacement prestigieux.
          </p>
          <div className="mt-16 flex flex-col items-center gap-3 opacity-40">
            <span className="font-sans text-[9px] tracking-[0.5em] uppercase text-warm-gray">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <ArrowDown size={14} className="text-gold" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Parallax property sections */}
      <div className="flex flex-col">
        {PROPERTY_SECTIONS.map((section, index) => (
          <div
            key={section.id}
            ref={sectionRefs[index]}
            className={`min-h-[70vh] sm:min-h-screen flex flex-col lg:flex-row items-center justify-center px-6 lg:px-16 xl:px-24 py-16 lg:py-0 ${
              section.reverse ? "lg:flex-row-reverse" : ""
            }`}
          >
            {/* Text content */}
            <motion.div
              style={{ y: translateContents[index] }}
              className="flex-1 max-w-xl"
            >
              {/* Category label */}
              <span className="font-sans text-[9px] tracking-[0.5em] uppercase text-gold block mb-4">
                {section.category}
              </span>

              {/* Title with line breaks */}
              <h3 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-cream leading-[0.9] mb-6 whitespace-pre-line">
                {section.title}
              </h3>

              {/* Gold separator */}
              <div className="w-16 h-px bg-gold/60 mb-6" />

              {/* Description */}
              <motion.p
                style={{ y: translateContents[index] }}
                className="font-sans text-sm lg:text-base text-warm-gray/60 max-w-md leading-relaxed mb-8"
              >
                {section.description}
              </motion.p>

              {/* Property details grid */}
              <div className="grid grid-cols-3 gap-6 mb-8 py-6 border-t border-b border-noir-mid/50">
                <div className="flex items-center gap-2">
                  <Bed size={14} className="text-gold/60" />
                  <div>
                    <span className="font-serif text-lg font-bold text-cream">{section.bedrooms}</span>
                    <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-warm-gray/40 block">
                      Chambres
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bath size={14} className="text-gold/60" />
                  <div>
                    <span className="font-serif text-lg font-bold text-cream">{section.bathrooms}</span>
                    <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-warm-gray/40 block">
                      SdB
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize size={14} className="text-gold/60" />
                  <div>
                    <span className="font-serif text-lg font-bold text-cream">{section.area}</span>
                    <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-warm-gray/40 block">
                      m²
                    </span>
                  </div>
                </div>
              </div>

              {/* Price and location */}
              <div className="flex items-end justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-2xl lg:text-3xl font-bold text-cream">
                      {section.price}
                    </span>
                    <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-gold">
                      {section.currency}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin size={11} className="text-gold/50" />
                    <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-warm-gray/40">
                      {section.location}
                    </span>
                  </div>
                </div>

                {/* Property index */}
                <span className="font-serif text-6xl lg:text-8xl font-bold text-cream/[0.04] leading-none select-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </motion.div>

            {/* Image with clip-path reveal */}
            <motion.div
              style={{
                opacity: opacityContents[index],
                clipPath: clipProgresses[index],
                scale: scaleProgresses[index],
              }}
              className="relative flex-1 max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto lg:mx-16 mt-8 lg:mt-0 w-full lg:w-auto"
            >
              {/* Gold border frame */}
              <div className="absolute -inset-3 border border-gold/10 pointer-events-none" />
              <div className="absolute -inset-1 border border-gold/5 pointer-events-none" />

              <img
                src={section.imageUrl}
                className="w-full aspect-[4/5] object-cover"
                alt={section.title.replace("\n", " ")}
                loading={index < 2 ? "eager" : "lazy"}
                draggable={false}
              />

              {/* Image overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-noir/30 via-transparent to-noir/10 pointer-events-none" />

              {/* Category tag on image */}
              <div className="absolute top-6 left-6 px-4 py-2 border border-gold/30 bg-noir/60 backdrop-blur-sm">
                <span className="font-sans text-[8px] tracking-[0.4em] uppercase text-gold">
                  {section.category}
                </span>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Ending section */}
      <div className="min-h-[60vh] w-full flex flex-col items-center justify-center relative px-6">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[15rem] lg:text-[25rem] font-bold text-gold/[0.03] leading-none select-none pointer-events-none">
          05
        </div>
        <div className="text-center relative z-10">
          <div className="w-px h-16 bg-gradient-to-b from-gold/50 to-gold/0 mx-auto mb-8" />
          <span className="font-sans text-[10px] tracking-[0.5em] uppercase text-warm-gray/30 block">
            5 propriétés d&apos;exception — Dakar, Sénégal
          </span>
        </div>
      </div>
    </section>
  )
}
