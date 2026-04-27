"use client";
import * as React from "react";

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

const CONFIG = {
  SCROLL_SPEED: 0.75,
  LERP_FACTOR: 0.05,
  BUFFER_SIZE: 5,
  MAX_VELOCITY: 150,
  SNAP_DURATION: 500,
};

const lerp = (start: number, end: number, factor: number) =>
  start + (end - start) * factor;

const getPropertyData = (index: number) => {
  const i =
    ((Math.abs(index) % PROPERTY_DATA.length) + PROPERTY_DATA.length) %
    PROPERTY_DATA.length;
  return PROPERTY_DATA[i];
};

const getPropertyNumber = (index: number) => {
  return (
    ((Math.abs(index) % PROPERTY_DATA.length) + PROPERTY_DATA.length) %
      PROPERTY_DATA.length +
    1
  )
    .toString()
    .padStart(2, "0");
};

export function ArgentLoopInfiniteSlider() {
  const [visibleRange, setVisibleRange] = React.useState({
    min: -CONFIG.BUFFER_SIZE,
    max: CONFIG.BUFFER_SIZE,
  });

  const state = React.useRef({
    currentY: 0,
    targetY: 0,
    isDragging: false,
    isSnapping: false,
    snapStart: { time: 0, y: 0, target: 0 },
    lastScrollTime: Date.now(),
    dragStart: { y: 0, scrollY: 0 },
    projectHeight: 0,
    minimapHeight: 280,
  });

  const projectsRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const minimapRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const infoRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const requestRef = React.useRef<number>();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const renderedRange = React.useRef({
    min: -CONFIG.BUFFER_SIZE,
    max: CONFIG.BUFFER_SIZE,
  });

  const updateParallax = (
    img: HTMLImageElement | null,
    scroll: number,
    index: number,
    height: number
  ) => {
    if (!img) return;
    if (!img.dataset.parallaxCurrent) {
      img.dataset.parallaxCurrent = "0";
    }
    let current = parseFloat(img.dataset.parallaxCurrent);
    const target = (-scroll - index * height) * 0.2;
    current = lerp(current, target, 0.1);
    if (Math.abs(current - target) > 0.01) {
      img.style.transform = `translateY(${current}px) scale(1.5)`;
      img.dataset.parallaxCurrent = current.toString();
    }
  };

  const updateSnap = () => {
    const s = state.current;
    const progress = Math.min(
      (Date.now() - s.snapStart.time) / CONFIG.SNAP_DURATION,
      1
    );
    const eased = 1 - Math.pow(1 - progress, 3);
    s.targetY = s.snapStart.y + (s.snapStart.target - s.snapStart.y) * eased;
    if (progress >= 1) s.isSnapping = false;
  };

  const snapToProject = () => {
    const s = state.current;
    const current = Math.round(-s.targetY / s.projectHeight);
    const target = -current * s.projectHeight;
    s.isSnapping = true;
    s.snapStart = {
      time: Date.now(),
      y: s.targetY,
      target: target,
    };
  };

  const updatePositions = () => {
    const s = state.current;
    const minimapY = (s.currentY * s.minimapHeight) / s.projectHeight;

    projectsRef.current.forEach((el, index) => {
      const y = index * s.projectHeight + s.currentY;
      el.style.transform = `translateY(${y}px)`;
      const img = el.querySelector("img");
      updateParallax(img, s.currentY, index, s.projectHeight);
    });

    minimapRef.current.forEach((el, index) => {
      const y = index * s.minimapHeight + minimapY;
      el.style.transform = `translateY(${y}px)`;
      const img = el.querySelector("img");
      if (img) {
        updateParallax(img, minimapY, index, s.minimapHeight);
      }
    });

    infoRef.current.forEach((el, index) => {
      const y = index * s.minimapHeight + minimapY;
      el.style.transform = `translateY(${y}px)`;
    });
  };

  const animate = () => {
    const s = state.current;
    const now = Date.now();

    if (!s.isSnapping && !s.isDragging && now - s.lastScrollTime > 100) {
      const snapPoint =
        -Math.round(-s.targetY / s.projectHeight) * s.projectHeight;
      if (Math.abs(s.targetY - snapPoint) > 1) snapToProject();
    }

    if (s.isSnapping) updateSnap();
    if (!s.isDragging) {
      s.currentY += (s.targetY - s.currentY) * CONFIG.LERP_FACTOR;
    }

    updatePositions();
  };

  const animationLoop = () => {
    animate();
    const s = state.current;
    const currentIndex = Math.round(-s.targetY / s.projectHeight);
    const min = currentIndex - CONFIG.BUFFER_SIZE;
    const max = currentIndex + CONFIG.BUFFER_SIZE;

    if (min !== renderedRange.current.min || max !== renderedRange.current.max) {
      renderedRange.current = { min, max };
      setVisibleRange({ min, max });
    }

    requestRef.current = requestAnimationFrame(animationLoop);
  };

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    state.current.projectHeight = window.innerHeight;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const s = state.current;
      s.isSnapping = false;
      s.lastScrollTime = Date.now();
      const delta = Math.max(
        Math.min(e.deltaY * CONFIG.SCROLL_SPEED, CONFIG.MAX_VELOCITY),
        -CONFIG.MAX_VELOCITY
      );
      s.targetY -= delta;
    };

    const onTouchStart = (e: TouchEvent) => {
      const s = state.current;
      s.isDragging = true;
      s.isSnapping = false;
      s.dragStart = { y: e.touches[0].clientY, scrollY: s.targetY };
      s.lastScrollTime = Date.now();
    };

    const onTouchMove = (e: TouchEvent) => {
      const s = state.current;
      if (!s.isDragging) return;
      s.targetY =
        s.dragStart.scrollY + (e.touches[0].clientY - s.dragStart.y) * 1.5;
      s.lastScrollTime = Date.now();
    };

    const onTouchEnd = () => {
      state.current.isDragging = false;
    };

    const onResize = () => {
      state.current.projectHeight = window.innerHeight;
      if (container) {
        container.style.height = `${window.innerHeight}px`;
      }
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart);
    container.addEventListener("touchmove", onTouchMove);
    container.addEventListener("touchend", onTouchEnd);
    window.addEventListener("resize", onResize);

    onResize();
    requestRef.current = requestAnimationFrame(animationLoop);

    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", onResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const indices = [];
  for (let i = visibleRange.min; i <= visibleRange.max; i++) {
    indices.push(i);
  }

  return (
    <div className="parallax-container" ref={containerRef}>
      {/* Main project images — full viewport */}
      <ul className="project-list">
        {indices.map((i) => {
          const data = getPropertyData(i);
          const num = getPropertyNumber(i);
          return (
            <div
              key={i}
              className="project"
              ref={(el) => {
                if (el) projectsRef.current.set(i, el);
                else projectsRef.current.delete(i);
              }}
            >
              <img src={data.image} alt={data.title} />
              {/* Overlay gradient */}
              <div className="project-overlay" />
              {/* Property info on image */}
              <div className="project-info">
                <span className="project-number">{num}</span>
                <span className="project-category">{data.category}</span>
                <h3 className="project-title">{data.title}</h3>
                <div className="project-price">
                  <span className="project-price-value">{data.price}</span>
                  <span className="project-price-currency">{data.currency}</span>
                </div>
                <span className="project-location">{data.location}</span>
              </div>
            </div>
          );
        })}
      </ul>

      {/* Minimap sidebar */}
      <div className="minimap">
        <div className="minimap-wrapper">
          <div className="minimap-img-preview">
            {indices.map((i) => {
              const data = getPropertyData(i);
              return (
                <div
                  key={i}
                  className="minimap-img-item"
                  ref={(el) => {
                    if (el) minimapRef.current.set(i, el);
                    else minimapRef.current.delete(i);
                  }}
                >
                  <img src={data.image} alt={data.title} />
                </div>
              );
            })}
          </div>
          <div className="minimap-info-list">
            {indices.map((i) => {
              const data = getPropertyData(i);
              const num = getPropertyNumber(i);
              return (
                <div
                  key={i}
                  className="minimap-item-info"
                  ref={(el) => {
                    if (el) infoRef.current.set(i, el);
                    else infoRef.current.delete(i);
                  }}
                >
                  <div className="minimap-item-info-row">
                    <p className="minimap-num">{num}</p>
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
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
