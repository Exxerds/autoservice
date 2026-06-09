import { useEffect, useState } from 'react';
import api from '../../api/axios';
import type { Task } from '../../types';
import { Plus, X, Loader2, Calendar, User, Trash2, AlertCircle } from 'lucide-react';

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'my'>('my');
  const [showCreate, setShowCreate] = useState(false);

  const loadTasks = () => {
    const query = filter === 'my' ? '?my=true' : '';
    api.get<Task[]>(`/tasks${query}`)
      .then((res) => setTasks(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    loadTasks();
  }, [filter]);

  const updateStatus = async (id: number, status: Task['status']) => {
    await api.patch(`/tasks/${id}/status`, { status });
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const deleteTask = async (id: number) => {
    if (!confirm('Удалить задачу?')) return;
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  if (loading) return <div className="text-center py-20"><Loader2 size={40} className="animate-spin text-primary-600 mx-auto" /></div>;

  const COLUMNS: { status: Task['status']; title: string; color: string; bgColor: string }[] = [
    { status: 'todo', title: '📝 К выполнению', color: 'border-gray-400', bgColor: 'bg-gray-50' },
    { status: 'in_progress', title: '⚙️ В работе', color: 'border-yellow-500', bgColor: 'bg-yellow-50' },
    { status: 'done', title: '✅ Завершено', color: 'border-green-500', bgColor: 'bg-green-50' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Задачи</h1>
          <p className="text-gray-500 mt-1">Всего: <span className="font-semibold text-gray-700">{tasks.length}</span></p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary-600/30"
        >
          <Plus size={18} />
          Новая задача
        </button>
      </div>

      {/* Фильтры */}
      <div className="flex gap-2 mb-6 bg-white p-1 rounded-xl border border-gray-100 w-fit">
        <button
          onClick={() => setFilter('my')}
          className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${filter === 'my' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Мои задачи
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${filter === 'all' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
        >
          Все задачи
        </button>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.status);
          return (
            <div key={col.status} className={`bg-white rounded-2xl shadow-sm border-t-4 ${col.color} overflow-hidden`}>
              <div className={`${col.bgColor} p-3`}>
                <h3 className="font-bold text-gray-800 flex justify-between items-center text-sm">
                  {col.title}
                  <span className="bg-white px-2 py-0.5 rounded-full text-xs text-gray-700 font-semibold shadow-sm">{colTasks.length}</span>
                </h3>
              </div>
              <div className="p-2 space-y-2 min-h-[300px] max-h-[600px] overflow-y-auto">
                {colTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onStatusChange={(s) => updateStatus(task.id, s)} onDelete={() => deleteTask(task.id)} />
                ))}
                {colTasks.length === 0 && <p className="text-center text-gray-300 text-xs py-8">Пусто</p>}
              </div>
            </div>
          );
        })}
      </div>

      {showCreate && <CreateTaskModal onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); loadTasks(); }} />}
    </div>
  );
}

function TaskCard({ task, onStatusChange, onDelete }: { task: Task; onStatusChange: (s: Task['status']) => void; onDelete: () => void }) {
  const isOverdue = task.deadline && task.status !== 'done' && new Date(task.deadline) < new Date();

  return (
    <div className={`group bg-white border rounded-xl p-3 hover:shadow-lg transition-all ${isOverdue ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-primary-300'}`}>
      <div className="flex justify-between items-start mb-2 gap-2">
        <p className="font-semibold text-gray-900 text-sm flex-1">{task.title}</p>
        <button onClick={onDelete} className="text-gray-300 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-all" title="Удалить">
          <Trash2 size={14} />
        </button>
      </div>

      {task.description && <p className="text-xs text-gray-600 mb-2">{task.description}</p>}

      <div className="space-y-1 text-xs">
        {task.assigned_name && (
          <p className="flex items-center gap-1.5 text-gray-500"><User size={11} />{task.assigned_name}</p>
        )}
        {task.deadline && (
          <p className={`flex items-center gap-1.5 ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
            {isOverdue ? <AlertCircle size={11} /> : <Calendar size={11} />}
            {new Date(task.deadline).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
            {isOverdue && ' • просрочена'}
          </p>
        )}
      </div>

      <select
        value={task.status}
        onChange={(e) => onStatusChange(e.target.value as Task['status'])}
        className="w-full mt-2 text-xs border border-gray-200 rounded-lg px-2 py-1 bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="todo">К выполнению</option>
        <option value="in_progress">В работе</option>
        <option value="done">Завершено</option>
      </select>
    </div>
  );
}

function CreateTaskModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState({ title: '', description: '', deadline: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/tasks', { title: form.title, description: form.description || null, deadline: form.deadline || null });
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
          <h2 className="text-xl font-bold text-gray-900">Новая задача</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название *</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Позвонить клиенту..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="Подробности..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Дедлайн</label>
            <input type="datetime-local" name="deadline" value={form.deadline} onChange={handleChange}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-sm">{error}</div>}

          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all disabled:bg-gray-400 flex items-center justify-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} />Создать</>}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Tasks;