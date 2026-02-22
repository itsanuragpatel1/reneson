import { Phone, FileText, Activity, Send, Calendar ,X } from 'lucide-react';
import axios from "axios";
import { useState } from 'react';
import { useData } from '../context/DataContext';
import toast from 'react-hot-toast';

const Contact = () => {

  let [name, setName]=useState("");
  let [email, setEmail]=useState("");
  let [message, setMessage]=useState("");
  const {setShowScheduler}=useData();

  const handleSubmit = async (e) => {
  e.preventDefault();

  const data = {
    name,
    email,
    message,
  };

  const endpoint=`${import.meta.env.VITE_BACKEND_URL}/api/contact`;
  try {

    const res = await axios.post(endpoint,data,);

    if (res.data.success) {
      toast.success("Message sent successfully")
      setName("");
      setEmail("");
      setMessage("");
    } else {
      alert(res.data.message);
    }
  } catch (error) {
    console.error(error);

    // axios gives better error info
    alert(
      error.response?.data?.message || "Server error, please try again"
    );
  }
};


  return (
    <>
  <section id="contact" className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center max-w-3xl mx-auto mb-20">
        <h2 className="text-4xl md:text-5xl font-black text-gray-900">
          Start your project with <span className="text-[#426369]">Reneson</span>
        </h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-12">
          <p className="text-gray-600 text-lg leading-relaxed">
            Have an idea or a complex business problem? Our team is ready to analyze your requirements and provide a technical roadmap.
          </p>

          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">What happens next</h4>
            {[
              { icon: Phone, title: "1. Discovery Call", desc: "We discuss your goals and technical needs." },
              { icon: FileText, title: "2. Proposal", desc: "We send a detailed scope and timeline." },
              { icon: Activity, title: "3. Execution", desc: "Agile development with weekly updates." }
            ].map((step, i) => (
              <div key={i} className="flex gap-5 items-start">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-5 h-5 text-[#426369]" />
                </div>
                <div>
                  <h5 className="font-bold text-gray-900">{step.title}</h5>
                  <p className="text-gray-500 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button    onClick={() => setShowScheduler(true)} className="bg-[#426369] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 shadow-xl cursor-pointer">
            Schedule a free call <Calendar className="w-5 h-5" />
          </button>
        </div>

        <div onSubmit={(e)=>handleSubmit(e)} className="bg-gray-50/50 p-8 md:p-10 rounded-[2rem] border border-gray-100">
          <form className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1">Name</label>
              <input type="text" value={name} onChange={(e)=>setName(e.target.value)} className="w-full px-6 py-4 bg-white rounded-xl border border-gray-200 outline-none focus:ring-4 focus:ring-[#426369]/5" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1">Email</label>
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full px-6 py-4 bg-white rounded-xl border border-gray-200 outline-none focus:ring-4 focus:ring-[#426369]/5" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-2 ml-1">Message</label>
              <textarea rows="4" value={message} onChange={(e)=>setMessage(e.target.value)} className="w-full px-6 py-4 bg-white rounded-xl border border-gray-200 outline-none resize-none"></textarea>
            </div>
            <button type='submit' className="w-full bg-[#426369] text-white py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 cursor-pointer">
              Send Message <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
  </>
)

};

export default Contact;