'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  ChevronDown,
  Diamond,
  Shield,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { Component as SterlingGateNav } from '@/components/ui/sterling-gate-kinetic-navigation'
import { TestimonialsColumn } from '@/components/ui/testimonials-columns-1'
import { Component as ParallaxFeatureSection } from '@/components/ui/parallax-scroll-feature-section'
import { VirtualTourSection } from '@/components/ui/virtual-tour-section'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// ─── DATA ──────────────────────────────────────────────────
const stats = [
  { value: 1200, suffix: '+', label: 'Propriétés Vendues', icon: Diamond, hoverColor: '#10B981' },   // Emerald
  { value: 25, suffix: '', label: "Ans d'Excellence", icon: Clock, hoverColor: '#F59E0B' },        // Amber
  { value: 98, suffix: '%', label: 'Clients Satisfaits', icon: Shield, hoverColor: '#3B82F6' },    // Sapphire
  { value: 500, suffix: 'M+', label: "CA Annuel (CFA)", icon: TrendingUp, hoverColor: '#EF4444' }, // Ruby
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
    // Skip entirely on touch devices — no need for custom cursor
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cursor = cursorRef.current
    const dot = dotRef.current
    if (!cursor || !dot) return

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

      // Morphing house icon: draw the paths
      tl.from('.preloader-house-path', {
        strokeDashoffset: (i: number, el: SVGPathElement | SVGLineElement) => {
          const len = el.getTotalLength ? el.getTotalLength() : 100
          gsap.set(el, { strokeDasharray: len })
          return len
        },
        stagger: 0.12,
        duration: 1.2,
        ease: 'power2.inOut',
      }, 0)

      // Fade in brand name
      tl.from('.preloader-brand', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
      }, 0.6)

      // Fade in Keur'Geek credit
      tl.from('.preloader-credit', {
        opacity: 0,
        y: 10,
        duration: 0.6,
        ease: 'power2.out',
      }, 1.0)

      // Counter
      tl.from('.preloader-count', {
        textContent: 0,
        duration: 2.2,
        ease: 'power2.inOut',
        snap: { textContent: 1 },
        onUpdate: function () {
          const progress = Math.round(
            (this.progress() ?? 0) * 100
          )
          const el = ref.current?.querySelector('.preloader-count')
          if (el) el.textContent = String(progress)
        },
      }, 0)

      // Progress line
      tl.to('.preloader-line-fill', {
        scaleX: 1,
        duration: 2.2,
        ease: 'power2.inOut',
      }, 0)

      // Morph icon to filled state
      tl.to('.preloader-house-path', {
        fill: '#CA8A04',
        fillOpacity: 0.15,
        duration: 0.8,
        ease: 'power2.inOut',
        stagger: 0.05,
      }, 1.4)

      // Scale up icon slightly
      tl.to('.preloader-house-icon', {
        scale: 1.08,
        duration: 0.5,
        ease: 'back.out(1.7)',
      }, 1.8)

      // Exit: split top and bottom
      tl.to('.preloader-top', {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut',
      }, '+=0.3')
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
      <div className="preloader-top absolute top-0 left-0 right-0 h-1/2 bg-noir flex flex-col items-end justify-center pb-4 px-8 lg:px-16">
        <div className="font-serif text-8xl font-bold text-cream">
          <span className="preloader-count">0</span>
          <span className="text-gold">%</span>
        </div>
      </div>
      <div className="preloader-bottom absolute bottom-0 left-0 right-0 h-1/2 bg-noir flex flex-col items-center justify-start pt-8 gap-6">
        {/* Morphing House Icon */}
        <div className="preloader-house-icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Roof */}
            <path className="preloader-house-path" d="M32 8L4 32H14V56H50V32H60L32 8Z" stroke="#CA8A04" strokeWidth="1.5" fill="none" />
            {/* Door */}
            <path className="preloader-house-path" d="M26 56V40H38V56" stroke="#CA8A04" strokeWidth="1.5" fill="none" />
            {/* Left window */}
            <path className="preloader-house-path" d="M18 36H24V42H18V36Z" stroke="#CA8A04" strokeWidth="1" fill="none" />
            {/* Right window */}
            <path className="preloader-house-path" d="M40 36H46V42H40V36Z" stroke="#CA8A04" strokeWidth="1" fill="none" />
            {/* Chimney */}
            <path className="preloader-house-path" d="M44 20V14H48V24" stroke="#CA8A04" strokeWidth="1" fill="none" />
          </svg>
        </div>

        {/* Brand name */}
        <div className="preloader-brand flex items-center gap-2">
          <span className="font-serif text-2xl font-bold text-cream tracking-wider">SAMA</span>
          <span className="font-sans text-sm font-semibold text-gold tracking-[0.3em] uppercase border-l border-gold/30 pl-2">IMMO</span>
        </div>

        {/* Progress line */}
        <div className="w-48 h-px bg-noir-mid relative overflow-hidden">
          <div className="preloader-line-fill absolute inset-0 bg-gold origin-left scale-x-0" />
        </div>

        {/* Keur'Geek credit */}
        <div className="preloader-credit flex items-center gap-2">
          <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-warm-gray/30">by</span>
          <span className="font-serif text-xs font-bold text-gold/50">Keur&apos;Geek Digital</span>
        </div>
      </div>
    </div>
  )
}

// ─── NAVBAR (Sterling Gate Kinetic Navigation) ──────────────
function Navbar() {
  return <SterlingGateNav />
}

// ─── HERO ──────────────────────────────────────────────────
function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      // After preloader finishes
      const tl = gsap.timeline({ delay: 2.8 })

      // Clip-path reveal of background container (poster + video)
      tl.fromTo(
        '.hero-bg-img',
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.5,
          ease: 'power4.inOut',
        }
      )
      tl.fromTo(
        '.hero-video',
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.5,
          ease: 'power4.inOut',
        },
        0
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

      // Parallax on scroll — applies to both poster and video
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
      gsap.to('.hero-video', {
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
      {/* Background video with clip-path reveal + poster fallback */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Poster image shown instantly while video loads */}
        <div
          className="hero-bg-img absolute inset-0 bg-cover bg-center scale-110 transition-opacity duration-1000"
          style={{ backgroundImage: "url('/hero-background.jpg')" }}
        />
        <video
          className="hero-video absolute inset-0 w-full h-full object-cover scale-110 opacity-0 transition-opacity duration-1000"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={(e) => {
            // Fade in video, fade out poster
            const video = e.currentTarget
            video.style.opacity = '1'
            const poster = video.parentElement?.querySelector('.hero-bg-img') as HTMLElement
            if (poster) {
              poster.style.opacity = '0'
              setTimeout(() => poster.style.display = 'none', 1000)
            }
          }}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-noir/60 via-noir/40 to-noir" />
        <div className="absolute inset-0 bg-gradient-to-r from-noir/70 via-transparent to-noir/30" />
      </div>

      {/* Decorative vertical lines */}
      <div className="absolute top-[20%] right-[10%] w-px h-60 bg-gradient-to-b from-transparent via-gold/30 to-transparent hidden lg:block" />
      <div className="absolute bottom-[20%] left-[6%] w-px h-40 bg-gradient-to-b from-transparent via-gold/15 to-transparent hidden lg:block" />

      <div className="hero-content relative z-10 h-full flex flex-col justify-end pb-20 sm:pb-24 lg:pb-36 px-5 sm:px-6 lg:px-16 max-w-[1400px] mx-auto">
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

// ─── PROPERTY SECTION — PARALLAX SCROLL FEATURE ─────────
function PropertySection() {
  return <ParallaxFeatureSection />
}

// ─── STATS — KINETIC DATA CATHEDRAL ────────────────────────
function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      const track = trackRef.current
      if (!section || !track) return

      // Pin the entire section — scroll drives the animation
      // Reduce scroll distance on mobile for better UX
      const isMobile = window.innerWidth < 768
      const totalScroll = isMobile ? window.innerHeight * 1.5 : window.innerHeight * 4

      // Master timeline driven by scroll
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalScroll}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })

      // ─── Scene 1: Section header reveal ───
      masterTl.from('.stats-label', {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      })
      masterTl.from('.stats-title-line', {
        y: 100,
        rotationX: -40,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out',
      }, '-=0.6')
      masterTl.from('.stats-desc', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.5')

      // Gold horizontal line sweep
      masterTl.from('.stats-horiz-line', {
        scaleX: 0,
        duration: 1.5,
        ease: 'power4.inOut',
      }, '-=0.6')

      // ─── Scene 2: Each stat reveals one by one ───
      const statItems = track.querySelectorAll('.kinetic-stat')
      statItems.forEach((stat, i) => {
        const ring = stat.querySelector('.progress-ring-circle')
        const number = stat.querySelector('.stat-number')
        const suffix = stat.querySelector('.stat-suffix')
        const label = stat.querySelector('.stat-label-text')
        const icon = stat.querySelector('.stat-icon-glow')
        const deco = stat.querySelector('.stat-deco-line')

        // Clip-path reveal from center
        masterTl.fromTo(stat, {
          clipPath: 'inset(50% 50% 50% 50%)',
          opacity: 0,
          scale: 0.8,
        }, {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: 'power4.inOut',
        }, i === 0 ? '+=0.3' : '-=0.9')

        // Ring progress fill
        if (ring) {
          const circumference = (ring as SVGCircleElement).getTotalLength?.() ?? 283
          gsap.set(ring, { strokeDasharray: circumference, strokeDashoffset: circumference })
          masterTl.to(ring, {
            strokeDashoffset: 0,
            duration: 2,
            ease: 'power2.inOut',
          }, '-=1')
        }

        // Number scramble decode effect
        if (number) {
          masterTl.fromTo(number, {
            opacity: 0,
            scale: 0.5,
            filter: 'blur(10px)',
          }, {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.2,
            ease: 'back.out(1.7)',
          }, '-=1.5')
        }

        // Suffix slide in
        if (suffix) {
          masterTl.from(suffix, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out',
          }, '-=0.8')
        }

        // Label fade up
        if (label) {
          masterTl.from(label, {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
          }, '-=0.5')
        }

        // Icon glow pulse
        if (icon) {
          masterTl.fromTo(icon, {
            opacity: 0,
            scale: 0,
          }, {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(2)',
          }, '-=1')
        }

        // Decorative line sweep
        if (deco) {
          masterTl.fromTo(deco, {
            scaleX: 0,
            transformOrigin: 'left center',
          }, {
            scaleX: 1,
            duration: 0.8,
            ease: 'power4.inOut',
          }, '-=0.6')
        }
      })

      // ─── Scene 3: Giant background numbers parallax ───
      masterTl.to('.stats-giant-1', {
        x: -200,
        y: -80,
        opacity: 0.08,
        duration: 3,
        ease: 'none',
      }, 0)
      masterTl.to('.stats-giant-2', {
        x: 150,
        y: 60,
        opacity: 0.06,
        duration: 3,
        ease: 'none',
      }, 0.5)

      // ─── Scene 4: Bottom gold line + fade out on exit ───
      masterTl.from('.stats-bottom-line', {
        scaleX: 0,
        duration: 1.5,
        ease: 'power4.inOut',
      }, '-=1')

      // Floating decorative elements parallax on scroll
      gsap.to('.stats-float-1', {
        y: -120,
        rotation: 45,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalScroll}`,
          scrub: 1,
        },
      })
      gsap.to('.stats-float-2', {
        y: -80,
        rotation: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalScroll}`,
          scrub: 1,
        },
      })
      gsap.to('.stats-float-3', {
        y: -150,
        x: 50,
        rotation: 60,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalScroll}`,
          scrub: 1,
        },
      })
    },
    { scope: sectionRef }
  )

  // Progress percentages for rings (normalized to 0-100)
  const progressValues = [85, 60, 98, 65]

  return (
    <section
      ref={sectionRef}
      id="chiffres"
      className="bg-noir-light relative overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      {/* Giant background numbers — cinematic watermark */}
      <div className="stats-giant-1 absolute -top-20 -left-10 font-serif text-[30rem] lg:text-[45rem] font-bold text-cream/[0.03] leading-none select-none pointer-events-none will-change-transform">
        25
      </div>
      <div className="stats-giant-2 absolute -bottom-40 -right-10 font-serif text-[20rem] lg:text-[35rem] font-bold text-gold/[0.04] leading-none select-none pointer-events-none will-change-transform">
        98
      </div>

      {/* Floating decorative elements */}
      <div className="stats-float-1 absolute top-[15%] right-[8%] w-32 h-32 border border-gold/10 rotate-45 will-change-transform hidden lg:block" />
      <div className="stats-float-2 absolute bottom-[20%] left-[5%] w-20 h-20 border border-cream/5 rounded-full will-change-transform hidden lg:block" />
      <div className="stats-float-3 absolute top-[60%] right-[25%] w-2 h-2 bg-gold/20 rounded-full will-change-transform hidden lg:block" />
      <div className="stats-float-3 absolute top-[40%] left-[15%] w-1 h-1 bg-gold/30 rounded-full will-change-transform hidden lg:block" />

      {/* Vertical decorative lines */}
      <div className="absolute top-0 left-[25%] w-px h-full bg-gradient-to-b from-transparent via-gold/10 to-transparent hidden lg:block" />
      <div className="absolute top-0 right-[33%] w-px h-full bg-gradient-to-b from-transparent via-noir-mid/30 to-transparent hidden lg:block" />

      <div ref={trackRef} className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20 lg:py-32">
        {/* Section header — cinematic reveal */}
        <div className="mb-16 lg:mb-24">
          <span className="stats-label block font-sans text-[10px] tracking-[0.5em] uppercase text-gold mb-6">
            Performance
          </span>
          <h2 className="stats-title-line font-serif text-6xl sm:text-8xl lg:text-9xl font-bold text-cream leading-[0.85]">
            Nos
          </h2>
          <h2 className="stats-title-line font-serif text-6xl sm:text-8xl lg:text-9xl font-bold italic text-gold leading-[0.85]">
            Chiffres
          </h2>
          <p className="stats-desc font-sans text-sm lg:text-base text-warm-gray/50 max-w-md mt-6 leading-relaxed">
            Des résultats qui parlent d&apos;eux-mêmes. Chaque nombre raconte une histoire d&apos;excellence et de confiance.
          </p>
        </div>

        {/* Gold horizontal line */}
        <div className="stats-horiz-line w-full h-px bg-gradient-to-r from-gold/40 via-gold to-gold/40 mb-16 lg:mb-20 origin-left" />

        {/* Stats grid — kinetic cards with SVG rings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <KineticStatCard
              key={stat.label}
              stat={stat}
              index={i}
              progress={progressValues[i]}
            />
          ))}
        </div>

        {/* Bottom gold line */}
        <div className="stats-bottom-line w-full h-px bg-gradient-to-r from-gold/40 via-gold to-gold/40 mt-16 lg:mt-20 origin-left" />

        {/* Bottom tagline */}
        <div className="mt-10 text-center">
          <span className="font-sans text-[10px] tracking-[0.5em] uppercase text-warm-gray/30">
            Excellence depuis 1999 — Dakar, Sénégal
          </span>
        </div>
      </div>
    </section>
  )
}

function KineticStatCard({
  stat,
  index,
  progress,
}: {
  stat: (typeof stats)[0]
  index: number
  progress: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref)
  const count = useCounter(stat.value, 3, isInView)

  // SVG ring calculations
  const radius = 58
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  // Parse hover color for rgba variants
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return { r, g, b }
  }
  const rgb = hexToRgb(stat.hoverColor)

  return (
    <div
      ref={ref}
      className="kinetic-stat relative group cursor-default"
      style={{ '--stat-hover': stat.hoverColor } as React.CSSProperties}
    >
      <div className="kinetic-stat-inner relative border border-noir-mid/50 p-8 lg:p-10 overflow-hidden transition-colors duration-700"
        style={{
          '--stat-hover-r': rgb.r,
          '--stat-hover-g': rgb.g,
          '--stat-hover-b': rgb.b,
        } as React.CSSProperties}
      >
        {/* Background glow on hover */}
        <div className="stat-bg-glow absolute inset-0 transition-all duration-700" />

        {/* Index number watermark */}
        <div className="absolute -top-3 -right-2 font-serif text-[8rem] lg:text-[10rem] font-bold text-cream/[0.02] leading-none select-none pointer-events-none stat-watermark transition-colors duration-1000">
          {String(index + 1).padStart(2, '0')}
        </div>

        {/* SVG Progress Ring */}
        <div className="relative w-32 h-32 lg:w-36 lg:h-36 mx-auto mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
            {/* Background ring */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="rgba(202,138,4,0.08)"
              strokeWidth="2"
              className="stat-ring-bg"
            />
            {/* Progress ring */}
            <circle
              className="progress-ring-circle"
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke="rgba(202,138,4,0.6)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{
                transition: 'stroke-dashoffset 0.1s',
                filter: 'drop-shadow(0 0 6px rgba(202,138,4,0.3))',
              }}
            />
          </svg>
          {/* Icon centered in ring */}
          <div className="stat-icon-glow absolute inset-0 flex items-center justify-center">
            <stat.icon
              size={28}
              className="stat-icon text-gold/50 transition-colors duration-500"
            />
          </div>
        </div>

        {/* Number with suffix */}
        <div className="text-center mb-3">
          <span className="stat-number font-serif text-5xl lg:text-6xl font-bold text-cream transition-colors duration-700 inline-block">
            {count}
          </span>
          <span className="stat-suffix font-serif text-3xl lg:text-4xl font-bold text-gold/50 transition-colors duration-700">
            {stat.suffix}
          </span>
        </div>

        {/* Label */}
        <div className="stat-label-text font-sans text-[10px] tracking-[0.3em] uppercase text-warm-gray/40 text-center transition-colors duration-500">
          {stat.label}
        </div>

        {/* Decorative bottom line */}
        <div className="stat-deco-line w-8 h-px bg-gold/30 mx-auto mt-4 transition-all duration-700" />

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-transparent transition-colors duration-700 stat-corner-tl" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-transparent transition-colors duration-700 stat-corner-br" />
      </div>
    </div>
  )
}

// ─── TESTIMONIALS — INFINITE SCROLLING COLUMNS ────────────
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
    },
    { scope: sectionRef }
  )

  // Testimonials data with Unsplash avatar images
  const columnTestimonials = [
    {
      text: "SAMA IMMO a trouvé la villa de nos rêves aux Almadies en moins de deux semaines. Un service irréprochable, une attention aux détails remarquable.",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=face",
      name: "Aminata Diallo",
      role: "Avocate",
    },
    {
      text: "Professionnalisme et expertise caractérisent cette agence. L'achat de notre penthouse au Plateau s'est déroulé sans le moindre stress.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
      name: "Jean-Pierre Martin",
      role: "Directeur d'entreprise",
    },
    {
      text: "Grâce à SAMA IMMO, nous avons découvert une résidence exceptionnelle à Mermoz. L'équipe est à l'écoute et d'un conseil avisé.",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face",
      name: "Fatou Sow",
      role: "Médecin",
    },
    {
      text: "La connaissance du marché dakarois est impressionnante. Ils ont identifié la villa parfaite pour notre famille avant même qu'elle soit listée.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
      name: "Moussa Ba",
      role: "Architecte",
    },
    {
      text: "Un accompagnement sur mesure du début à la fin. Leur réseau de partenaires notariés et juridiques a simplifié toutes les démarches.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
      name: "Isabelle Dupont",
      role: "Avocate d'affaires",
    },
    {
      text: "J'ai investi dans trois propriétés grâce à SAMA IMMO. Chaque fois, le retour sur investissement a dépassé mes attentes les plus optimistes.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      name: "Oumar Sy",
      role: "Investisseur immobilier",
    },
    {
      text: "La discrétion et le professionnalisme de l'équipe sont remarquables. Ils comprennent les exigences d'une clientèle exigeante et y répondent avec élégance.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face",
      name: "Mariama Ndiaye",
      role: "Chef d'entreprise",
    },
    {
      text: "Notre villa à Ngor est un bijou. SAMA IMMO a su capturer notre vision et traduire nos envies en une propriété qui nous ressemble véritablement.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&h=80&fit=crop&crop=face",
      name: "Philippe Leclerc",
      role: "Consul honoraire",
    },
    {
      text: "De la première visite à la remise des clés, tout a été fluide. L'équipe est réactive, disponible et d'une courtoisie exemplaire. Je recommande vivement.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
      name: "Aïssatou Diop",
      role: "Directrice financière",
    },
  ]

  const firstColumn = columnTestimonials.slice(0, 3)
  const secondColumn = columnTestimonials.slice(3, 6)
  const thirdColumn = columnTestimonials.slice(6, 9)

  return (
    <section
      ref={sectionRef}
      id="temoignages"
      className="bg-noir py-28 lg:py-44 relative overflow-hidden"
    >
      {/* Decorative vertical lines */}
      <div className="absolute top-0 left-[20%] w-px h-full bg-gradient-to-b from-transparent via-gold/8 to-transparent hidden lg:block" />
      <div className="absolute top-0 right-[20%] w-px h-full bg-gradient-to-b from-transparent via-gold/5 to-transparent hidden lg:block" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="mb-16 lg:mb-24">
          <span className="testi-title-line block font-sans text-[10px] tracking-[0.5em] uppercase text-gold mb-6">
            Témoignages
          </span>
          <h2 className="testi-title-line font-serif text-5xl sm:text-7xl lg:text-8xl font-bold text-cream leading-[0.9]">
            Ils Nous
          </h2>
          <h2 className="testi-title-line font-serif text-5xl sm:text-7xl lg:text-8xl font-bold text-gold italic leading-[0.9]">
            Font Confiance
          </h2>
          <p className="testi-title-line font-sans text-sm lg:text-base text-warm-gray/40 max-w-lg mt-6 leading-relaxed">
            Découvrez les témoignages de ceux qui nous ont fait confiance. Chaque histoire reflète notre engagement envers l&apos;excellence.
          </p>

          {/* Gold line */}
          <div className="testi-title-line w-24 h-px bg-gold mt-8 origin-left" />
        </div>

        {/* Infinite scrolling columns */}
        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={18} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={22} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={20} />
        </div>

        {/* Bottom decorative tagline */}
        <div className="mt-12 text-center">
          <span className="font-sans text-[10px] tracking-[0.5em] uppercase text-warm-gray/25">
            La confiance se mérite — l&apos;excellence se prouve
          </span>
        </div>
      </div>
    </section>
  )
}

// ─── CONTACT — IMMERSIVE SPLIT SECTION ────────────────────
function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      // Giant background text parallax
      gsap.to('.contact-giant-text', {
        xPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })

      // Header reveal
      gsap.from('.contact-label', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 65%' },
      })
      gsap.from('.contact-title-line', {
        y: 100,
        rotationX: -40,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 60%' },
      })
      gsap.from('.contact-desc', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 55%' },
      })

      // Gold line sweep
      gsap.from('.contact-gold-line', {
        scaleX: 0,
        duration: 1.5,
        ease: 'power4.inOut',
        scrollTrigger: { trigger: section, start: 'top 55%' },
      })

      // Contact cards stagger reveal
      gsap.from('.contact-card', {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 50%' },
      })

      // Form fields stagger
      gsap.from('.form-field', {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 45%' },
      })

      // Floating decorative elements
      gsap.to('.contact-float-1', {
        y: -80,
        rotation: 45,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
      gsap.to('.contact-float-2', {
        y: -60,
        x: 30,
        rotation: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="bg-noir-light relative overflow-hidden py-28 lg:py-44"
    >
      {/* Giant background watermark text */}
      <div className="contact-giant-text absolute top-[10%] -left-10 font-serif text-[20rem] lg:text-[35rem] font-bold text-cream/[0.02] leading-none select-none pointer-events-none whitespace-nowrap will-change-transform">
        Contact
      </div>

      {/* Floating decorative elements */}
      <div className="contact-float-1 absolute top-[20%] right-[5%] w-40 h-40 border border-gold/8 rotate-45 will-change-transform hidden lg:block" />
      <div className="contact-float-2 absolute bottom-[15%] left-[8%] w-24 h-24 border border-cream/[0.03] rounded-full will-change-transform hidden lg:block" />

      {/* Vertical decorative lines */}
      <div className="absolute top-0 left-[30%] w-px h-full bg-gradient-to-b from-transparent via-gold/8 to-transparent hidden lg:block" />
      <div className="absolute top-0 right-[25%] w-px h-full bg-gradient-to-b from-transparent via-noir-mid/20 to-transparent hidden lg:block" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <span className="contact-label block font-sans text-[10px] tracking-[0.5em] uppercase text-gold mb-6">
            Contact
          </span>
          <h2 className="contact-title-line font-serif text-5xl sm:text-7xl lg:text-8xl font-bold text-cream leading-[0.9]">
            Prenons
          </h2>
          <h2 className="contact-title-line font-serif text-5xl sm:text-7xl lg:text-8xl font-bold text-gold italic leading-[0.9]">
            Contact
          </h2>
          <p className="contact-desc font-sans text-sm lg:text-base text-warm-gray/40 max-w-lg mt-6 leading-relaxed">
            Notre équipe d&apos;experts vous accompagne dans votre projet immobilier de luxe. Chaque demande mérite une attention personnelle.
          </p>
          <div className="contact-gold-line w-24 h-px bg-gold mt-8 origin-left" />
        </div>

        {/* Split layout: info cards left, form right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left — Contact cards */}
          <div className="lg:col-span-5 space-y-5">
            {[
              {
                icon: Phone,
                title: 'Téléphone',
                value: '+221 33 800 00 00',
                sub: 'Lun — Sam, 8h à 19h',
                accent: '#10B981',
              },
              {
                icon: Mail,
                title: 'Email',
                value: 'contact@sammaimmo.sn',
                sub: 'Réponse sous 24h',
                accent: '#3B82F6',
              },
              {
                icon: MapPin,
                title: 'Adresse',
                value: '45 Boulevard de la République',
                sub: 'Plateau, Dakar, Sénégal',
                accent: '#F59E0B',
              },
            ].map((item, idx) => {
              const hexToRgb = (hex: string) => ({
                r: parseInt(hex.slice(1, 3), 16),
                g: parseInt(hex.slice(3, 5), 16),
                b: parseInt(hex.slice(5, 7), 16),
              })
              const rgb = hexToRgb(item.accent)
              return (
                <div
                  key={item.title}
                  className="contact-card group cursor-default relative overflow-hidden border border-noir-mid/50 p-6 lg:p-8 hover:border-opacity-80 transition-all duration-700"
                  style={{
                    '--card-accent': item.accent,
                    '--card-accent-r': rgb.r,
                    '--card-accent-g': rgb.g,
                    '--card-accent-b': rgb.b,
                  } as React.CSSProperties}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-[rgba(var(--card-accent-r),var(--card-accent-g),var(--card-accent-b),0.04)] group-hover:via-transparent group-hover:to-[rgba(var(--card-accent-r),var(--card-accent-g),var(--card-accent-b),0.02)] transition-all duration-700" />

                  <div className="relative z-10 flex items-start gap-5">
                    {/* Icon container */}
                    <div className="w-12 h-12 border border-noir-mid flex items-center justify-center flex-shrink-0 group-hover:border-[var(--card-accent)] transition-colors duration-500">
                      <item.icon
                        size={18}
                        className="text-gold/60 group-hover:text-[var(--card-accent)] transition-colors duration-500"
                      />
                    </div>

                    <div>
                      <div className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold/60 mb-1 group-hover:text-[var(--card-accent)] transition-colors duration-500">
                        {item.title}
                      </div>
                      <div className="font-serif text-lg text-cream group-hover:text-cream transition-colors duration-300">
                        {item.value}
                      </div>
                      <div className="font-sans text-xs text-warm-gray/50 mt-1">
                        {item.sub}
                      </div>
                    </div>
                  </div>

                  {/* Accent line on hover */}
                  <div className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full bg-[var(--card-accent)] transition-all duration-700" />
                </div>
              )
            })}

            {/* Decorative quote */}
            <div className="contact-card pt-6 pl-2">
              <div className="font-serif text-3xl lg:text-4xl text-gold/10 leading-tight italic select-none">
                &ldquo;L&apos;excellence<br />est un détail.&rdquo;
              </div>
              <div className="font-sans text-[10px] tracking-[0.3em] uppercase text-warm-gray/20 mt-3">
                — SAMA IMMO
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="lg:col-span-7">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="form-field">
                  <label className="block font-sans text-[10px] tracking-[0.3em] uppercase text-gold/60 mb-2">
                    Nom complet
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Votre nom"
                      className="w-full bg-transparent border-b border-noir-mid px-1 py-3 font-sans text-sm text-cream placeholder:text-warm-gray/30 focus:border-gold outline-none transition-colors duration-500 peer"
                    />
                    <div className="absolute bottom-0 left-0 h-px w-0 bg-gold peer-focus:w-full transition-all duration-500" />
                  </div>
                </div>
                <div className="form-field">
                  <label className="block font-sans text-[10px] tracking-[0.3em] uppercase text-gold/60 mb-2">
                    Téléphone
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="+221 XX XXX XX XX"
                      className="w-full bg-transparent border-b border-noir-mid px-1 py-3 font-sans text-sm text-cream placeholder:text-warm-gray/30 focus:border-gold outline-none transition-colors duration-500 peer"
                    />
                    <div className="absolute bottom-0 left-0 h-px w-0 bg-gold peer-focus:w-full transition-all duration-500" />
                  </div>
                </div>
              </div>
              <div className="form-field">
                <label className="block font-sans text-[10px] tracking-[0.3em] uppercase text-gold/60 mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    className="w-full bg-transparent border-b border-noir-mid px-1 py-3 font-sans text-sm text-cream placeholder:text-warm-gray/30 focus:border-gold outline-none transition-colors duration-500 peer"
                  />
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-gold peer-focus:w-full transition-all duration-500" />
                </div>
              </div>
              <div className="form-field">
                <label className="block font-sans text-[10px] tracking-[0.3em] uppercase text-gold/60 mb-2">
                  Type de propriété
                </label>
                <div className="relative">
                  <select className="w-full bg-transparent border-b border-noir-mid px-1 py-3 font-sans text-sm text-cream focus:border-gold outline-none transition-colors duration-500 appearance-none cursor-pointer">
                    <option value="" className="bg-noir-light">Sélectionner</option>
                    <option value="villa" className="bg-noir-light">Villa</option>
                    <option value="penthouse" className="bg-noir-light">Penthouse</option>
                    <option value="appartement" className="bg-noir-light">Appartement</option>
                    <option value="terrain" className="bg-noir-light">Terrain</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gold/40 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-gold peer-focus:w-full transition-all duration-500" />
                </div>
              </div>
              <div className="form-field">
                <label className="block font-sans text-[10px] tracking-[0.3em] uppercase text-gold/60 mb-2">
                  Message
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    placeholder="Décrivez votre projet immobilier..."
                    className="w-full bg-transparent border-b border-noir-mid px-1 py-3 font-sans text-sm text-cream placeholder:text-warm-gray/30 focus:border-gold outline-none transition-colors duration-500 resize-none peer"
                  />
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-gold peer-focus:w-full transition-all duration-500" />
                </div>
              </div>
              <div className="form-field pt-4 flex items-center justify-between">
                <button className="magnetic group inline-flex items-center gap-4 px-12 py-4 bg-gold text-noir font-sans font-semibold text-xs tracking-[0.3em] uppercase hover:bg-gold-light transition-all duration-300">
                  Envoyer
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
                <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-warm-gray/20 hidden sm:block">
                  Nous répondons sous 24h
                </span>
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
                SAMA <span className="text-gold">IMMO</span>
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
                contact@sammaimmo.sn
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
            &copy; 2026 SAMA IMMO. Tous droits réservés.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
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

        {/* Keur'Geek Digital credit */}
        <div className="mt-8 pt-6 border-t border-noir-mid/50 flex flex-col sm:flex-row items-center justify-center gap-3">
          <span className="font-sans text-[10px] tracking-[0.15em] uppercase text-warm-gray/25">
            Site conçu et développé par
          </span>
          <span className="font-serif text-sm font-bold text-gold/60 hover:text-gold transition-colors duration-300 cursor-default">
            Keur&apos;Geek Digital
          </span>
          <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-warm-gray/20">
            — Startup Sénégalaise · IA &amp; Solutions Digitales pour PME
          </span>
        </div>
      </div>
    </footer>
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
        <VirtualTourSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
