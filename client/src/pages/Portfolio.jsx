import React, { useState, useEffect } from 'react';
import { Filter, Calendar, LayoutGrid, AlertCircle, ArrowUpDown } from 'lucide-react';
import axios from 'axios';
import ProjectCard from '../components/ProjectCard';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    'All',
    'IoT & Hardware',
    'Software Development',
    'Artificial Intelligence',
    'Training'
  ];

useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/projects/all`
        );

        if (!response.data.success) {
          throw new Error('Failed to fetch projects');
        }

        setProjects(response.data.data);
        setFilteredProjects(response.data.data); // default: All
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(
        (project) => project.serviceType === activeCategory
      );
      setFilteredProjects(filtered);
    }
  }, [activeCategory, projects]);

  return (
    <div className="min-h-screen bg-white">
      {/* --- MINIMALIST PROJECT HEADER --- */}
      <section className="pt-40 pb-24 bg-slate-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight mb-6">
              Our Portfolio
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed">
              A focused selection of projects where thoughtful design and solid <br />
              engineering come together to create long-term value.
            </p>
          </div>
        </div>
      </section>

      {/* FILTER BAR */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 text-[#426369] font-bold text-xs uppercase tracking-widest min-w-fit">
              <Filter size={14} /> Filter By:
            </div>

            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap border ${
                    activeCategory === cat
                      ? 'bg-[#426369] text-white border-[#426369]'
                      : 'bg-white text-slate-500 border-gray-200 hover:border-[#426369]/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* PROJECTS GRID */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-4">
            <div className="w-12 h-12 border-4 border-[#426369]/20 border-t-[#426369] rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              Accessing Reneson Archive...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-40 text-red-500 flex flex-col items-center gap-4">
            <AlertCircle size={48} />
            <p className="font-bold">Error: {error}</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredProjects.map((project) => (
              <ProjectCard {...project}/>
            ))}
          </div>
        ) : (
          <div className="text-center py-40">
            <LayoutGrid size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-500 text-lg">
              No projects found in this category.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProjectsPage;
