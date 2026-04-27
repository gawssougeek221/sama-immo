'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Bed, Bath, Maximize, ChevronDown, Phone, Mail, MapPin, Star, ArrowRight, Menu, X } from 'lucide-react'

// ─── Data ───────────────────────────────────────────────────
const properties = [
  {
    id: 1,
    name: 'Villa Luxe Ngor',
    price: '850 000 000',
    currency: 'CFA',
    bedrooms: 4,
    bathrooms: 3,
    area: 450,
    description:
      'Magnifique villa vue océan à Ngor, avec terrasse panoramique, piscine chauffée et jardin paysager. Construction premium avec finitions haut de gamme, sécurité 24/7 et accès privé à la plage.',
    image: '/villa-ngor.png',
    badge: 'Vedette',
  },
  {
    id: 2,
    name: 'Penthouse Plateau',
    price: '650 000 000',
    currency: 'CFA',
    bedrooms: 3,
    bathrooms: 2,
    area: 350,
    description:
      "Élégant penthouse au cœur du Plateau avec accès direct au jardin privé. Proximité commerces et restaurants haut de gamme. Terrasse rooftop avec vue imprenable sur l'Atlantique.",
    image: '/penthouse-plateau.png',
    badge: 'Nouveau',
  },
  {
    id: 3,
    name: 'Résidence Mermoz',
    price: '520 000 000',
    currency: 'CFA',
    bedrooms: 3,
    bathrooms: 2,
    area: 300,
    description:
      'Maison de charme à Mermoz dans quartier résidentiel prisé. Beaux espaces verts, cuisine américaine équipée, parking couvert. Cadre intime et sécurisé pour famille.',
    image: '/residence-mermoz.png',
    badge: 'Exclusif',
  },
]

const stats = [
  { value: 1200, suffix: '+', label: 'Propriétés Vendues' },
  { value: 25, suffix: '', label: "Ans d'Expérience" },
  { value: 98, suffix: '%', label: 'Clients Satisfaits' },
  { value: 500, suffix: 'M+', label: 'CA Annuel' },
]

const testimonials = [
  {
    name: 'Aminata Diallo',
    role: 'Avocate',
    text: "LuxeProperty a trouvé la villa de nos rêves à Ngor en moins de deux semaines. Un service irréprochable et une attention aux détails remarquable.",
    rating: 5,
  },
  {
    name: 'Jean-Pierre Martin',
    role: "Directeur d'entreprise",
    text: "Professionnalisme et expertise caractérisent cette agence. L'achat de notre penthouse au Plateau s'est déroulé sans aucun stress.",
    rating: 5,
  },
  {
    name: 'Fatou Sow',
    role: 'Médecin',
    text: "Grâce à LuxeProperty, nous avons trouvé une résidence exceptionnelle à Mermoz. L'équipe est à l'écoute et très réactive.",
    rating: 5,
  },
]

// ─── Counter Animation Hook ────────────────────────────────
function useCounter(end: number, duration = 2, startCounting = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!startCounting) return
    let start = 0
    const increment = end / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [end, duration, startCounting])
  return count
}

// ─── Navbar ─────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-2xl sm:text-3xl font-black tracking-tight transition-colors duration-500 ${
              scrolled ? 'text-violet-700' : 'text-white'
            }`}
          >
            Luxe<span className="text-amber-400">Property</span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            {['Propriétés', 'À Propos', 'Témoignages', 'Contact'].map(
              (item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className={`text-sm font-medium transition-colors duration-300 hover:text-amber-400 ${
                    scrolled ? 'text-gray-700' : 'text-white/90'
                  }`}
                >
                  {item}
                </motion.a>
              )
            )}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="px-5 py-2.5 bg-amber-400 text-violet-900 rounded-full font-bold text-sm hover:bg-amber-300 transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/25"
            >
              Nous Appeler
            </motion.button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 transition-colors ${
              scrolled ? 'text-gray-700' : 'text-white'
            }`}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-3">
              {['Propriétés', 'À Propos', 'Témoignages', 'Contact'].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => setMobileOpen(false)}
                    className="block py-2 text-gray-700 font-medium hover:text-violet-600 transition-colors"
                  >
                    {item}
                  </a>
                )
              )}
              <button className="w-full px-5 py-3 bg-amber-400 text-violet-900 rounded-full font-bold text-sm hover:bg-amber-300 transition-all">
                Nous Appeler
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// ─── Hero Section ──────────────────────────────────────────
function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, 200])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const titleLetters = 'LuxeProperty'.split('')

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">
      {/* Background image with parallax */}
      <motion.div style={{ y }} className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-background.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/80 via-purple-800/70 to-amber-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </motion.div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-[10%] w-64 h-64 rounded-full bg-amber-400/10 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
            rotate: [0, -5, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-[10%] w-80 h-80 rounded-full bg-violet-400/10 blur-3xl"
        />
      </div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 sm:px-6"
      >
        {/* Title with letter animation */}
        <div className="overflow-hidden mb-4">
          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black tracking-tight text-white">
            {titleLetters.map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 60, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.5 + i * 0.04,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-lg sm:text-2xl text-white/90 font-light mb-3 tracking-wide"
        >
          Propriétés d&apos;Exception à Dakar
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex items-center gap-2 text-amber-300 mb-8"
        >
          <MapPin size={18} />
          <span className="text-sm sm:text-base font-medium">
            Sénégal • Afrique de l&apos;Ouest
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 1.8,
            duration: 0.6,
            ease: [0.175, 0.885, 0.32, 1.275],
          }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#proprietes"
            className="group px-8 py-4 bg-white text-violet-700 rounded-full font-bold text-base sm:text-lg hover:bg-amber-400 hover:text-violet-900 transition-all duration-300 hover:shadow-xl hover:shadow-amber-400/25 flex items-center gap-2"
          >
            Voir Propriétés
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
          <a
            href="#contact"
            className="px-8 py-4 border-2 border-white/40 text-white rounded-full font-bold text-base sm:text-lg hover:bg-white/10 hover:border-white/60 transition-all duration-300"
          >
            Contactez-nous
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute bottom-8"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown size={32} className="text-white/60" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

// ─── Property Card ─────────────────────────────────────────
function PropertyCard({
  property,
  index,
}: {
  property: (typeof properties)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -80 : 80 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center ${
        index % 2 !== 0 ? 'lg:direction-rtl' : ''
      }`}
    >
      {/* Image */}
      <div
        className={`relative group overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl shadow-violet-900/10 ${
          index % 2 !== 0 ? 'lg:order-2' : ''
        }`}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
          className="aspect-[16/10] overflow-hidden"
        >
          <img
            src={property.image}
            alt={property.name}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute top-4 left-4">
          <span className="px-4 py-1.5 bg-amber-400 text-violet-900 rounded-full text-sm font-bold shadow-lg">
            {property.badge}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Info */}
      <div className={`${index % 2 !== 0 ? 'lg:order-1' : ''} space-y-5`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h3 className="text-3xl lg:text-4xl font-black text-violet-700 mb-1">
            {property.name}
          </h3>
          <div className="flex items-center gap-2 text-violet-400">
            <MapPin size={16} />
            <span className="text-sm font-medium">Dakar, Sénégal</span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-2xl lg:text-3xl font-bold text-amber-500"
        >
          {property.price}{' '}
          <span className="text-lg font-normal text-amber-400">
            {property.currency}
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="bg-violet-50 rounded-xl p-3 text-center">
            <Bed className="mx-auto mb-1 text-violet-500" size={22} />
            <div className="text-xl font-bold text-violet-700">
              {property.bedrooms}
            </div>
            <div className="text-xs text-violet-400">Chambres</div>
          </div>
          <div className="bg-violet-50 rounded-xl p-3 text-center">
            <Bath className="mx-auto mb-1 text-violet-500" size={22} />
            <div className="text-xl font-bold text-violet-700">
              {property.bathrooms}
            </div>
            <div className="text-xs text-violet-400">Salles Bain</div>
          </div>
          <div className="bg-violet-50 rounded-xl p-3 text-center">
            <Maximize className="mx-auto mb-1 text-violet-500" size={22} />
            <div className="text-xl font-bold text-violet-700">
              {property.area}m²
            </div>
            <div className="text-xs text-violet-400">Surface</div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-gray-600 leading-relaxed"
        >
          {property.description}
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-violet-700 text-white rounded-xl font-bold text-lg hover:bg-violet-800 transition-colors duration-300 hover:shadow-xl hover:shadow-violet-700/25 flex items-center justify-center gap-2"
        >
          Demander une Visite
          <ArrowRight size={20} />
        </motion.button>
      </div>
    </motion.div>
  )
}

// ─── Properties Section ────────────────────────────────────
function PropertiesSection() {
  return (
    <section id="proprietes" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          subtitle="Découvrez notre collection"
          title="Nos Propriétés"
          description="Des résidences d'exception soigneusement sélectionnées dans les quartiers les plus prestigieux de Dakar."
        />

        <div className="space-y-16 lg:space-y-24">
          {properties.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Stats Section ─────────────────────────────────────────
function StatCard({
  stat,
  index,
}: {
  stat: (typeof stats)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const count = useCounter(stat.value, 2, isInView)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="text-center p-8 bg-white rounded-2xl shadow-lg shadow-violet-100/50 border border-violet-50 hover:bg-violet-700 hover:shadow-violet-200 transition-colors duration-500 group cursor-default"
    >
      <div className="text-4xl lg:text-5xl font-black text-violet-700 group-hover:text-amber-300 transition-colors duration-500 mb-2">
        {count}
        {stat.suffix}
      </div>
      <div className="text-gray-500 group-hover:text-violet-100 font-medium transition-colors duration-500">
        {stat.label}
      </div>
    </motion.div>
  )
}

function StatsSection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          subtitle="Notre impact"
          title="Nos Chiffres"
          description="Des résultats qui parlent d'eux-mêmes, témoignant de la confiance de nos clients et de notre expertise."
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials Section ──────────────────────────────────
function TestimonialsSection() {
  return (
    <section
      id="temoignages"
      className="py-16 sm:py-24 bg-gradient-to-br from-violet-900 via-purple-800 to-violet-950 text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-white/10 rounded-full text-amber-300 text-sm font-medium mb-4"
          >
            Témoignages
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-5xl font-black mb-4"
          >
            Ce Que Disent Nos Clients
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-violet-200 text-lg max-w-2xl mx-auto"
          >
            La satisfaction de nos clients est notre plus belle récompense.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ y: -6 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8 hover:bg-white/10 transition-all duration-500"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    size={18}
                    className="text-amber-400 fill-amber-400"
                  />
                ))}
              </div>
              <p className="text-violet-100 leading-relaxed mb-6 italic">
                &ldquo;{t.text}&rdquo;
              </p>
              <div>
                <div className="font-bold text-white">{t.name}</div>
                <div className="text-violet-300 text-sm">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Contact Section ───────────────────────────────────────
function ContactSection() {
  return (
    <section id="contact" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          subtitle="Prenez contact"
          title="Contactez-nous"
          description="Notre équipe d'experts est à votre disposition pour vous accompagner dans votre projet immobilier."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="text-violet-600" size={22} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Téléphone</h4>
                <p className="text-gray-600">+221 33 800 00 00</p>
                <p className="text-gray-500 text-sm">
                  Lun - Sam, 8h - 19h
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="text-violet-600" size={22} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Email</h4>
                <p className="text-gray-600">contact@luxeproperty.sn</p>
                <p className="text-gray-500 text-sm">
                  Réponse sous 24h
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="text-violet-600" size={22} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Adresse</h4>
                <p className="text-gray-600">
                  45 Boulevard de la République
                </p>
                <p className="text-gray-500 text-sm">
                  Plateau, Dakar, Sénégal
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form
              className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 space-y-5"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    placeholder="Votre nom"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    placeholder="+221 XX XXX XX XX"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Type de propriété
                </label>
                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all text-gray-900 bg-white">
                  <option>Villa</option>
                  <option>Penthouse</option>
                  <option>Appartement</option>
                  <option>Terrain</option>
                  <option>Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Décrivez votre projet immobilier..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 outline-none transition-all resize-none text-gray-900 placeholder:text-gray-400"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                className="w-full py-4 bg-violet-700 text-white rounded-xl font-bold text-lg hover:bg-violet-800 transition-colors duration-300 hover:shadow-xl hover:shadow-violet-700/25"
              >
                Envoyer le Message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-violet-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <div className="text-3xl font-black mb-4">
              Luxe<span className="text-amber-400">Property</span>
            </div>
            <p className="text-violet-300 leading-relaxed text-sm">
              Votre partenaire de confiance pour l&apos;immobilier de luxe à
              Dakar. Plus de 25 ans d&apos;excellence au service de votre
              patrimoine.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-amber-300 mb-4">Navigation</h4>
            <ul className="space-y-2 text-violet-300 text-sm">
              {['Propriétés', 'À Propos', 'Témoignages', 'Contact'].map(
                (item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                      className="hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-amber-300 mb-4">Quartiers</h4>
            <ul className="space-y-2 text-violet-300 text-sm">
              {['Ngor', 'Plateau', 'Mermoz', 'Almadies', 'Fann'].map(
                (item) => (
                  <li key={item}>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      {item}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-amber-300 mb-4">Contact</h4>
            <ul className="space-y-3 text-violet-300 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-amber-400" />
                +221 33 800 00 00
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-amber-400" />
                contact@luxeproperty.sn
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-amber-400 mt-0.5" />
                45 Blvd de la République, Plateau, Dakar
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-violet-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-violet-400 text-sm">
            &copy; 2026 LuxeProperty. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-violet-400 text-sm">
            <span className="hover:text-white transition-colors cursor-pointer">
              Mentions légales
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              Politique de confidentialité
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Section Header ────────────────────────────────────────
function SectionHeader({
  subtitle,
  title,
  description,
}: {
  subtitle: string
  title: string
  description: string
}) {
  return (
    <div className="text-center mb-12 lg:mb-16">
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="inline-block px-4 py-1.5 bg-violet-100 rounded-full text-violet-700 text-sm font-medium mb-4"
      >
        {subtitle}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl sm:text-5xl font-black text-gray-900 mb-4"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-gray-500 text-lg max-w-2xl mx-auto"
      >
        {description}
      </motion.p>
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <PropertiesSection />
        <StatsSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
