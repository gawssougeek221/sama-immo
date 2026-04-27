'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Star,
  ChevronDown,
  Menu,
  X,
  Diamond,
  Shield,
  TrendingUp,
  Clock,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// ─── DATA ──────────────────────────────────────────────────
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
      "Magnifique villa vue océan à Ngor, avec terrasse panoramique, piscine chauffée et jardin paysager. Construction premium avec finitions haut de gamme, sécurité 24/7 et accès privé à la plage.",
    image: '/villa-ngor.png',
    location: 'Ngor, Dakar',
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
      "Élégant penthouse au cœur du Plateau avec vue imprenable sur l'Atlantique. Terrasse rooftop privée, finitions marbre et bois précieux.",
    image: '/penthouse-plateau.png',
    location: 'Plateau, Dakar',
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
      'Maison de charme à Mermoz dans un quartier résidentiel prisé. Cuisine américaine équipée, espaces verts paysagers, parking couvert.',
    image: '/residence-mermoz.png',
    location: 'Mermoz, Dakar',
  },
]

const stats = [
  { value: 1200, suffix: '+', label: 'Propriétés Vendues', icon: Diamond },
  { value: 25, suffix: '', label: "Ans d'Excellence", icon: Clock },
  { value: 98, suffix: '%', label: 'Clients Satisfaits', icon: Shield },
  { value: 500, suffix: 'M+', label: "CA Annuel (CFA)", icon: TrendingUp },
]

const testimonials = [
  {
    name: 'Aminata Diallo',
    role: 'Avocate',
    text: "LuxeProperty a trouvé la villa de nos rêves à Ngor en moins de deux semaines. Un service irréprochable, une attention aux détails remarquable.",
    rating: 5,
  },
  {
    name: 'Jean-Pierre Martin',
    role: "Directeur d'entreprise",
    text: "Professionnalisme et expertise caractérisent cette agence. L'achat de notre penthouse au Plateau s'est déroulé sans le moindre stress.",
    rating: 5,
  },
  {
    name: 'Fatou Sow',
    role: 'Médecin',
    text: "Grâce à LuxeProperty, nous avons découvert une résidence exceptionnelle à Mermoz. L'équipe est à l'écoute et d'un conseil avisé.",
    rating: 5,
  },
]

// ─── HOOKS ─────────────────────────────────────────────────
function useCounter(end: number, duration = 2, shouldStart = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!shouldStart) return
    const obj = { val: 0 }
    gsap.to(obj, {
      val: end,
      duration,
      ease: 'power2.out',
      onUpdate: () => setCount(Math.floor(obj.val)),
    })
  }, [end, duration, shouldStart])
  return count
}

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [isInView, setIsInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])
  return isInView
}

// ─── MAGNETIC CURSOR ───────────────────────────────────────
function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const dot = dotRef.current
    if (!cursor || !dot) return

    // Only show on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    cursor.style.display = 'block'
    dot.style.display = 'block'

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: 'power3.out',
      })
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power2.out',
      })
    }

    const handleEnter = () => {
      gsap.to(cursor, { scale: 2.5, opacity: 0.5, duration: 0.3 })
      gsap.to(dot, { scale: 0, duration: 0.3 })
    }

    const handleLeave = () => {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 })
      gsap.to(dot, { scale: 1, duration: 0.3 })
    }

    window.addEventListener('mousemove', moveCursor)

    const interactives = document.querySelectorAll('a, button, .magnetic')
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', handleEnter)
      el.addEventListener('mouseleave', handleLeave)
    })

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', handleEnter)
        el.removeEventListener('mouseleave', handleLeave)
      })
    }
  }, [])

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full border border-gold/60 pointer-events-none z-[10000] hidden mix-blend-difference"
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 -ml-0.75 -mt-0.75 rounded-full bg-gold pointer-events-none z-[10001] hidden"
      />
    </>
  )
}

// ─── GRAIN OVERLAY ─────────────────────────────────────────
function GrainOverlay() {
  return <div className="grain-overlay" />
}

// ─── PRELOADER ─────────────────────────────────────────────
function Preloader() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline()
      tl.from('.preloader-count', {
        textContent: 0,
        duration: 1.8,
        ease: 'power2.inOut',
        snap: { textContent: 1 },
        onUpdate: function () {
          const progress = Math.round(
            (this.progress() ?? 0) * 100
          )
          const el = ref.current?.querySelector('.preloader-count')
          if (el) el.textContent = String(progress)
        },
      })
      tl.to('.preloader-line-fill', {
        scaleX: 1,
        duration: 1.8,
        ease: 'power2.inOut',
      }, 0)
      tl.to('.preloader-top', {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut',
      }, '+=0.2')
      tl.to('.preloader-bottom', {
        yPercent: 100,
        duration: 0.8,
        ease: 'power4.inOut',
      }, '<')
      tl.set(ref.current, { display: 'none' })
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className="fixed inset-0 z-[9999] bg-noir">
      <div className="preloader-top absolute top-0 left-0 right-0 h-1/2 bg-noir flex items-end justify-center pb-4">
        <div className="font-serif text-8xl font-bold text-cream">
          <span className="preloader-count">0</span>
          <span className="text-gold">%</span>
        </div>
      </div>
      <div className="preloader-bottom absolute bottom-0 left-0 right-0 h-1/2 bg-noir flex items-start justify-center pt-4">
        <div className="w-64 h-px bg-noir-mid relative overflow-hidden">
          <div className="preloader-line-fill absolute inset-0 bg-gold origin-left scale-x-0" />
        </div>
      </div>
    </div>
  )
}

// ─── NAVBAR ────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.nav-inner', {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 3.2,
      })
    },
    { scope: navRef }
  )

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled
          ? 'bg-noir/90 backdrop-blur-xl border-b border-gold/10'
          : 'bg-transparent'
      }`}
    >
      <div className="nav-inner max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <Diamond className="text-gold" size={24} />
            <span className="font-serif text-2xl font-bold tracking-wide">
              <span className="text-cream">Luxe</span>
              <span className="text-gold">Property</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            {['Propriétés', 'Chiffres', 'Témoignages', 'Contact'].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="magnetic text-sm font-sans font-medium tracking-widest uppercase text-warm-gray hover:text-gold transition-colors duration-300 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-500" />
                </a>
              )
            )}
            <a
              href="#contact"
              className="magnetic px-6 py-2.5 bg-gold text-noir font-sans font-semibold text-sm tracking-wider uppercase hover:bg-gold-light transition-all duration-300"
            >
              Contact
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-cream p-2"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-noir/98 backdrop-blur-xl border-t border-gold/10">
          <div className="px-6 py-6 space-y-4">
            {['Propriétés', 'Chiffres', 'Témoignages', 'Contact'].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2 font-sans text-lg text-warm-gray hover:text-gold transition-colors tracking-wider uppercase"
                >
                  {item}
                </a>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

// ─── HERO ──────────────────────────────────────────────────
function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // After preloader finishes
      const tl = gsap.timeline({ delay: 2.8 })

      // Clip-path reveal of background image
      tl.fromTo(
        '.hero-bg-img',
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.5,
          ease: 'power4.inOut',
        }
      )

      // Title - split by character for awwwards-style reveal
      tl.from(
        '.hero-char',
        {
          y: 120,
          rotationX: -80,
          opacity: 0,
          stagger: 0.03,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.8'
      )

      // Gold line expand
      tl.from(
        '.hero-line',
        {
          scaleX: 0,
          duration: 1,
          ease: 'power4.inOut',
        },
        '-=0.4'
      )

      // Subtitle slide up
      tl.from(
        '.hero-sub',
        {
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
        },
        '-=0.5'
      )

      // Location and CTAs
      tl.from(
        '.hero-meta',
        {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
        },
        '-=0.3'
      )

      // Scroll indicator
      tl.from(
        '.hero-scroll',
        {
          opacity: 0,
          duration: 0.8,
        },
        '-=0.2'
      )

      // Parallax on scroll
      gsap.to('.hero-bg-img', {
        yPercent: 20,
        scale: 1.1,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      // Content parallax & fade
      gsap.to('.hero-content', {
        yPercent: -30,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: '40% top',
          end: '100% top',
          scrub: true,
        },
      })
    },
    { scope: heroRef }
  )

  const titleLine1 = 'Propriétés'
  const titleLine2 = "d'Exception"

  return (
    <section
      ref={heroRef}
      className="relative h-screen overflow-hidden bg-noir"
    >
      {/* Background with clip-path reveal */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="hero-bg-img absolute inset-0 bg-cover bg-center scale-110"
          style={{ backgroundImage: "url('/hero-background.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-noir/60 via-noir/40 to-noir" />
        <div className="absolute inset-0 bg-gradient-to-r from-noir/70 via-transparent to-noir/30" />
      </div>

      {/* Decorative vertical lines */}
      <div className="absolute top-[20%] right-[10%] w-px h-60 bg-gradient-to-b from-transparent via-gold/30 to-transparent hidden lg:block" />
      <div className="absolute bottom-[20%] left-[6%] w-px h-40 bg-gradient-to-b from-transparent via-gold/15 to-transparent hidden lg:block" />

      <div className="hero-content relative z-10 h-full flex flex-col justify-end pb-24 lg:pb-36 px-6 lg:px-16 max-w-[1400px] mx-auto">
        <div className="max-w-5xl">
          {/* Location label */}
          <div className="hero-meta flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-gold" />
            <span className="font-sans text-xs tracking-[0.4em] uppercase text-gold">
              Sénégal — Afrique de l&apos;Ouest
            </span>
          </div>

          {/* Title with per-character animation */}
          <h1 className="font-serif font-bold leading-[0.85] tracking-tight text-cream mb-4 overflow-hidden">
            <span className="block text-6xl sm:text-8xl lg:text-[9rem]">
              {titleLine1.split('').map((char, i) => (
                <span
                  key={`l1-${i}`}
                  className="hero-char inline-block"
                  style={{ willChange: 'transform, opacity' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
            <span className="block text-6xl sm:text-8xl lg:text-[9rem]">
              {titleLine2.split('').map((char, i) => (
                <span
                  key={`l2-${i}`}
                  className="hero-char inline-block"
                  style={{ willChange: 'transform, opacity' }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
            <span className="block text-4xl sm:text-5xl lg:text-6xl text-gold/60 mt-2 italic">
              à Dakar
            </span>
          </h1>

          {/* Gold line */}
          <div className="hero-line w-24 h-px bg-gold mb-8 origin-left" />

          {/* Subtitle */}
          <p className="hero-sub font-sans text-base lg:text-lg text-warm-gray max-w-lg leading-relaxed mb-10">
            Votre partenaire de confiance pour l&apos;immobilier de luxe.
            Des résidences d&apos;exception dans les quartiers les plus
            prestigieux.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#proprietes"
              className="hero-meta magnetic group inline-flex items-center gap-3 px-10 py-4 bg-gold text-noir font-sans font-semibold text-xs tracking-[0.3em] uppercase hover:bg-gold-light transition-all duration-300"
            >
              Découvrir
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
            <a
              href="#contact"
              className="hero-meta magnetic inline-flex items-center gap-3 px-10 py-4 border border-cream/20 text-cream font-sans font-semibold text-xs tracking-[0.3em] uppercase hover:border-gold hover:text-gold transition-all duration-300"
            >
              Nous Contacter
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <div className="w-px h-10 bg-gradient-to-b from-gold/50 to-transparent" />
          <span className="font-sans text-[9px] tracking-[0.5em] uppercase text-warm-gray/40">
            Scroll
          </span>
        </div>
      </div>
    </section>
  )
}

// ─── MARQUEE ───────────────────────────────────────────────
function MarqueeBand() {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.to('.marquee-track', {
        xPercent: -50,
        duration: 25,
        ease: 'none',
        repeat: -1,
      })
    },
    { scope: ref }
  )

  const items = [
    'Villa Ngor',
    '◆',
    'Penthouse Plateau',
    '◆',
    'Résidence Mermoz',
    '◆',
    'Immobilier de Luxe',
    '◆',
    'Dakar Sénégal',
    '◆',
  ]
  const doubled = [...items, ...items]

  return (
    <div
      ref={ref}
      className="bg-gold py-4 overflow-hidden border-y border-gold-dark"
    >
      <div className="marquee-track flex whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className={`font-serif text-lg lg:text-xl mx-6 ${
              item === '◆'
                ? 'text-noir/30'
                : 'text-noir font-bold tracking-wide'
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── HORIZONTAL SCROLL PROPERTIES ──────────────────────────
function PropertySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const track = trackRef.current
      const section = sectionRef.current
      if (!track || !section) return

      // Pin the section and scroll the track horizontally
      const scrollWidth = track.scrollWidth - window.innerWidth

      gsap.to(track, {
        x: -scrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${scrollWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Animate each property card as it enters
      gsap.utils.toArray<HTMLElement>('.horiz-card').forEach((card) => {
        gsap.from(card, {
          y: 80,
          opacity: 0,
          scale: 0.9,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'left 80%',
            end: 'left 50%',
            scrub: 1,
            containerAnimation: gsap.getById('horizScroll') ?? undefined,
          },
        })
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      id="proprietes"
      className="bg-noir relative overflow-hidden"
    >
      {/* Section title pinned at top */}
      <div className="absolute top-8 left-6 lg:left-12 z-10">
        <div className="font-sans text-[10px] tracking-[0.5em] uppercase text-gold mb-2">
          Collection
        </div>
        <h2 className="font-serif text-3xl lg:text-5xl font-bold text-cream">
          Nos Propriétés
        </h2>
        <div className="w-12 h-px bg-gold mt-3" />
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        className="flex items-center h-screen gap-8 lg:gap-16 pl-[50vw] pr-[20vw] pt-20"
      >
        {properties.map((property, index) => (
          <HorizPropertyCard
            key={property.id}
            property={property}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}

function HorizPropertyCard({
  property,
  index,
}: {
  property: (typeof properties)[0]
  index: number
}) {
  return (
    <div className="horiz-card flex-shrink-0 w-[75vw] sm:w-[50vw] lg:w-[35vw] group">
      {/* Image with clip-path reveal on hover */}
      <div className="relative overflow-hidden aspect-[4/5] mb-6">
        <img
          src={property.image}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-noir/60 via-transparent to-transparent" />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-colors duration-700" />

        {/* Property number */}
        <div className="absolute top-4 left-4 font-serif text-6xl font-bold text-cream/10">
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* Price tag */}
        <div className="absolute bottom-4 left-4">
          <span className="font-serif text-2xl lg:text-3xl font-bold text-cream">
            {property.price}
          </span>
          <span className="font-sans text-xs text-gold tracking-wider uppercase ml-2">
            {property.currency}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin size={12} className="text-gold" />
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold">
            {property.location}
          </span>
        </div>
        <h3 className="font-serif text-3xl lg:text-4xl font-bold text-cream group-hover:text-gold transition-colors duration-500">
          {property.name}
        </h3>
        <div className="flex gap-4">
          {[
            { icon: Bed, value: property.bedrooms, label: 'Ch.' },
            { icon: Bath, value: property.bathrooms, label: 'SdB' },
            { icon: Maximize2, value: `${property.area}m²`, label: 'Surface' },
          ].map((d) => (
            <div
              key={d.label}
              className="flex items-center gap-1.5 font-sans text-xs text-warm-gray/60"
            >
              <d.icon size={12} className="text-gold/50" />
              <span className="text-cream font-medium">{d.value}</span>
              <span>{d.label}</span>
            </div>
          ))}
        </div>
        <p className="font-sans text-xs text-warm-gray/50 leading-relaxed max-w-md">
          {property.description}
        </p>
        <button className="magnetic group/btn inline-flex items-center gap-2 font-sans text-[10px] tracking-[0.3em] uppercase text-gold mt-2 hover:text-gold-light transition-colors">
          Demander une visite
          <ArrowRight
            size={12}
            className="group-hover/btn:translate-x-2 transition-transform duration-300"
          />
        </button>
      </div>
    </div>
  )
}

// ─── STATS WITH PINNED COUNTER ─────────────────────────────
function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // Staggered reveal of each stat
      gsap.from('.stat-item', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
      })

      // Horizontal gold line expand
      gsap.from('.stats-gold-line', {
        scaleX: 0,
        duration: 1.5,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} id="chiffres" className="bg-noir-light py-28 lg:py-40 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <SectionHeader
          label="Performance"
          title="Nos Chiffres"
          description="Des résultats qui parlent d'eux-mêmes."
        />

        <div className="stats-gold-line w-full h-px bg-gold/20 mb-0 origin-left" />

        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        <div className="stats-gold-line w-full h-px bg-gold/20 mt-0 origin-left" />
      </div>

      {/* Giant background text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[25rem] font-bold text-noir-mid/15 leading-none select-none pointer-events-none hidden xl:block">
        25
      </div>
    </section>
  )
}

function StatCard({
  stat,
  index,
}: {
  stat: (typeof stats)[0]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref)
  const count = useCounter(stat.value, 2.5, isInView)

  return (
    <div
      ref={ref}
      className="stat-item relative py-14 px-6 text-center group cursor-default border-r border-noir-mid last:border-r-0"
    >
      <stat.icon
        size={24}
        className="mx-auto mb-4 text-gold/30 group-hover:text-gold transition-colors duration-500"
      />
      <div className="font-serif text-5xl lg:text-7xl font-bold text-cream group-hover:text-gold transition-colors duration-700 mb-2">
        {count}
        <span className="text-gold/60 text-4xl lg:text-5xl">
          {stat.suffix}
        </span>
      </div>
      <div className="font-sans text-[10px] tracking-[0.3em] uppercase text-warm-gray/40 group-hover:text-warm-gray transition-colors duration-500">
        {stat.label}
      </div>
      {/* Bottom gold accent on hover */}
      <div className="absolute bottom-0 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-700" />
    </div>
  )
}

// ─── TESTIMONIALS WITH STACKED CARDS ───────────────────────
function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // Title reveal
      gsap.from('.testi-title-line', {
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
      })

      // Cards reveal with rotation
      gsap.from('.testi-card', {
        y: 100,
        rotation: 3,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 50%',
        },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      id="temoignages"
      className="bg-noir py-28 lg:py-44 relative overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section title as large text */}
        <div className="mb-20 lg:mb-28">
          <span className="testi-title-line block font-sans text-[10px] tracking-[0.5em] uppercase text-gold mb-4">
            Témoignages
          </span>
          <h2 className="testi-title-line font-serif text-5xl sm:text-7xl lg:text-8xl font-bold text-cream leading-[0.9]">
            Ils Nous
          </h2>
          <h2 className="testi-title-line font-serif text-5xl sm:text-7xl lg:text-8xl font-bold text-gold italic leading-[0.9]">
            Font Confiance
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="testi-card border border-noir-mid p-8 lg:p-10 hover:border-gold/30 transition-all duration-700 group relative"
            >
              <div className="font-serif text-8xl text-gold/5 absolute top-2 right-6 leading-none select-none">
                &ldquo;
              </div>

              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    size={12}
                    className="text-gold fill-gold"
                  />
                ))}
              </div>

              <p className="font-sans text-sm text-warm-gray/70 leading-relaxed mb-10 relative z-10">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="border-t border-noir-mid pt-6 flex items-center gap-4">
                {/* Avatar circle */}
                <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center flex-shrink-0">
                  <span className="font-serif text-sm font-bold text-gold">
                    {t.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-serif text-base font-bold text-cream">
                    {t.name}
                  </div>
                  <div className="font-sans text-[10px] tracking-[0.2em] uppercase text-gold/50 mt-0.5">
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CONTACT SECTION ───────────────────────────────────────
function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.contact-left', {
        x: -80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
      })
      gsap.from('.contact-right', {
        x: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} id="contact" className="bg-noir-light py-28 lg:py-44">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <SectionHeader
          label="Contact"
          title="Prenons Contact"
          description="Notre équipe d'experts vous accompagne dans votre projet immobilier de luxe."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="contact-left lg:col-span-4 space-y-10">
            {[
              {
                icon: Phone,
                title: 'Téléphone',
                value: '+221 33 800 00 00',
                sub: 'Lun — Sam, 8h à 19h',
              },
              {
                icon: Mail,
                title: 'Email',
                value: 'contact@luxeproperty.sn',
                sub: 'Réponse sous 24h',
              },
              {
                icon: MapPin,
                title: 'Adresse',
                value: '45 Boulevard de la République',
                sub: 'Plateau, Dakar, Sénégal',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-5 group cursor-default"
              >
                <div className="w-12 h-12 border border-noir-mid flex items-center justify-center flex-shrink-0 group-hover:border-gold/40 transition-colors duration-500">
                  <item.icon
                    size={18}
                    className="text-gold/60 group-hover:text-gold transition-colors"
                  />
                </div>
                <div>
                  <div className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold/60 mb-1">
                    {item.title}
                  </div>
                  <div className="font-serif text-lg text-cream">
                    {item.value}
                  </div>
                  <div className="font-sans text-xs text-warm-gray/50 mt-1">
                    {item.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="contact-right lg:col-span-8">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label className="block font-sans text-[10px] tracking-[0.3em] uppercase text-gold/60 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    placeholder="Votre nom"
                    className="w-full bg-transparent border-b border-noir-mid px-1 py-3 font-sans text-sm text-cream placeholder:text-warm-gray/30 focus:border-gold outline-none transition-colors duration-300"
                  />
                </div>
                <div>
                  <label className="block font-sans text-[10px] tracking-[0.3em] uppercase text-gold/60 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    placeholder="+221 XX XXX XX XX"
                    className="w-full bg-transparent border-b border-noir-mid px-1 py-3 font-sans text-sm text-cream placeholder:text-warm-gray/30 focus:border-gold outline-none transition-colors duration-300"
                  />
                </div>
              </div>
              <div>
                <label className="block font-sans text-[10px] tracking-[0.3em] uppercase text-gold/60 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="w-full bg-transparent border-b border-noir-mid px-1 py-3 font-sans text-sm text-cream placeholder:text-warm-gray/30 focus:border-gold outline-none transition-colors duration-300"
                />
              </div>
              <div>
                <label className="block font-sans text-[10px] tracking-[0.3em] uppercase text-gold/60 mb-2">
                  Type de propriété
                </label>
                <select className="w-full bg-transparent border-b border-noir-mid px-1 py-3 font-sans text-sm text-cream focus:border-gold outline-none transition-colors duration-300">
                  <option value="" className="bg-noir-light">Sélectionner</option>
                  <option value="villa" className="bg-noir-light">Villa</option>
                  <option value="penthouse" className="bg-noir-light">Penthouse</option>
                  <option value="appartement" className="bg-noir-light">Appartement</option>
                </select>
              </div>
              <div>
                <label className="block font-sans text-[10px] tracking-[0.3em] uppercase text-gold/60 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Décrivez votre projet immobilier..."
                  className="w-full bg-transparent border-b border-noir-mid px-1 py-3 font-sans text-sm text-cream placeholder:text-warm-gray/30 focus:border-gold outline-none transition-colors duration-300 resize-none"
                />
              </div>
              <div className="pt-4">
                <button className="magnetic group inline-flex items-center gap-4 px-12 py-4 bg-gold text-noir font-sans font-semibold text-xs tracking-[0.3em] uppercase hover:bg-gold-light transition-all duration-300">
                  Envoyer
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── FOOTER ────────────────────────────────────────────────
function Footer() {
  const footerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.footer-col', {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 85%',
        },
      })
    },
    { scope: footerRef }
  )

  return (
    <footer ref={footerRef} className="bg-noir border-t border-noir-mid">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div className="footer-col lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Diamond size={20} className="text-gold" />
              <span className="font-serif text-xl font-bold text-cream">
                Luxe<span className="text-gold">Property</span>
              </span>
            </div>
            <p className="font-sans text-sm text-warm-gray/50 leading-relaxed">
              Votre partenaire de confiance pour l&apos;immobilier de luxe à
              Dakar. Plus de 25 ans d&apos;excellence.
            </p>
          </div>

          <div className="footer-col">
            <h4 className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
              Navigation
            </h4>
            <ul className="space-y-3">
              {['Propriétés', 'Chiffres', 'Témoignages', 'Contact'].map(
                (item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                      className="font-sans text-sm text-warm-gray/50 hover:text-gold transition-colors duration-300"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
              Quartiers
            </h4>
            <ul className="space-y-3">
              {['Ngor', 'Plateau', 'Mermoz', 'Almadies', 'Fann'].map(
                (item) => (
                  <li key={item}>
                    <span className="font-sans text-sm text-warm-gray/50 hover:text-gold transition-colors duration-300 cursor-pointer">
                      {item}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 font-sans text-sm text-warm-gray/50">
                <Phone size={12} className="text-gold/50" />
                +221 33 800 00 00
              </li>
              <li className="flex items-center gap-2 font-sans text-sm text-warm-gray/50">
                <Mail size={12} className="text-gold/50" />
                contact@luxeproperty.sn
              </li>
              <li className="flex items-start gap-2 font-sans text-sm text-warm-gray/50">
                <MapPin size={12} className="text-gold/50 mt-0.5" />
                45 Blvd de la République, Plateau
              </li>
            </ul>
          </div>
        </div>

        <div className="gold-rule mt-12 mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-warm-gray/30">
            &copy; 2026 LuxeProperty. Tous droits réservés.
          </p>
          <div className="flex gap-8 font-sans text-xs text-warm-gray/30">
            <span className="hover:text-gold transition-colors cursor-pointer">
              Mentions légales
            </span>
            <span className="hover:text-gold transition-colors cursor-pointer">
              Confidentialité
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── SECTION HEADER ────────────────────────────────────────
function SectionHeader({
  label,
  title,
  description,
}: {
  label: string
  title: string
  description: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.from('.sh-label', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
        },
      })
      gsap.from('.sh-title', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
        },
      })
      gsap.from('.sh-line', {
        scaleX: 0,
        duration: 1,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 75%',
        },
      })
      gsap.from('.sh-desc', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 75%',
        },
      })
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className="text-center mb-16 lg:mb-24">
      <div className="sh-label font-sans text-[10px] tracking-[0.5em] uppercase text-gold mb-4">
        {label}
      </div>
      <h2 className="sh-title font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-cream mb-6">
        {title}
      </h2>
      <div className="sh-line w-16 h-px bg-gold mx-auto mb-6" />
      <p className="sh-desc font-sans text-sm text-warm-gray/60 max-w-lg mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  )
}

// ─── MAIN PAGE ─────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-noir text-cream">
      <GrainOverlay />
      <MagneticCursor />
      <Preloader />
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <MarqueeBand />
        <PropertySection />
        <StatsSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
