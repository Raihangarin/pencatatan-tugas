import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowDown, ArrowUpRight, CalendarDays, Check, CheckCheck, ChevronDown,
  Circle, ClipboardList, Clock3, Coffee, LayoutDashboard, LogOut, Menu,
  Plus, Search, Sparkles, Target, Trash2, X,
} from 'lucide-react'
import {
  createTask, fetchTasks, isSupabaseConfigured, removeTask, supabase, updateTask,
} from './lib/tasks'
import type { Priority, Task, TaskDraft } from './lib/tasks'

type View = 'all' | 'today' | 'upcoming' | 'completed'
type AuthMode = 'signin' | 'signup'

const today = () => {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}
const dateLabel = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
})

function isOverdue(task: Task) {
  return Boolean(task.due_date && task.due_date < today() && !task.is_completed)
}

function formatDueDate(value: string) {
  const parsed = new Date(`${value}T00:00:00`)
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(parsed)
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [view, setView] = useState<View>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [session, setSession] = useState<{ email?: string } | null>(null)
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured)
  const [authMode, setAuthMode] = useState<AuthMode>('signin')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [mobileMenu, setMobileMenu] = useState(false)

  useEffect(() => {
    if (!supabase) return
    let active = true
    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return
      if (sessionError) setError(sessionError.message)
      setSession(data.session?.user ? { email: data.session.user.email } : null)
      setAuthReady(true)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession?.user ? { email: nextSession.user.email } : null)
      setError('')
    })
    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (isSupabaseConfigured && !session) {
      setTasks([])
      setLoading(false)
      return
    }
    let active = true
    setLoading(true)
    fetchTasks()
      .then((result) => { if (active) setTasks(result) })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : 'Tugas gagal dimuat.')
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [session])

  const counts = useMemo(() => ({
    all: tasks.filter((task) => !task.is_completed).length,
    today: tasks.filter((task) => !task.is_completed && task.due_date === today()).length,
    upcoming: tasks.filter((task) => !task.is_completed && task.due_date && task.due_date > today()).length,
    completed: tasks.filter((task) => task.is_completed).length,
  }), [tasks])

  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const matchesSearch = `${task.title} ${task.description}`.toLowerCase().includes(search.toLowerCase())
    const matchesView = view === 'completed'
      ? task.is_completed
      : view === 'today'
        ? !task.is_completed && task.due_date === today()
        : view === 'upcoming'
          ? !task.is_completed && Boolean(task.due_date && task.due_date > today())
          : !task.is_completed
    return matchesSearch && matchesView
  }), [tasks, search, view])

  const heading = {
    all: 'Semua tugas',
    today: 'Untuk hari ini',
    upcoming: 'Akan datang',
    completed: 'Selesai',
  }[view]

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase) return
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') || '').trim()
    const password = String(data.get('password') || '')
    setSaving(true)
    setError('')
    const result = authMode === 'signin'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })
    setSaving(false)
    if (result.error) {
      setError(result.error.message)
    } else if (authMode === 'signup' && !result.data.session) {
      setError('Akun berhasil dibuat. Periksa email untuk konfirmasi, lalu masuk.')
    }
  }

  async function saveTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const draft: TaskDraft = {
      title: String(data.get('title') || '').trim(),
      description: String(data.get('description') || '').trim(),
      due_date: String(data.get('due_date') || '') || null,
      priority: String(data.get('priority') || 'Normal') as Priority,
    }
    if (!draft.title) return
    setSaving(true)
    setError('')
    try {
      const saved = editing
        ? await updateTask(editing.id, draft)
        : await createTask(draft)
      setTasks((current) => editing
        ? current.map((task) => task.id === saved.id ? saved : task)
        : [saved, ...current])
      setShowForm(false)
      setEditing(null)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Tugas gagal disimpan.')
    } finally {
      setSaving(false)
    }
  }

  async function toggleTask(task: Task) {
    setError('')
    try {
      const updated = await updateTask(task.id, { is_completed: !task.is_completed })
      setTasks((current) => current.map((item) => item.id === task.id ? updated : item))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Status tugas gagal diperbarui.')
    }
  }

  async function deleteTask(task: Task) {
    if (!window.confirm(`Hapus tugas "${task.title}"?`)) return
    setError('')
    try {
      await removeTask(task.id)
      setTasks((current) => current.filter((item) => item.id !== task.id))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Tugas gagal dihapus.')
    }
  }

  async function signOut() {
    if (!supabase) return
    const { error: signOutError } = await supabase.auth.signOut()
    if (signOutError) setError(signOutError.message)
  }

  function openForm(task?: Task) {
    setEditing(task ?? null)
    setShowForm(true)
  }

  if (!authReady || loading) {
    return <div className="loading-screen"><span className="loader" />Menyiapkan ruang tugas...</div>
  }

  if (isSupabaseConfigured && !session) {
    return (
      <main className="auth-page">
        <section className="auth-card">
          <div className="brand-mark"><CheckCheck size={22} /></div>
          <span className="eyebrow">RUANGTUGAS</span>
          <h1>{authMode === 'signin' ? 'Senang melihatmu lagi.' : 'Mulai langkah kecil.'}</h1>
          <p>Masuk untuk menyimpan dan melanjutkan semua rencanamu.</p>
          {error && <div className="notice error-notice">{error}</div>}
          <form onSubmit={handleAuth} className="auth-form">
            <label>Email<input name="email" type="email" placeholder="nama@email.com" required /></label>
            <label>Kata sandi<input name="password" type="password" placeholder="Minimal 6 karakter" minLength={6} required /></label>
            <button className="primary-button full-button" disabled={saving}>
              {saving ? 'Memproses...' : authMode === 'signin' ? 'Masuk ke akun' : 'Buat akun'}
              <ArrowUpRight size={17} />
            </button>
          </form>
          <button className="text-button auth-switch" onClick={() => { setError(''); setAuthMode(authMode === 'signin' ? 'signup' : 'signin') }}>
            {authMode === 'signin' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
          </button>
          <a className="back-link" href="/">← Kembali ke beranda</a>
        </section>
      </main>
    )
  }

  return (
    <div className="app-shell">
      {mobileMenu && <button className="mobile-backdrop" aria-label="Tutup menu" onClick={() => setMobileMenu(false)} />}
      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <a className="brand" href="#" aria-label="RuangTugas beranda">
          <span className="brand-mark"><CheckCheck size={21} /></span>
          <span>ruang<span className="brand-light">tugas</span><small>RUANG UNTUK FOKUS</small></span>
        </a>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="nav-list" aria-label="Navigasi tugas">
          <button className={`nav-item ${view === 'all' ? 'active' : ''}`} onClick={() => { setView('all'); setMobileMenu(false) }}>
            <LayoutDashboard size={18} /><span>Semua tugas</span><span className="nav-count">{counts.all}</span>
          </button>
          <button className={`nav-item ${view === 'today' ? 'active' : ''}`} onClick={() => { setView('today'); setMobileMenu(false) }}>
            <Target size={18} /><span>Hari ini</span><span className="nav-count">{counts.today}</span>
          </button>
          <button className={`nav-item ${view === 'upcoming' ? 'active' : ''}`} onClick={() => { setView('upcoming'); setMobileMenu(false) }}>
            <CalendarDays size={18} /><span>Akan datang</span><span className="nav-count">{counts.upcoming}</span>
          </button>
          <button className={`nav-item ${view === 'completed' ? 'active' : ''}`} onClick={() => { setView('completed'); setMobileMenu(false) }}>
            <Check size={18} /><span>Selesai</span><span className="nav-count">{counts.completed}</span>
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div className="focus-card">
            <span className="focus-icon"><Sparkles size={16} /></span>
            <strong>Pelan-pelan saja.</strong>
            <p>Satu tugas yang selesai lebih baik dari sepuluh yang hanya direncanakan.</p>
          </div>
          <div className="profile-row">
            <span className="avatar">{(session?.email?.[0] || 'K').toUpperCase()}</span>
            <span className="profile-name"><strong>{session?.email ? session.email.split('@')[0] : 'Kamu'}</strong><small>{session?.email || 'Ruang pribadi'}</small></span>
            {session && <button className="icon-button logout-button" title="Keluar" onClick={signOut}><LogOut size={16} /></button>}
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button menu-button" aria-label="Buka menu" onClick={() => setMobileMenu(true)}><Menu size={21} /></button>
          <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>{heading}</strong></div>
          <div className="topbar-right">
            <span className="today-date"><CalendarDays size={15} />{dateLabel.format(new Date())}</span>
            <button className="primary-button top-add" onClick={() => openForm()}><Plus size={17} />Tugas baru</button>
          </div>
        </header>

        <div className="content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">RUANG KERJAMU HARI INI</div>
              <h1>{view === 'today' ? 'Fokus untuk hari ini.' : 'Sedikit demi sedikit.'}</h1>
              <p>{counts.all === 0 ? 'Kosongkan pikiran, catat apa yang ingin kamu selesaikan.' : `Kamu punya ${counts.all} ${counts.all === 1 ? 'tugas' : 'tugas'} yang menunggu. Mulai dari yang paling penting.`}</p>
            </div>
            <div className="welcome-art" aria-hidden="true"><div className="sun-shape" /><div className="art-note"><span>hari ini</span><strong>cukup satu<br />langkah.</strong><Check size={16} /></div><div className="art-sparkle sparkle-one">✳</div><div className="art-sparkle sparkle-two">✳</div></div>
          </section>

          {!isSupabaseConfigured && <div className="demo-banner"><Sparkles size={16} /><span><strong>Mode demo</strong> — tugas tersimpan di browser ini. Atur kredensial Supabase untuk sinkronisasi akun.</span></div>}
          {error && <div className="notice error-notice"><span>{error}</span><button className="icon-button" aria-label="Tutup pesan" onClick={() => setError('')}><X size={16} /></button></div>}

          <section className="stat-grid" aria-label="Ringkasan tugas">
            <article className="stat-card"><span className="stat-icon mint"><ClipboardList size={18} /></span><span className="stat-label">Belum selesai</span><strong>{counts.all.toString().padStart(2, '0')}</strong><small>tugas tersisa</small></article>
            <article className="stat-card"><span className="stat-icon peach"><Clock3 size={18} /></span><span className="stat-label">Agenda hari ini</span><strong>{counts.today.toString().padStart(2, '0')}</strong><small>perlu perhatianmu</small></article>
            <article className="stat-card"><span className="stat-icon lilac"><CheckCheck size={18} /></span><span className="stat-label">Sudah selesai</span><strong>{counts.completed.toString().padStart(2, '0')}</strong><small>langkah tercapai</small></article>
          </section>

          <section className="task-section">
            <div className="section-heading">
              <div><h2>{heading}<span className="heading-count">{filteredTasks.length}</span></h2><p>Daftar kecil untuk membuat hari terasa lebih ringan.</p></div>
              <div className="task-tools">
                <label className="search-box"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari tugas..." aria-label="Cari tugas" />{search && <button className="icon-button clear-search" aria-label="Hapus pencarian" onClick={() => setSearch('')}><X size={14} /></button>}</label>
                <button className="filter-button" onClick={() => setView('all')}>Semua <ChevronDown size={14} /></button>
              </div>
            </div>
            <div className="task-list">
              {filteredTasks.length === 0 ? (
                <div className="empty-state"><span className="empty-icon">{view === 'completed' ? <Coffee size={23} /> : <Circle size={23} />}</span><strong>{search ? 'Tidak ada tugas yang cocok' : view === 'completed' ? 'Belum ada yang selesai' : 'Ruangmu masih lega'}</strong><p>{search ? 'Coba kata kunci lain.' : view === 'completed' ? 'Tugas yang kamu selesaikan akan muncul di sini.' : 'Tambahkan satu tugas kecil untuk memulai.'}</p>{!search && view !== 'completed' && <button className="text-button" onClick={() => openForm()}><Plus size={15} /> Tambah tugas pertama</button>}</div>
              ) : filteredTasks.map((task) => (
                <article className={`task-row ${task.is_completed ? 'task-completed' : ''}`} key={task.id}>
                  <button className={`task-check ${task.is_completed ? 'checked' : ''}`} aria-label={task.is_completed ? 'Tandai belum selesai' : 'Tandai selesai'} onClick={() => toggleTask(task)}>{task.is_completed && <Check size={14} />}</button>
                  <button className="task-main" onClick={() => openForm(task)}>
                    <span className="task-title">{task.title}</span>
                    {task.description && <span className="task-description">{task.description}</span>}
                  </button>
                  <div className="task-meta">
                    {task.due_date && <span className={`due-date ${isOverdue(task) ? 'overdue' : ''}`}><CalendarDays size={14} />{formatDueDate(task.due_date)}{isOverdue(task) && <span className="overdue-label">Terlambat</span>}</span>}
                    <span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority === 'Tinggi' ? <ArrowUpRight size={12} /> : task.priority === 'Rendah' ? <ArrowDown size={12} /> : <span className="priority-dot" />}{task.priority}</span>
                    <button className="icon-button delete-button" aria-label={`Hapus ${task.title}`} title="Hapus tugas" onClick={() => deleteTask(task)}><Trash2 size={15} /></button>
                  </div>
                </article>
              ))}
              {filteredTasks.length > 0 && <button className="add-task-row" onClick={() => openForm()}><Plus size={16} />Tambah tugas baru</button>}
            </div>
          </section>
          <footer className="page-footer"><span>Tarik napas. Kamu sudah melakukan yang terbaik.</span><span>RUANGTUGAS · 2026</span></footer>
        </div>
      </main>

      {showForm && (
        <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) { setShowForm(false); setEditing(null) } }}>
          <section className="task-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-heading"><div><span className="eyebrow">{editing ? 'PERBARUI RENCANA' : 'CATAT IDEMU'}</span><h2 id="modal-title">{editing ? 'Edit tugas' : 'Tugas baru'}</h2></div><button className="icon-button modal-close" aria-label="Tutup" onClick={() => { setShowForm(false); setEditing(null) }}><X size={19} /></button></div>
            <form onSubmit={saveTask}>
              <label className="form-field">Nama tugas<input autoFocus name="title" defaultValue={editing?.title} placeholder="Contoh: Selesaikan halaman katalog" maxLength={120} required /></label>
              <label className="form-field">Catatan <span className="optional">opsional</span><textarea name="description" defaultValue={editing?.description} placeholder="Tambahkan detail kecil agar lebih mudah dimulai..." rows={3} maxLength={500} /></label>
              <div className="form-two-col">
                <label className="form-field">Tenggat waktu<input name="due_date" type="date" defaultValue={editing?.due_date || ''} /></label>
                <label className="form-field">Prioritas<select name="priority" defaultValue={editing?.priority || 'Normal'}><option>Rendah</option><option>Normal</option><option>Tinggi</option></select></label>
              </div>
              <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => { setShowForm(false); setEditing(null) }}>Batal</button><button type="submit" className="primary-button" disabled={saving}>{saving ? 'Menyimpan...' : editing ? 'Simpan perubahan' : <><Plus size={16} />Simpan tugas</>}</button></div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

export default App
