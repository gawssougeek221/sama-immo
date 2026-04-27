"use client";
import * as React from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface PropertyData {
  title: string;
  image: string;
  category: string;
  year: string;
  description: string;
  price: string;
  currency: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
}

const PROPERTY_DATA: PropertyData[] = [
  {
    title: "Villa Luxe Almadies",
    image: "/villa-ngor.jpg",
    category: "Villa",
    year: "2025",
    description: "Vue océan, piscine chauffée, jardin paysager",
    price: "850 000 000",
    currency: "CFA",
    location: "Almadies, Dakar",
    bedrooms: 5,
    bathrooms: 4,
    area: 520,
  },
  {
    title: "Penthouse Plateau",
    image: "/penthouse-plateau.jpg",
    category: "Penthouse",
    year: "2024",
    description: "Vue Atlantique, terrasse rooftop, marbre & bois",
    price: "650 000 000",
    currency: "CFA",
    location: "Plateau, Dakar",
    bedrooms: 3,
    bathrooms: 2,
    area: 350,
  },
  {
    title: "Résidence Mermoz",
    image: "/residence-mermoz.jpg",
    category: "Appartement",
    year: "2024",
    description: "Quartier résidentiel, cuisine équipée, parking",
    price: "520 000 000",
    currency: "CFA",
    location: "Mermoz, Dakar",
    bedrooms: 3,
    bathrooms: 2,
    area: 300,
  },
  {
    title: "Villa Prestige Almadies",
    image: "/villa-almadies.jpg",
    category: "Villa",
    year: "2023",
    description: "Piscine à débordement, domotique intégrée",
    price: "980 000 000",
    currency: "CFA",
    location: "Almadies, Dakar",
    bedrooms: 6,
    bathrooms: 5,
    area: 680,
  },
  {
    title: "Appartement Plateau",
    image: "/appartement-plateau.jpg",
    category: "Appartement",
    year: "2024",
    description: "Lumineux, climatisé, idéal investissement",
    price: "380 000 000",
    currency: "CFA",
    location: "Plateau, Dakar",
    bedrooms: 2,
    bathrooms: 1,
    area: 180,
  },
];

export function ArgentLoopInfiniteSlider() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const projectRefs = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const minimapImgRefs = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const minimapInfoRefs = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const progressRef = React.useRef(0);
  const currentIndexRef = React.useRef(0);
  const [activeIndex, setActiveIndex] = React.useState(0);

  const totalProperties = PROPERTY_DATA.length;

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Each property gets 1 viewport height of scroll distance
    const scrollDistance = window.innerHeight * totalProperties;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${scrollDistance}`,
      pin: true,
      anticipatePin: 1,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        progressRef.current = progress;

        // Calculate which property is active
        const rawIndex = progress * (totalProperties - 1);
        const index = Math.round(rawIndex);
        if (index !== currentIndexRef.current) {
          currentIndexRef.current = index;
          setActiveIndex(index);
        }

        // Update project positions
        projectRefs.current.forEach((el, i) => {
          const offset = (i - rawIndex);
          const y = offset * window.innerHeight;
          const opacity = Math.abs(offset) < 0.5 ? 1 : Math.max(0, 1 - Math.abs(offset) * 1.5);
          const scale = Math.abs(offset) < 0.5 ? 1 : 0.95;
          el.style.transform = `translateY(${y}px) scale(${scale})`;
          el.style.opacity = String(opacity);

          // Parallax on images
          const img = el.querySelector(".project-parallax-img") as HTMLElement | null;
          if (img) {
            const parallaxY = offset * -0.15 * window.innerHeight;
            img.style.transform = `translateY(${parallaxY}px) scale(1.2)`;
          }
        });

        // Update minimap positions
        minimapImgRefs.current.forEach((el, i) => {
          const offset = (i - rawIndex);
          const y = offset * 280;
          el.style.transform = `translateY(${y}px)`;

          const img = el.querySelector("img") as HTMLElement | null;
          if (img) {
            const parallaxY = offset * -0.1 * 280;
            img.style.transform = `translateY(${parallaxY}px) scale(1.15)`;
          }
        });

        minimapInfoRefs.current.forEach((el, i) => {
          const offset = (i - rawIndex);
          const y = offset * 280;
          el.style.transform = `translateY(${y}px)`;
        });
      },
    });

    const onResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      trigger.kill();
      window.removeEventListener("resize", onResize);
    };
  }, [totalProperties]);

  return (
    <section
      id="proprietes"
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden bg-noir"
    >
      {/* Section header overlay */}
      <div className="property-section-header">
        <div className="font-sans text-[10px] tracking-[0.5em] uppercase text-gold mb-2">
          Collection
        </div>
        <h2 className="font-serif text-3xl lg:text-5xl font-bold text-cream">
          Nos Propriétés
        </h2>
        <div className="w-12 h-px bg-gold mt-3" />
      </div>

      {/* Progress counter */}
      <div className="property-progress-counter">
        <span className="property-progress-current">
          {String(activeIndex + 1).padStart(2, "0")}
        </span>
        <span className="property-progress-separator">/</span>
        <span className="property-progress-total">
          {String(totalProperties).padStart(2, "0")}
        </span>
      </div>

      {/* Scroll hint */}
      <div className="property-scroll-hint">
        <div className="property-scroll-hint-line" />
        <span className="property-scroll-hint-text">Scroll</span>
      </div>

      {/* Main project images — full viewport */}
      <ul className="project-list">
        {PROPERTY_DATA.map((data, i) => (
          <div
            key={i}
            className="project"
            ref={(el) => {
              if (el) projectRefs.current.set(i, el);
              else projectRefs.current.delete(i);
            }}
            style={{
              opacity: i === 0 ? 1 : 0,
            }}
          >
            <img
              className="project-parallax-img"
              src={data.image}
              alt={data.title}
              loading={i < 2 ? "eager" : "lazy"}
              draggable={false}
            />
            {/* Overlay gradient */}
            <div className="project-overlay" />
            {/* Property info on image */}
            <div className="project-info">
              <span className="project-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="project-category">{data.category}</span>
              <h3 className="project-title">{data.title}</h3>
              <div className="project-price">
                <span className="project-price-value">{data.price}</span>
                <span className="project-price-currency">{data.currency}</span>
              </div>
              <span className="project-location">{data.location}</span>
            </div>
          </div>
        ))}
      </ul>

      {/* Minimap sidebar */}
      <div className="minimap">
        <div className="minimap-wrapper">
          <div className="minimap-img-preview">
            {PROPERTY_DATA.map((data, i) => (
              <div
                key={i}
                className={`minimap-img-item ${i === activeIndex ? "minimap-img-item--active" : ""}`}
                ref={(el) => {
                  if (el) minimapImgRefs.current.set(i, el);
                  else minimapImgRefs.current.delete(i);
                }}
              >
                <img src={data.image} alt={data.title} />
              </div>
            ))}
          </div>
          <div className="minimap-info-list">
            {PROPERTY_DATA.map((data, i) => (
              <div
                key={i}
                className={`minimap-item-info ${i === activeIndex ? "minimap-item-info--active" : ""}`}
                ref={(el) => {
                  if (el) minimapInfoRefs.current.set(i, el);
                  else minimapInfoRefs.current.delete(i);
                }}
              >
                <div className="minimap-item-info-row">
                  <p className="minimap-num">{String(i + 1).padStart(2, "0")}</p>
                  <p className="minimap-title">{data.title}</p>
                </div>
                <div className="minimap-item-info-row">
                  <p className="minimap-category">{data.category}</p>
                  <p className="minimap-year">{data.location}</p>
                </div>
                <div className="minimap-item-info-row">
                  <p className="minimap-desc">{data.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
