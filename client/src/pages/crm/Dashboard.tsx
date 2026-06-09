import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import type { Lead, Task } from '../../types';
import { Target, Clock, CheckCircle2, ListTodo, Loader2, ArrowRight, Phone, Globe, PenLine } from 'lucide-react';

function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<Lead[]>('/leads'),
      api.get<Task[]>('/tasks?my=true'),
    ])
      .then(([leadsRes, tasksRes]) => {
        setLeads(leadsRes.data);
        setTasks(tasksRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <Loader2 size={40} className="animate-spin text-primary-600 mx-auto" />
      </div>
    );
  }

  const newLeads = leads.filter((l) => l.status === 'new').length;
  const inWorkLeads = leads.filter((l) => l.status === 'in_work').length;
  const doneLeads = leads.filter((l) => l.status === 'done').length;
  const todoTasks = tasks.filter((t) => t.status === 'todo').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;

  const recentLeads = leads.slice(0, 5);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Дашборд</h1>
        <p className="text-gray-500 mt-1">Обзор работы сервиса</p>
      </div>

      {/* Карточки */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard icon={<Target size={22} />} label="Новые лиды" value={newLeads} gradient="from-blue-500 to-blue-600" />
        <StatCard icon={<Clock size={22} />} label="В работе" value={inWorkLeads} gradient="from-yellow-500 to-orange-500" />
        <StatCard icon={<CheckCircle2 size={22} />} label="Завершено" value={doneLeads} gradient="from-green-500 to-emerald-600" />
        <StatCard icon={<ListTodo size={22} />} label="К выполнению" value={todoTasks} gradient="from-purple-500 to-purple-600" />
        <StatCard icon={<Clock size={22} />} label="В процессе" value={inProgressTasks} gradient="from-indigo-500 to-indigo-600" />
      </div>

      {/* Последние лиды */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Последние лиды</h2>
            <p className="text-sm text-gray-500 mt-0.5">Новые заявки от клиентов</p>
          </div>
          <Link
            to="/crm/leads"
            className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold text-sm"
          >
            Все лиды
            <ArrowRight size={16} />
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Пока нет лидов
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentLeads.map((lead) => (
              <Link
                key={lead.id}
                to={`/crm/leads/${lead.id}`}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {lead.client_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {lead.client_name}
                    </p>
                    <SourceBadge source={lead.source} />
                  </div>
                  <p className="text-sm text-gray-500">{lead.phone}</p>
                </div>
                <div className="hidden md:block text-sm text-gray-500">
                  {lead.location_name || '—'}
                </div>
                <StatusBadge status={lead.status} />
                <div className="hidden lg:block text-xs text-gray-400">
                  {new Date(lead.created_at).toLocaleDateString('ru-RU')}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, gradient }: { icon: React.ReactNode; label: string; value: number; gradient: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 group">
      <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${gradient} text-white rounded-xl shadow-lg mb-3 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="text-3xl font-extrabold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; bg: string; text: string }> = {
    new: { label: 'Новый', bg: 'bg-blue-100', text: 'text-blue-700' },
    in_work: { label: 'В работе', bg: 'bg-yellow-100', text: 'text-yellow-700' },
    booked: { label: 'Записан', bg: 'bg-purple-100', text: 'text-purple-700' },
    done: { label: 'Завершён', bg: 'bg-green-100', text: 'text-green-700' },
    rejected: { label: 'Отказ', bg: 'bg-red-100', text: 'text-red-700' },
  };
  const c = config[status] || { label: status, bg: 'bg-gray-100', text: 'text-gray-700' };
  return (
    <span className={`px-2.5 py-1 ${c.bg} ${c.text} rounded-full text-xs font-medium whitespace-nowrap`}>
      {c.label}
    </span>
  );
}

function SourceBadge({ source }: { source: string }) {
  const icons: Record<string, React.ReactNode> = {
    site: <Globe size={12} />,
    manual: <PenLine size={12} />,
    external: <Phone size={12} />,
  };
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
      {icons[source]}
    </span>
  );
}

export default Dashboard;