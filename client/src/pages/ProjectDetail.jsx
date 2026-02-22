import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Check, 
  Maximize2, 
  X, 
  Loader2, 
  AlertCircle 
} from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import ScheduleCall from "../components/ScheduleCall";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  // States
  const [project, setProject] = useState(null);
  const [phases, setPhases] = useState([]);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Fetch Project and its Phases (using the detailed route)
        const response = await axios.get(`${API_URL}/api/projects/${id}`);
        
        if (response.data.success) {
          const projectData = response.data.data;
          setProject(projectData);
          setPhases(projectData.phases || []);
          
          // 2. Fetch Related Projects based on serviceType
          fetchRelated(projectData.serviceType, projectData._id);
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError(err.response?.data?.message || "Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    const fetchRelated = async (serviceType, currentId) => {
      try {
        setLoadingRelated(true);
        const response = await axios.get(`${API_URL}/api/projects/service`, {
          params: { serviceType }
        });
        
        if (response.data.success) {
          // Filter out the current project from recommendations
          const filtered = response.data.data.filter(p => p._id !== currentId);
          setRelatedProjects(filtered.slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching related projects:", err);
      } finally {
        setLoadingRelated(false);
      }
    };

    if (id) fetchProjectDetails();
    window.scrollTo(0, 0);
  }, [id, API_URL]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#426369]" />
        <p className="text-slate-500 font-medium">Loading project details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Something went wrong</h2>
          <p className="text-slate-500">{error || "Project not found"}</p>
        </div>
        <button 
          onClick={() => navigate('/portfolio')}
          className="px-6 py-3 bg-[#426369] text-white rounded-full font-semibold"
        >
          Back to Portfolio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      
      {/* HERO SECTION */}
      <section className="pt-28 pb-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
          
          {/* Left Content */}
          <div className="space-y-6">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#426369]">
              {project.serviceType}
            </span>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              {project.title}
            </h1>

            <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              {project.tech?.map((t, i) => (
                <span
                  key={i}
                  className="text-xs font-medium border border-slate-200 px-3 py-1 rounded-full text-slate-600"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-2xl aspect-video lg:aspect-square">
            <img
              src={project.mainImage}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* DEVELOPMENT PHASES */}
      {phases.length > 0 && (
        <section className="py-24 bg-white border-y border-gray-100 relative">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="max-w-2xl">
                <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                  Development <span className="text-[#426369]">Phases</span>
                </h3>
              </div>
            </div>

            <div className="space-y-40">
              {phases.map((phase, idx) => (
                <div key={phase._id || idx} className="flex flex-col lg:flex-row gap-16 items-start">
                  
                  {/* Content Side */}
                  <div className="w-full lg:w-1/2 space-y-8 lg:sticky lg:top-24">
                    <div className="flex items-center gap-6">
                      <span className="text-6xl font-black text-slate-100">0{idx + 1}</span>
                      <div className="h-[2px] w-12 bg-[#426369]"></div>
                      <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                        {phase.title}
                      </h4>
                    </div>

                    <div className="bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100">
                      <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#426369] mb-6">Execution Summary</h5>
                      <ul className="space-y-5">
                        {phase.summary?.map((point, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-4 group">
                            <div className="mt-1 w-5 h-5 rounded-full bg-[#426369] flex items-center justify-center flex-shrink-0">
                              <Check size={12} className="text-white" />
                            </div>
                            <p className="text-slate-600 font-medium leading-relaxed">{point}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Image Side - Mosaic Grid */}
                  <div className="w-full lg:w-1/2">
                    <div className="grid grid-cols-2 gap-4">
                      {phase.images?.map((img, imgIdx) => (
                        <div 
                          key={imgIdx}
                          onClick={() => setActiveImage(img)}
                          className={`relative group overflow-hidden rounded-[2rem] border border-slate-100 shadow-lg cursor-zoom-in
                            ${imgIdx === 0 && phase.images.length % 2 !== 0 ? 'col-span-2 aspect-[16/9]' : 'col-span-1 aspect-square'}
                            ${phase.images.length === 1 ? 'col-span-2 aspect-[4/3]' : ''}
                          `}
                        >
                          <img 
                            src={img} 
                            alt={`${phase.title} visual ${imgIdx + 1}`} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Maximize2 className="text-white w-8 h-8 scale-50 group-hover:scale-100 transition-transform duration-300" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GALLERY */}
      {project.galleryImages?.length > 0 && (
        <section className="py-24 bg-gray-50/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-12 flex flex-col gap-2 text-center">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">Project Gallery</h2>
              <p className="text-gray-500 text-lg">Detailed visuals of the final implementation.</p>
            </div>

            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {project.galleryImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className="relative group break-inside-avoid overflow-hidden rounded-[2rem] border border-slate-100 bg-slate-50 cursor-pointer shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
                >
                  <img
                    src={img}
                    alt={`Gallery asset ${i + 1}`}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white">
                      <Maximize2 size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SIMILAR WORKS SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-16">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight">Similar Works</h2>
              <p className="text-gray-500 font-medium italic">More projects in {project.serviceType}</p>
            </div>
            <button 
              onClick={() => navigate('/portfolio')} 
              className="hidden md:block text-sm font-bold text-[#426369] border-b-2 border-[#426369]/20 hover:border-[#426369] transition-all"
            >
              VIEW ALL PROJECTS →
            </button>
          </div>

          {loadingRelated ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="aspect-[16/10] bg-gray-100 rounded-2xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {relatedProjects.length > 0 ? (
                relatedProjects.map((p) => (
                  <ProjectCard {...p}/>
                ))
              ) : (
                <div className="col-span-3 text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-medium">No other projects in this category yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {activeImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          onClick={() => setActiveImage(null)} 
        >
          <div className="relative max-w-6xl w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition z-[110]"
              onClick={() => setActiveImage(null)}
            >
              <X size={24} />
            </button>
            <img
              src={activeImage}
              alt="Enlarged view"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
            />
          </div>
        </div>
      )}

      <ScheduleCall/>
    </div>
  );
};

export default ProjectDetail;