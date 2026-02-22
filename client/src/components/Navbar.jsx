import { useState, useEffect } from 'react';
import reneson from '/reneson.png';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { setShowScheduler } = useData();

  const links = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/#services" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/#contact" }
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 glass-nav transition-all duration-300 ${isScrolled ? 'shadow-sm' : ''}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            navigate('/');
            setMenuOpen(false);
          }}
        >
          <img src={reneson} alt="Reneson" className="w-8 h-8" />
          <span className="text-2xl font-bold text-[#426369]">Reneson</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-10 text-sm font-medium text-gray-600">
          {links.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="hover:text-[#426369] transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <button
            onClick={() => setShowScheduler(true)}
            className="bg-[#426369] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#354f54] transition-all shadow-lg"
          >
            Schedule Call
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-[#426369]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="flex flex-col px-6 py-6 space-y-5 text-gray-700 font-medium">
            {links.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="hover:text-[#426369]"
              >
                {item.name}
              </a>
            ))}

            <button
              onClick={() => {
                setShowScheduler(true);
                setMenuOpen(false);
              }}
              className="bg-[#426369] cursor-pointer text-white py-3 rounded-full font-semibold hover:bg-[#354f54]"
            >
              Schedule Call
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;