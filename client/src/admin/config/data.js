export const adminConfigs = {
  projects: {
    title: "Projects",
    module: "projects",
    fields: [
      { name: 'title', label: 'Project Title', type: 'text', required: true },
      { name: 'serviceType', label: 'Service Category', type: 'select', 
        options: ['IoT & Hardware', 'Software Development', 'Artificial Intelligence', 'Training'],
        required: true 
      },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'tech', label: 'Technologies', type: 'array', required: false },
      { name: 'mainImage', label: 'Main Display Image', type: 'file', required: true },
      { name: 'galleryImages', label: 'Gallery Images', type: 'file', multiple: true, required: false },
      { name: 'isFeatured', label: 'Featured Project', type: 'checkbox', required: false },
      { name: 'phaseCodes', label:'Phase Codes',type:'array',required:false}
    ]
  },

  team: {
    title: "Team Members",
    module: "team",
    fields: [
      { name: 'name', label: 'Full Name', type: 'text', required: true },
      { name: 'specialty', label: 'Specialty/Role', type: 'text', required: false },
      { name: 'image', label: 'Profile Image', type: 'file', required: false },
      { name: 'linkedin', label: 'LinkedIn URL', type: 'text', required: false },
      { name: 'github', label: 'GitHub URL', type: 'text', required: false }
    ]
  },

  testimonials: {
    title: "Testimonials",
    module: "testimonials",
    fields: [
      { name: 'name', label: 'Client Name', type: 'text', required: true },
      { name: 'role', label: 'Designation/Role', type: 'text', required: false },
      { name: 'text', label: 'Testimonial Text', type: 'textarea', required: true },
      { name: 'avatar', label: 'Avatar Image', type: 'file', required: false },
      { name: 'star', label: 'Rating (1-5)', type: 'number', required: false }
    ]
  },

  clients: {
    title: "Our Clients",
    module: "clients",
    fields: [
      { name: 'name', label: 'Client Name', type: 'text', required: true },
      { name: 'logo', label: 'Logo Image', type: 'file', required: true }
    ]
  },

  stats: {
    title: "Statistics",
    module: "stats",
    fields: [
      { name: 'label', label: 'Stat Label', type: 'text', required: true },
      { name: 'value', label: 'Numeric Value', type: 'number', required: true }
    ]
  },

  phase: {
    title: "Phases",
    module: "phase",
    fields: [
      { name: 'phaseCode',label: 'Phase Code (Unique)',type: 'text',required: true,},
      {name: 'title',label: 'Phase Title',type: 'text',required: true},
      {name: 'images',label: 'Images',type: 'file',multiple: true,required: false},
    {name: 'summary',label: 'Summary Points',type: 'array', inputType: 'text',required: false},
      {name: 'order',label: 'Display Order',type: 'number',required: false}
    ]
  },

};