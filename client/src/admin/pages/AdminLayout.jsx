import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Users, MessageSquare, LogOut, BarChart } from 'lucide-react';
import { Briefcase, BarChart3, Users2, ShieldCheck,Activity  } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const AdminLayout = ({ children }) => {
  const { logout } = useAdmin();
  const navigate = useNavigate();

const menuItems = [
  { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
  { name: 'Clients', path: '/admin/clients', icon: Briefcase },
  { name: 'Statistics', path: '/admin/stats', icon: BarChart3 },
  { name: 'Team Members', path: '/admin/team', icon: Users2 },
  { name: 'Testimonials', path: '/admin/testimonials', icon: ShieldCheck },
  { name: 'Phases', path: '/admin/phase', icon: Activity  },
//   { name: 'Inquiries', path: '/admin/contacts', icon: MessageSquare },
];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className="w-64 h-screen bg-[#426369] text-white p-6 flex flex-col">
        <h2 className="text-2xl font-black mb-10 italic">RENESON ADMIN</h2>
        <nav className="flex-grow space-y-2">
          {menuItems.map((item) => (
            <Link key={item.name} to={item.path} className="flex items-center gap-3 p-3 hover:bg-white/10 rounded-lg transition-all text-sm font-bold uppercase tracking-widest">
              <item.icon size={18} /> {item.name}
            </Link>
          ))}
        </nav>
        <button onClick={() => { logout(); navigate('/admin/login'); }} className="flex items-center gap-3 p-3 text-red-300 hover:text-red-100 transition-all text-sm font-bold uppercase mt-auto border-t border-white/10 pt-6">
          <LogOut size={18} /> Logout
        </button>
      </aside>
      <main className="flex-1 p-10 overflow-y-auto">{children}</main>
    </div>
  );
};

export default AdminLayout;