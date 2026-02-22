import React, { useState, useEffect } from 'react';
import { Star, StarHalf, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';

const RatingStars = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<Star key={i} className="w-4 h-4 fill-[#426369] text-[#426369]" />);
    } else if (i - 0.5 <= rating) {
      stars.push(<StarHalf key={i} className="w-4 h-4 fill-[#426369] text-[#426369]" />);
    } else {
      stars.push(<Star key={i} className="w-4 h-4 text-gray-300" />);
    }
  }
  return <div className="flex gap-1">{stars}</div>;
};

const Testimonials = () => {
  const { testimonials } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else setItemsPerPage(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - itemsPerPage);

  const prevSlide = () => setCurrentIndex((prev) => (prev <= 0 ? 0 : prev - 1));
  const nextSlide = () => setCurrentIndex((prev) => (prev >= maxIndex ? maxIndex : prev + 1));

  return (
    <section className="py-24 bg-gray-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-[#426369] font-bold uppercase tracking-widest text-sm">Testimonials</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            What our clients say
          </h3>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative group px-2 md:px-12">
          {/* Navigation Buttons - Side Placement */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-10 flex justify-between pointer-events-none">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className={`w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center transition-all pointer-events-auto
                ${currentIndex === 0 
                  ? 'opacity-0 -translate-x-4 cursor-not-allowed' 
                  : 'opacity-100 translate-x-0 hover:bg-[#426369] hover:text-white text-gray-600'
                }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className={`w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center transition-all pointer-events-auto
                ${currentIndex >= maxIndex 
                  ? 'opacity-0 translate-x-4 cursor-not-allowed' 
                  : 'opacity-100 translate-x-0 hover:bg-[#426369] hover:text-white text-gray-600'
                }`}
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Carousel Content */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
            >
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 px-4 transition-all duration-300"
                  style={{ width: `${100 / itemsPerPage}%` }}
                >
                  <div className="bg-white p-8 h-full rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between transition-all hover:shadow-xl hover:-translate-y-1">
                    <div className="space-y-6">
                      <RatingStars rating={t.star} />
                      <p className="text-gray-600 italic text-lg leading-relaxed">
                        "{t.text}"
                      </p>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-50 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center overflow-hidden border border-teal-100">
                        {t.avatar ? (
                          <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-6 h-6 text-[#426369]" />
                        )}
                      </div>
                      <div>
                        <h6 className="font-bold text-gray-900 text-sm">{t.name}</h6>
                        <p className="text-[#426369] font-medium text-xs">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile Dots (Optional but good for UX) */}
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  currentIndex === idx ? 'w-8 bg-[#426369]' : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;