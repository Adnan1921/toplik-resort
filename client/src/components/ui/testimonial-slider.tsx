"use client"
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  country: string;
}

const testimonials: Testimonial[] = [
  { id: 1, quote: "Impressed by the professionalism and attention to detail.", name: "Guy Hawkins", country: "United States" },
  { id: 2, quote: "A seamless experience from start to finish. Highly recommend!", name: "Karla Lynn", country: "Canada" },
  { id: 3, quote: "Reliable and trustworthy. Made my life so much easier!", name: "Jane Cooper", country: "United Kingdom" },
  { id: 4, quote: "The level of service exceeded my expectations. Will definitely come back.", name: "Robert Chen", country: "Singapore" },
  { id: 5, quote: "An innovative approach that truly solved my problems.", name: "Sarah Miller", country: "Australia" },
];

const getVisibleCount = (width: number): number => {
  if (width >= 1280) return 3;
  if (width >= 768) return 2;
  return 1;
};

const TestimonialSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
      
      const oldVisibleCount = getVisibleCount(windowWidth);
      const newVisibleCount = getVisibleCount(newWidth);
      
      if (oldVisibleCount !== newVisibleCount) {
        const maxIndexForNewWidth = testimonials.length - newVisibleCount;
        if (currentIndex > maxIndexForNewWidth) {
          setCurrentIndex(Math.max(0, maxIndexForNewWidth));
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [windowWidth, currentIndex]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        const visibleCount = getVisibleCount(windowWidth);
        const maxIndex = testimonials.length - visibleCount;

        if (currentIndex >= maxIndex) {
          setDirection(-1);
          setCurrentIndex((prev) => prev - 1);
        } else if (currentIndex <= 0) {
          setDirection(1);
          setCurrentIndex((prev) => prev + 1);
        } else {
          setCurrentIndex((prev) => prev + direction);
        }
      }, 4000);
    };

    startAutoPlay();

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, currentIndex, windowWidth, direction]);

  const visibleCount = getVisibleCount(windowWidth);
  const maxIndex = testimonials.length - visibleCount;
  const canGoNext = currentIndex < maxIndex;
  const canGoPrev = currentIndex > 0;

  const goNext = () => {
    if (canGoNext) {
      setDirection(1);
      setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
      pauseAutoPlay();
    }
  };

  const goPrev = () => {
    if (canGoPrev) {
      setDirection(-1);
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
      pauseAutoPlay();
    }
  };

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const handleDragEnd = (event: any, info: any) => {
    const { offset } = info;
    const swipeThreshold = 30;

    if (offset.x < -swipeThreshold && canGoNext) {
      goNext();
    } else if (offset.x > swipeThreshold && canGoPrev) {
      goPrev();
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    pauseAutoPlay();
  };

  return (
    <section className="px-6 py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h2 className="font-clash text-[#1E4528] text-3xl md:text-4xl lg:text-5xl font-normal text-center mb-8">
            Some satisfied guests have to say
          </h2>
          
          <div className="flex justify-between items-center">
            <p className="font-martel text-[#1E4528] text-base md:text-lg">
              {testimonials.length * 55} reviews
            </p>
            
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goPrev}
                disabled={!canGoPrev}
                className={`p-3 rounded-lg border transition-all duration-300 ${
                  canGoPrev 
                    ? 'border-[#E1DBD1] bg-[#FBFAF9] text-[#1E4528] hover:bg-[#1E4528] hover:text-white' 
                    : 'border-gray-300 bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goNext}
                disabled={!canGoNext}
                className={`p-3 rounded-lg border transition-all duration-300 ${
                  canGoNext 
                    ? 'border-[#E1DBD1] bg-[#FBFAF9] text-[#1E4528] hover:bg-[#1E4528] hover:text-white' 
                    : 'border-gray-300 bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}
                aria-label="Next testimonial"
              >
                <ChevronRight size={20} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="relative" ref={containerRef}>
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: `-${currentIndex * (100 / visibleCount)}%` }}
              transition={{ 
                type: 'spring', 
                stiffness: 70, 
                damping: 20 
              }}
            >
              {testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  className={`flex-shrink-0 w-full ${
                    visibleCount === 3 ? 'md:w-1/3' : 
                    visibleCount === 2 ? 'md:w-1/2' : 'w-full'
                  } p-2`}
                  initial={{ opacity: 0.5, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98, cursor: 'grabbing' }}
                  style={{ cursor: 'grab' }}
                >
                <motion.div 
                    className="bg-[#F8F5F0] rounded-xl p-6 md:p-8 h-full flex flex-col"
                    whileHover={{ y: -4 }}
                  >
                    <div className="mb-6">
                      <h4 className="font-martel text-[#1E4528] text-lg md:text-xl font-medium mb-1">
                        {testimonial.name}
                      </h4>
                      <p className="font-martel text-[#1E4528]/70 text-sm mb-3">
                        {testimonial.country}
                      </p>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={18} 
                            className="fill-[#D4AF37] text-[#D4AF37]"
                          />
                        ))}
                      </div>
                    </div>
                    
                    <p className="font-martel text-[#1E4528]/80 text-sm md:text-base leading-relaxed">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSlider;
