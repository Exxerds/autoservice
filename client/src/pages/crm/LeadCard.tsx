import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import type { Lead, LeadComment } from '../../types';
import { ArrowLeft, Phone, Mail, MapPin, Calendar, User, Wrench, MessageSquare, Send, Loader2, Globe, PenLine } from 'lucide-react';

interface LeadDetail extends Lead {
  comments: LeadComment[];
  booking: any;
  location_address?: string;
}

function LeadCard() {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [posting, setPosting] = useState(false);

  const loadLead = () => {
    if (!id) return;
    api.get<LeadDetail>(`/leads/${id}`)
      .then((res) => setLead(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadLead(); }, [id]);

  const handleStatusChange = async (newStatus: Lead['status']) => {
    if (!lead) return;
    await api.patch(`/leads/${lead.id}/status`, { status: newStatus });
    setLead({ ...lead, status: newStatus });
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !lead) return;
    setPosting(true);
    try {
      await api.post(`/leads/${lead.id}/comments`, { text: newComment });
      setNewComment('');
      loadLead();
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <div className="text-center py-20"><Loader2 size={40} className="animate-spin text-primary-600 mx-auto" /></div>;
  if (!lead) return <p className="text-red-600">Лид не найден</p>;

  const sourceConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    site: { label: 'Сайт', icon: <Globe size={14} />, color: 'bg-blue-100 text-blue-700' },
    manual: { label: 'Вручную', icon: <PenLine size={14} />, color: 'bg-purple-100 text-purple-700' },
    external: { label: 'Внешний', icon: <Phone size={14} />, color: 'bg-green-100 text-green-700' },
  };
  const source = sourceConfig[lead.source];

  return (
    <div className="animate-fade-in">
      {/* Хлебные крошки */}
      <Link to="/crm/leads" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-4 transition-colors text-sm">
        <ArrowLeft size={16} />
        Все лиды
      </Link>

      {/* Заголовок */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-primary-600/30">
          {lead.client_name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-gray-500 text-sm">Лид #{lead.id}</p>
          <h1 className="text-3xl font-bold text-gray-900">{lead.client_name}</h1>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${source.color}`}>
            {source.icon}
            {source.label}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая колонка */}
        <div className="lg:col-span-2 space-y-6">
          {/* Контакты */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <User size={18} className="text-primary-600" />
              Контактные данные
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard icon={<Phone size={16} />} label="Телефон" value={lead.phone} link={`tel:${lead.phone}`} />
              <InfoCard icon={<Mail size={16} />} label="Email" value={lead.email || '—'} link={lead.email ? `mailto:${lead.email}` : undefined} />
              <InfoCard icon={<MapPin size={16} />} label="Точка" value={lead.location_name || '—'} />
              <InfoCard icon={<User size={16} />} label="Менеджер" value={lead.manager_name || 'Не назначен'} />
              <InfoCard icon={<Calendar size={16} />} label="Создан" value={new Date(lead.created_at).toLocaleString('ru-RU')} fullWidth />
            </div>
          </div>

          {/* Запись (если есть) */}
          {lead.booking && (
            <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-6 border border-primary-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-primary-600" />
                Запись на сервис
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Wrench size={12} />Услуга</div>
                  <div className="font-semibold text-gray-900">{lead.booking.service_name}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Цена</div>
                  <div className="font-extrabold text-primary-600 text-xl">
                    {parseFloat(lead.booking.service_price).toLocaleString('ru-RU')} ₽
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Calendar size={12} />Время</div>
                  <div className="font-semibold text-gray-900">{new Date(lead.booking.datetime).toLocaleString('ru-RU')}</div>
                </div>
              </div>
            </div>
          )}

          {/* Комментарии */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <MessageSquare size={18} className="text-primary-600" />
              Комментарии ({lead.comments.length})
            </h2>

            <form onSubmit={handleAddComment} className="mb-5">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Напишите комментарий..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
              <button
                type="submit"
                disabled={posting || !newComment.trim()}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all disabled:bg-gray-300"
              >
                {posting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                Отправить
              </button>
            </form>

            <div className="space-y-3">
              {lead.comments.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">Пока нет комментариев</p>
              ) : (
                lead.comments.map((c) => (
                  <div key={c.id} className="flex gap-3 group">
                    <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {(c.manager_name || 'M').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-2xl rounded-tl-sm p-3 border border-gray-100">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-semibold text-gray-900 text-sm">{c.manager_name || 'Менеджер'}</p>
                        <p className="text-xs text-gray-400">{new Date(c.created_at).toLocaleString('ru-RU')}</p>
                      </div>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">{c.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Правая колонка */}
        <div className="space-y-6">
          {/* Статус */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Статус лида</h2>
            <select
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value as Lead['status'])}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
            >
              <option value="new">🆕 Новый</option>
              <option value="in_work">⏳ В работе</option>
              <option value="booked">📅 Записан</option>
              <option value="done">✅ Завершён</option>
              <option value="rejected">❌ Отказ</option>
            </select>
          </div>

          {/* Действия */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Связаться</h2>
            <div className="space-y-2">
              <a href={`tel:${lead.phone}`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-green-600/30">
                <Phone size={18} />
                Позвонить
              </a>
              {lead.email && (
                <a href={`mailto:${lead.email}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary-600/30">
                  <Mail size={18} />
                  Email
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value, link, fullWidth }: { icon: React.ReactNode; label: string; value: string; link?: string; fullWidth?: boolean }) {
  const content = (
    <div className={`p-3 bg-gray-50 rounded-xl border border-gray-100 ${link ? 'hover:bg-primary-50 hover:border-primary-200 transition-colors cursor-pointer' : ''} ${fullWidth ? 'sm:col-span-2' : ''}`}>
      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
        {icon}
        {label}
      </div>
      <div className="font-semibold text-gray-900 text-sm">{value}</div>
    </div>
  );
  return link ? <a href={link}>{content}</a> : content;
}

export default LeadCard;