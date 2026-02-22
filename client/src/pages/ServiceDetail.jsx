import React, { useState, useEffect } from 'react';
import { 
  Cpu, ArrowLeft, CheckCircle2, 
  Settings, Shield, Zap, 
  Search, Code, PlayCircle, BarChart3 
} from 'lucide-react';
import ScheduleCall from '../components/ScheduleCall';
import ProjectCard from '../components/ProjectCard'; // Assuming this is your project card component
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { servicesData } from '../assets/services.js';
import { useData } from '../context/DataContext.jsx';

const ServiceDetail = () => {
  const { serviceName } = useParams();
  const navigate=useNavigate();
  const {setShowScheduler}=useData();
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const fetchRelatedProjects = async () => {
      try {
        setLoadingProjects(true);
        const {data} = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/projects/service`, {
          params: { serviceType: serviceName } 
        });
        setRelatedProjects(data.data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching related projects:", err);
      } finally {
        setLoadingProjects(false);
      }
    };

    if (serviceName) fetchRelatedProjects();
  }, [serviceName]);

  const data = servicesData.find(
  (service) => service.title === serviceName
);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* 2. Hero Section */}
      <section className="py-16 px-6 pt-40">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-slate-900">
              {data.title}
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed max-w-xl">
              {data.description}
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowScheduler(true)} className="bg-[#426369] text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-[#426369]/20 hover:bg-[#365156] transition-all cursor-pointer">
                Schedule Free Call
              </button>
              <button onClick={()=>navigate('/portfolio')} className="border border-gray-200 px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-all cursor-pointer">
                View Portfolio
              </button>
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              <div className="absolute -inset-10 bg-[#426369]/5 rounded-full blur-3xl"></div>
              <div className="w-72 h-72 rounded-[3rem] bg-gradient-to-br from-[#426369] to-[#5a858d] flex items-center justify-center shadow-2xl rotate-3">
                <data.icon className="w-32 h-32 text-white -rotate-3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Capabilities Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-4xl font-bold tracking-tight">Core Capabilities</h2>
            <div className="w-12 h-1.5 bg-[#426369] mt-4 rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.features.map((feature, idx) => (
              <div key={idx} className="bg-white p-10 rounded-3xl border border-gray-100 hover:border-[#426369]/20 transition-all group">
                <CheckCircle2 className="w-8 h-8 text-[#426369] mb-6 group-hover:scale-110 transition-transform" />
                <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. NEW: Featured Projects Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-16">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold tracking-tight">Selected Works</h2>
              <p className="text-gray-500 font-medium italic">Proven results in {data.title}</p>
            </div>
            <a onClick={()=>navigate('/portfolio')} className="hidden md:block text-sm font-bold text-[#426369] border-b-2 border-[#426369]/20 hover:border-[#426369] transition-all">
              VIEW ALL PROJECTS →
            </a>
          </div>

          {loadingProjects ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="aspect-[16/10] bg-gray-100 rounded-2xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {relatedProjects.length > 0 ? (
                relatedProjects.map((project) => (
                  <ProjectCard {...project}/>
                ))
              ) : (
                <div className="col-span-3 text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 font-medium">New project will update soon.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <ScheduleCall />
    </div>
  );
};

export default ServiceDetail;