'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
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
      "Magnifique villa vue océan à Ngor, avec terrasse panoramique, piscine chauffée et jardin paysager. Construction premium avec finitions haut de gamme, sécurité 24/7 et accès privé à la plage. Un havre de paix où l'Atlantique devient votre horizon.",
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
      "Élégant penthouse au cœur du Plateau avec vue imprenable sur l'Atlantique. Terrasse rooftop privée, finitions marbre et bois précieux. Proximité immédiate du centre des affaires et des restaurants les plus exclusifs.",
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
      'Maison de charme à Mermoz dans un quartier résidentiel prisé. Cuisine américaine équipée, espaces verts paysagers, parking couvert. Cadre intime et sécurisé, idéal pour une famille en quête de sérénité.',
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
    text: "LuxeProperty a trouvé la villa de nos rêves à Ngor en moins de deux semaines. Un service irréprochable, une attention aux détails remarquable. L'excellence au service de l'immobilier.",
    rating: 5,
  },
  {
    name: 'Jean-Pierre Martin',
    role: "Directeur d'entreprise",
    text: "Professionnalisme et expertise caractérisent cette agence. L'achat de notre penthouse au Plateau s'est déroulé sans le moindre stress. Une équipe qui comprend les exigences de sa clientèle.",
    rating: 5,
  },
  {
    name: 'Fatou Sow',
    role: 'Médecin',
    text: "Grâce à LuxeProperty, nous avons découvert une résidence exceptionnelle à Mermoz. L'équipe est à l'écoute, réactive et d'un conseil avisé. Je recommande sans réserve.",
    rating: 5,
  },
]

// ─── COUNTER HOOK ──────────────────────────────────────────
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

// ─── GRAIN OVERLAY ─────────────────────────────────────────
function GrainOverlay() {
  return <div className="grain-overlay" />
}

// ─── NAVBAR ────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.nav-logo', {
        y: -40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.5,
      })
      gsap.from('.nav-link', {
        y: -20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 0.8,
      })
      gsap.from('.nav-cta', {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
        delay: 1.2,
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
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <div className="nav-logo flex items-center gap-3">
            <Diamond className="text-gold" size={24} />
            <span className="font-serif text-2xl font-bold tracking-wide">
              <span className="text-cream">Luxe</span>
              <span className="text-gold">Property</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            {['Propriétés', 'Chiffres', 'Témoignages', 'Contact'].map(
              (item, i) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="nav-link text-sm font-sans font-medium tracking-widest uppercase text-warm-gray hover:text-gold transition-colors duration-300 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-500" />
                </a>
              )
            )}
            <a
              href="#contact"
              className="nav-cta px-6 py-2.5 bg-gold text-noir font-sans font-semibold text-sm tracking-wider uppercase hover:bg-gold-light transition-all duration-300"
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
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // Title reveal - split by word for dramatic effect
      tl.from('.hero-word', {
        y: 120,
        opacity: 0,
        rotationX: -80,
        stagger: 0.12,
        duration: 1.2,
        delay: 0.3,
      })
        .from(
          '.hero-line',
          {
            scaleX: 0,
            duration: 1,
            ease: 'power4.inOut',
          },
          '-=0.5'
        )
        .from(
          '.hero-sub',
          {
            y: 40,
            opacity: 0,
            duration: 0.8,
          },
          '-=0.6'
        )
        .from(
          '.hero-location',
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
          },
          '-=0.4'
        )
        .from(
          '.hero-cta',
          {
            y: 30,
            opacity: 0,
            stagger: 0.15,
            duration: 0.7,
          },
          '-=0.3'
        )
        .from(
          '.hero-scroll',
          {
            opacity: 0,
            duration: 1,
          },
          '-=0.2'
        )

      // Parallax on scroll
      gsap.to('.hero-bg', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      // Fade out hero content on scroll
      gsap.to('.hero-content', {
        yPercent: -20,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: '60% top',
          end: 'bottom top',
          scrub: true,
        },
      })
    },
    { scope: heroRef }
  )

  const titleWords = ['Propriétés', "d'Exception", 'à', 'Dakar']

  return (
    <section
      ref={heroRef}
      className="relative h-screen overflow-hidden bg-noir"
    >
      {/* Background with parallax */}
      <div className="hero-bg absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110"
          style={{ backgroundImage: "url('/hero-background.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-noir/70 via-noir/50 to-noir" />
        <div className="absolute inset-0 bg-gradient-to-r from-noir/60 via-transparent to-noir/40" />
      </div>

      {/* Decorative floating gold line */}
      <div className="absolute top-[30%] right-[8%] w-px h-40 bg-gradient-to-b from-transparent via-gold/40 to-transparent hidden lg:block" />
      <div className="absolute bottom-[25%] left-[5%] w-px h-32 bg-gradient-to-b from-transparent via-gold/20 to-transparent hidden lg:block" />

      <div className="hero-content relative z-10 h-full flex flex-col justify-end pb-20 lg:pb-32 px-6 lg:px-16 max-w-[1400px] mx-auto">
        <div className="max-w-4xl">
          {/* Small label */}
          <div className="hero-location flex items-center gap-3 mb-6">
            <MapPin size={14} className="text-gold" />
            <span className="font-sans text-xs tracking-[0.3em] uppercase text-gold">
              Sénégal — Afrique de l&apos;Ouest
            </span>
          </div>

          {/* Main title */}
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-[6.5rem] font-bold leading-[0.9] tracking-tight text-cream mb-6">
            {titleWords.map((word, i) => (
              <span key={i} className="hero-word inline-block mr-[0.25em]">
                {word}
              </span>
            ))}
          </h1>

          {/* Gold line */}
          <div className="hero-line w-24 h-px bg-gold mb-6 origin-left" />

          {/* Subtitle */}
          <p className="hero-sub font-sans text-lg lg:text-xl text-warm-gray max-w-xl leading-relaxed mb-10">
            Votre partenaire de confiance pour l&apos;immobilier de luxe.
            Découvrez des résidences d&apos;exception dans les quartiers les plus
            prestigieux de Dakar.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#proprietes"
              className="hero-cta group inline-flex items-center gap-3 px-8 py-4 bg-gold text-noir font-sans font-semibold text-sm tracking-widest uppercase hover:bg-gold-light transition-all duration-300"
            >
              Découvrir
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </a>
            <a
              href="#contact"
              className="hero-cta inline-flex items-center gap-3 px-8 py-4 border border-cream/20 text-cream font-sans font-semibold text-sm tracking-widest uppercase hover:border-gold hover:text-gold transition-all duration-300"
            >
              Nous Contacter
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-warm-gray/50">
            Scroll
          </span>
          <ChevronDown size={16} className="text-gold/50 animate-bounce" />
        </div>
      </div>
    </section>
  )
}

// ─── PROPERTY SECTION ──────────────────────────────────────
function PropertySection() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section
      ref={sectionRef}
      id="proprietes"
      className="bg-noir py-24 lg:py-40"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section header */}
        <SectionHeader
          label="Collection"
          title="Nos Propriétés"
          description="Des résidences d'exception soigneusement sélectionnées dans les quartiers les plus prestigieux de la capitale sénégalaise."
        />

        <div className="space-y-32 lg:space-y-48">
          {properties.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── PROPERTY CARD ─────────────────────────────────────────
function PropertyCard({
  property,
  index,
}: {
  property: (typeof properties)[0]
  index: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Main card reveal
      gsap.from('.prop-image-wrap', {
        x: index % 2 === 0 ? -120 : 120,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      })

      gsap.from('.prop-info', {
        x: index % 2 === 0 ? 120 : -120,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      })

      // Image parallax within the card
      gsap.to('.prop-image-inner', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })

      // Gold accent line animation
      gsap.from('.prop-gold-line', {
        scaleX: 0,
        duration: 1.2,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 60%',
        },
      })
    },
    { scope: cardRef }
  )

  const isEven = index % 2 === 0

  return (
    <div ref={cardRef} className="relative">
      {/* Large property number in background */}
      <div
        className={`absolute top-0 ${
          isEven ? 'right-0' : 'left-0'
        } font-serif text-[20rem] lg:text-[30rem] font-bold text-noir-mid/30 leading-none select-none pointer-events-none hidden lg:block`}
      >
        {String(index + 1).padStart(2, '0')}
      </div>

      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center relative`}
      >
        {/* Image */}
        <div
          className={`prop-image-wrap lg:col-span-7 relative ${
            !isEven ? 'lg:order-2' : ''
          }`}
        >
          <div className="prop-image-wrap relative overflow-hidden aspect-[16/10] group">
            <div className="prop-image-inner absolute inset-0 scale-105">
              <img
                src={property.image}
                alt={property.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-noir/40 via-transparent to-transparent" />
            {/* Gold border accent on hover */}
            <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/30 transition-all duration-700" />
          </div>
        </div>

        {/* Info */}
        <div
          className={`prop-info lg:col-span-5 space-y-6 ${
            !isEven ? 'lg:order-1' : ''
          }`}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={14} className="text-gold" />
              <span className="font-sans text-xs tracking-[0.25em] uppercase text-gold">
                {property.location}
              </span>
            </div>
            <h3 className="font-serif text-4xl lg:text-5xl font-bold text-cream leading-tight">
              {property.name}
            </h3>
          </div>

          {/* Gold line */}
          <div className="prop-gold-line w-16 h-px bg-gold origin-left" />

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-serif text-3xl lg:text-4xl font-bold text-gold">
              {property.price}
            </span>
            <span className="font-sans text-sm text-gold/70 tracking-wider uppercase">
              {property.currency}
            </span>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                icon: Bed,
                value: property.bedrooms,
                label: 'Chambres',
              },
              {
                icon: Bath,
                value: property.bathrooms,
                label: 'S. de Bain',
              },
              {
                icon: Maximize2,
                value: `${property.area}m²`,
                label: 'Surface',
              },
            ].map((detail) => (
              <div
                key={detail.label}
                className="border border-noir-mid py-4 px-3 text-center group/detail hover:border-gold/40 transition-colors duration-500"
              >
                <detail.icon
                  size={18}
                  className="mx-auto mb-2 text-gold/60 group-hover/detail:text-gold transition-colors"
                />
                <div className="font-serif text-xl font-bold text-cream">
                  {detail.value}
                </div>
                <div className="font-sans text-[10px] tracking-[0.2em] uppercase text-warm-gray/60 mt-1">
                  {detail.label}
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <p className="font-sans text-sm text-warm-gray/80 leading-relaxed">
            {property.description}
          </p>

          {/* CTA */}
          <button className="group inline-flex items-center gap-3 font-sans text-xs tracking-[0.3em] uppercase text-gold hover:text-gold-light transition-colors duration-300">
            Demander une visite
            <ArrowRight
              size={14}
              className="group-hover:translate-x-2 transition-transform duration-300"
            />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── STATS SECTION ─────────────────────────────────────────
function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.stat-divider', {
        scaleY: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power4.inOut',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} id="chiffres" className="bg-noir-light py-24 lg:py-32 relative">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <SectionHeader
          label="Performance"
          title="Nos Chiffres"
          description="Des résultats qui parlent d'eux-mêmes, témoignant de la confiance de nos clients et de notre expertise."
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>

      {/* Background decorative */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[30rem] font-bold text-cream leading-none select-none pointer-events-none">
          25
        </div>
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
      className={`relative py-12 px-6 text-center group cursor-default ${
        index < 3 ? 'stat-divider border-r border-noir-mid' : ''
      }`}
    >
      <stat.icon
        size={28}
        className="mx-auto mb-4 text-gold/40 group-hover:text-gold transition-colors duration-500"
      />
      <div className="font-serif text-5xl lg:text-6xl font-bold text-cream group-hover:text-gold transition-colors duration-700 mb-2">
        {count}
        <span className="text-gold/70">{stat.suffix}</span>
      </div>
      <div className="font-sans text-[11px] tracking-[0.3em] uppercase text-warm-gray/50 group-hover:text-warm-gray transition-colors duration-500">
        {stat.label}
      </div>
      {/* Bottom gold line on hover */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-px bg-gold group-hover:w-3/4 transition-all duration-700" />
    </div>
  )
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

// ─── TESTIMONIALS SECTION ──────────────────────────────────
function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.from('.testimonial-card', {
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
        },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      id="temoignages"
      className="bg-noir py-24 lg:py-40 relative overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <SectionHeader
          label="Témoignages"
          title="Ils Nous Font Confiance"
          description="La satisfaction de nos clients est notre plus belle récompense et notre plus forte recommandation."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="testimonial-card border border-noir-mid p-8 lg:p-10 hover:border-gold/30 transition-all duration-700 group relative"
            >
              {/* Quote mark */}
              <div className="font-serif text-6xl text-gold/10 absolute top-4 right-6 leading-none select-none">
                &ldquo;
              </div>

              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star
                    key={j}
                    size={14}
                    className="text-gold fill-gold"
                  />
                ))}
              </div>

              <p className="font-sans text-sm text-warm-gray/80 leading-relaxed mb-8 relative z-10">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="border-t border-noir-mid pt-6">
                <div className="font-serif text-lg font-bold text-cream">
                  {t.name}
                </div>
                <div className="font-sans text-xs tracking-wider uppercase text-gold/60 mt-1">
                  {t.role}
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
      gsap.from('.contact-info', {
        x: -60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
        },
      })
      gsap.from('.contact-form', {
        x: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
        },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} id="contact" className="bg-noir-light py-24 lg:py-40">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <SectionHeader
          label="Contact"
          title="Prenons Contact"
          description="Notre équipe d'experts est à votre disposition pour vous accompagner dans votre projet immobilier de luxe."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Contact Info */}
          <div className="contact-info lg:col-span-4 space-y-8">
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

          {/* Contact Form */}
          <div className="contact-form lg:col-span-8">
            <form
              onSubmit={(e) => e.preventDefault()}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  <option value="terrain" className="bg-noir-light">Terrain</option>
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
                <button className="group inline-flex items-center gap-4 px-10 py-4 bg-gold text-noir font-sans font-semibold text-xs tracking-[0.3em] uppercase hover:bg-gold-light transition-all duration-300">
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
              Dakar. Plus de 25 ans d&apos;excellence au service de votre
              patrimoine.
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
        y: 40,
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
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <PropertySection />
        <StatsSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
