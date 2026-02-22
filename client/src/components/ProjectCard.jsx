import { useNavigate } from "react-router-dom";

const ProjectCard = ({_id, title, description, tech, mainImage, serviceType }) => {
  const navigate=useNavigate();

  return (
  <div onClick={()=>navigate(`/project/${_id}`)} className="group bg-white rounded-[1.5rem] overflow-hidden border border-gray-100 hover:border-[#426369]/20 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-[#426369]/5">
    
    {/* 1. Image Container with Floating Service Tag */}
    <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
      {/* Service Type Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-[#426369] text-[10px] font-black uppercase tracking-[0.15em] rounded-lg shadow-sm border border-[#426369]/10">
          {serviceType}
        </span>
      </div>

      <img 
        src={mainImage} 
        alt={title} 
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out scale-100 group-hover:scale-110"
      />
      
      {/* Subtle Overlay on Hover */}
      <div className="absolute inset-0 bg-[#426369]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>

    {/* Content Container */}
    <div className="p-10 text-center flex flex-col items-center">
      
      {/* 2. Title */}
      <h3 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight group-hover:text-[#426369] transition-colors">
        {title}
      </h3>
      
      {/* 3. Short Description */}
      <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-8">
        {description}
      </p>
      
      {/* 4. Technologies (Minimal subtle tags) */}
      <div className="flex flex-wrap justify-center gap-2">
        {tech.map((item, index) => (
          <span 
            key={index} 
            className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-3 py-1 bg-gray-50 rounded-md border border-gray-100 group-hover:text-[#426369] group-hover:border-[#426369]/20 transition-all"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  </div>
)};

export default ProjectCard;