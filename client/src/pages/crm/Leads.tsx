import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import type { Lead } from '../../types';
import { Plus, X, Loader2, Globe, PenLine, Phone, MapPin, Calendar } from 'lucide-react';

const COLUMNS: { status: Lead['status']; title: string; color: string; bgColor: string }[] = [
  { status: 'new', title: 'Новые', color: 'border-blue-500', bgColor: 'bg-blue-50' },
  { status: 'in_work', title: 'В работе', color: 'border-yellow-500', bgColor: 'bg-yellow-50' },
  { status: 'booked', title: 'Записаны', color: 'border-purple-500', bgColor: 'bg-purple-50' },
  { status: 'done', title: 'Завершены', color: 'border-green-500', bgColor: 'bg-green-50' },
  { status: 'rejected', title: 'Отказ', color: 'border-red-500', bgColor: 'bg-red-50' },
];

function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const loadLeads = () => {
    api.get<Lead[]>('/leads')
      .then((res) => setLeads(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const moveToStatus = async (leadId: number, newStatus: Lead['status']) => {
    try {
      await api.patch(`/leads/${leadId}/status`, { status: newStatus });
      setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
    } catch (err) {
      console.error('Ошибка:', err);
    }
  };

  if (loading) return <div className="text-center py-20"><Loader2 size={40} className="animate-spin text-primary-600 mx-auto" /></div>;

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Лиды</h1>
          <p className="text-gray-500 mt-1">Всего: <span className="font-semibold text-gray-700">{leads.length}</span></p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary-600/30"
        >
          <Plus size={18} />
          Новый лид
        </button>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {COLUMNS.map((col) => {
          const colLeads = leads.filter((l) => l.status === col.status);
          return (
            <div key={col.status} className={`bg-white rounded-2xl shadow-sm border-t-4 ${col.color} overflow-hidden`}>
              <div className={`${col.bgColor} p-3`}>
                <h3 className="font-bold text-gray-800 flex justify-between items-center text-sm">
                  {col.title}
                  <span className="bg-white px-2 py-0.5 rounded-full text-xs text-gray-700 font-semibold shadow-sm">
                    {colLeads.length}
                  </span>
                </h3>
              </div>
              <div className="p-2 space-y-2 min-h-[300px] max-h-[600px] overflow-y-auto">
                {colLeads.map((lead) => (
                  <LeadKanbanCard
                    key={lead.id}
                    lead={lead}
                    onMove={(s) => moveToStatus(lead.id, s)}
                  />
                ))}
                {colLeads.length === 0 && (
                  <p className="text-center text-gray-300 text-xs py-8">Пусто</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showCreate && (
        <CreateLeadModal onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); loadLeads(); }} />
      )}
    </div>
  );
}

function LeadKanbanCard({ lead, onMove }: { lead: Lead; onMove: (s: Lead['status']) => void }) {
  const sourceIcons: Record<string, React.ReactNode> = {
    site: <Globe size={12} className="text-blue-500" />,
    manual: <PenLine size={12} className="text-purple-500" />,
    external: <Phone size={12} className="text-green-500" />,
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 hover:shadow-lg hover:border-primary-300 transition-all group">
      <Link to={`/crm/leads/${lead.id}`} className="block mb-2">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
            {lead.client_name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm truncate group-hover:text-primary-600 transition-colors">
              {lead.client_name}
            </p>
          </div>
          <div title={lead.source}>{sourceIcons[lead.source]}</div>
        </div>
        <div className="space-y-1 text-xs text-gray-500">
          <p className="flex items-center gap-1.5"><Phone size={11} />{lead.phone}</p>
          {lead.location_name && (
            <p className="flex items-center gap-1.5 truncate"><MapPin size={11} className="flex-shrink-0" />{lead.location_name}</p>
          )}
          <p className="flex items-center gap-1.5 text-gray-400 pt-1"><Calendar size={11} />{new Date(lead.created_at).toLocaleDateString('ru-RU')}</p>
        </div>
      </Link>

      <select
        value={lead.status}
        onChange={(e) => onMove(e.target.value as Lead['status'])}
        onClick={(e) => e.stopPropagation()}
        className="w-full text-xs border border-gray-200 rounded-lg px-2 py-1 bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="new">→ Новый</option>
        <option value="in_work">→ В работе</option>
        <option value="booked">→ Записан</option>
        <option value="done">→ Завершён</option>
        <option value="rejected">→ Отказ</option>
      </select>
    </div>
  );
}

function CreateLeadModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ client_name: '', phone: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/leads', form);
      onCreated();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-slide-up">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-900">Новый лид</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Имя клиента *</label>
            <input type="text" name="client_name" value={form.client_name} onChange={handleChange} required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-sm">{error}</div>}

          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all disabled:bg-gray-400 flex items-center justify-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} />Создать лид</>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Leads;