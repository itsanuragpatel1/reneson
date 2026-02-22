import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdmin } from '../context/AdminContext';
import { Trash2, Edit, Plus, X, Save, Loader2, Image as ImageIcon, UploadCloud, PlusCircle, MinusCircle } from 'lucide-react';

const CRUDPage = ({ title, module, fields, readOnly = false }) => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [previews, setPreviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { token } = useAdmin();

  const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/${module}`;

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/all`);
      setItems(res.data.data || res.data);
    } catch (err) { console.error("Fetch Error"); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [module]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      if (e.target.multiple) {
        const fileArray = Array.from(files);
        setFormData({ ...formData, [name]: fileArray });
        setPreviews({ ...previews, [name]: fileArray.map(file => URL.createObjectURL(file)) });
      } else {
        const file = files[0];
        setFormData({ ...formData, [name]: file });
        setPreviews({ ...previews, [name]: URL.createObjectURL(file) });
      }
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleArrayChange = (fieldName, index, value) => {
    const newArray = [...(formData[fieldName] || [])];
    newArray[index] = value;
    setFormData({ ...formData, [fieldName]: newArray });
  };

  const addArrayItem = (fieldName) => {
    setFormData({ ...formData, [fieldName]: [...(formData[fieldName] || []), ""] });
  };

  const removeArrayItem = (fieldName, index) => {
    const newArray = (formData[fieldName] || []).filter((_, i) => i !== index);
    setFormData({ ...formData, [fieldName]: newArray });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      
      Object.keys(formData).forEach(key => {
        const fieldConfig = fields.find(f => f.name === key);
        const value = formData[key];

        if (fieldConfig?.type === 'file') {
          if (Array.isArray(value)) {
            value.forEach(file => { if (file instanceof File) data.append(key, file); });
          } else {
            if (value instanceof File) data.append(key, value);
          }
        } else if (fieldConfig?.type === 'array' || Array.isArray(value)) {
          data.append(key, JSON.stringify(value || []));
        } else {
          data.append(key, value !== undefined ? value : "");
        }
      });

      const config = { headers: { Authorization: token, 'Content-Type': 'multipart/form-data' } };
      if (editingId) await axios.put(`${API_URL}/${editingId}`, data, config);
      else await axios.post(`${API_URL}/create`, data, config);

      setIsModalOpen(false);
      setFormData({});
      setPreviews({});
      setEditingId(null);
      fetchData();
    } catch (err) { 
        console.error(err);
        alert("Save failed: " + (err.response?.data?.message || err.message)); 
    } finally { setSubmitting(false); }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setFormData({ ...item }); 
    setPreviews({});
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: token } });
        fetchData();
      } catch (err) { console.error(err); }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{title}</h1>
        </div>
        {!readOnly && (
          <button onClick={() => { setEditingId(null); setFormData({}); setPreviews({}); setIsModalOpen(true); }}
            className="bg-[#426369] text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase flex items-center gap-2 cursor-pointer transition-transform hover:scale-105">
            <Plus size={16} /> New {title.slice(0, -1)}
          </button>
        )}
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
        {loading ? (<div className="py-20 flex justify-center"><Loader2 className="animate-spin text-slate-300" size={40} /></div>) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  {fields.map(f => (
                    <th key={f.name} className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">{f.label}</th>
                  ))}
                  <th className="p-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                    {fields.map(f => (
                      <td key={f.name} className="p-6 text-sm font-semibold text-slate-600">
                        {f.type === 'file' ? (
                          <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                            <img
                              src={Array.isArray(item[f.name]) ? item[f.name][0] : item[f.name]}
                              className="w-full h-full object-cover"
                              alt={f.label}
                              onError={(e) => e.target.src = 'https://placehold.co/100x100?text=NA'}
                            />
                          </div>
                        ) : f.type === 'array' ? (
                            <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-md">
                                {Array.isArray(item[f.name]) ? `${item[f.name].length} items` : '0 items'}
                            </span>
                        ) : (
                          <span className="truncate max-w-[150px] block">
                            {typeof item[f.name] === 'boolean' ? (item[f.name] ? 'Yes' : 'No') : String(item[f.name] || '—')}
                          </span>
                        )}
                      </td>
                    ))}
                    <td className="p-6 text-right flex justify-end gap-2">
                      {!readOnly && <button onClick={() => startEdit(item)} className="p-2 text-slate-400 hover:text-[#426369] transition-colors cursor-pointer"><Edit size={18} /></button>}
                      <button onClick={() => handleDelete(item._id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{editingId ? 'Edit' : 'Create'} {title.slice(0, -1)}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              {fields.map(f => (
                <div key={f.name} className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    {f.label} {f.required && <span className="text-red-400">*</span>}
                  </label>

                  {f.type === 'file' ? (
                    <div className="space-y-4">
                      <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 hover:bg-slate-100/50 transition-all text-center">
                        <input
                          type="file"
                          name={f.name}
                          multiple={f.multiple}
                          onChange={handleChange}
                          accept="image/*"
                          required={editingId ? false : f.required}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <UploadCloud className="mx-auto text-slate-300 mb-2" size={32} />
                        <p className="text-[10px] font-black uppercase text-slate-400">Click to upload {f.label}</p>
                      </div>

                      {(previews[f.name] || formData[f.name]) && (
                        <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                          {f.multiple ? (
                            (previews[f.name] || (Array.isArray(formData[f.name]) ? formData[f.name] : [])).map((url, i) => (
                              <img key={i} src={typeof url === 'string' ? url : URL.createObjectURL(url)} className="w-16 h-16 object-cover rounded-xl border border-white shadow-sm" />
                            ))
                          ) : (
                            <img src={previews[f.name] || formData[f.name]} className="w-20 h-20 object-cover rounded-xl shadow-md border-2 border-white" />
                          )}
                        </div>
                      )}
                    </div>
                  ) : f.type === 'array' ? (
                    <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      {(formData[f.name] || []).map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={item}
                            onChange={(e) => handleArrayChange(f.name, idx, e.target.value)}
                            placeholder={`Enter ${f.label} point...`}
                            className="flex-1 bg-white border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => removeArrayItem(f.name, idx)}
                            className="text-red-400 hover:text-red-500 transition-colors"
                          >
                            <MinusCircle size={24} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addArrayItem(f.name)}
                        className="flex items-center gap-2 text-[10px] font-black uppercase text-[#426369] hover:opacity-80 transition-opacity"
                      >
                        <PlusCircle size={18} /> Add {f.label} Item
                      </button>
                    </div>
                  ) : f.type === 'select' ? (
                    <select name={f.name} value={formData[f.name] || ''} onChange={handleChange} required={f.required} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#426369]/10">
                      <option value="">Select Option</option>
                      {f.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : f.type === 'checkbox' ? (
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <input
                        type="checkbox" name={f.name} checked={formData[f.name] || false} onChange={handleChange}
                        className="w-5 h-5 accent-[#426369] cursor-pointer"
                      />
                      <span className="text-sm font-bold text-slate-600">Mark as {f.label}</span>
                    </div>
                  ) : f.type === 'textarea' ? (
                    <textarea name={f.name} value={formData[f.name] || ''} onChange={handleChange} required={f.required} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#426369]/10 min-h-[100px]" />
                  ) : (
                    <input
                      type={f.type || 'text'}
                      name={f.name}
                      value={formData[f.name] || ''}
                      onChange={handleChange}
                      required={f.required}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#426369]/10"
                    />
                  )}
                </div>
              ))}

              <button type="submit" disabled={submitting} className="w-full bg-[#426369] text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#426369]/20 flex items-center justify-center gap-3 hover:-translate-y-1 transition-all disabled:opacity-50 cursor-pointer">
                {submitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                {editingId ? 'Update Record' : 'Create Record'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRUDPage;