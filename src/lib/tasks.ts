import { createClient } from '@supabase/supabase-js'

export type Priority = 'Rendah' | 'Normal' | 'Tinggi'

export interface Task {
  id: string
  user_id?: string
  title: string
  description: string
  due_date: string | null
  priority: Priority
  is_completed: boolean
  created_at: string
}

export type TaskDraft = Pick<Task, 'title' | 'description' | 'due_date' | 'priority'>

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project'),
)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

const STORAGE_KEY = 'ruangtugas.tasks.v1'

function readLocalTasks(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as Task[]) : []
  } catch {
    throw new Error('Data demo tidak bisa dibaca dari penyimpanan browser.')
  }
}

function saveLocalTasks(tasks: Task[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    throw new Error('Data demo tidak bisa disimpan. Periksa ruang penyimpanan browser.')
  }
}

export async function fetchTasks(): Promise<Task[]> {
  if (!supabase) return readLocalTasks()
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Task[]
}

export async function createTask(draft: TaskDraft): Promise<Task> {
  if (!supabase) {
    const task: Task = {
      ...draft,
      id: crypto.randomUUID(),
      is_completed: false,
      created_at: new Date().toISOString(),
    }
    saveLocalTasks([task, ...readLocalTasks()])
    return task
  }
  const { data, error } = await supabase.from('tasks').insert(draft).select().single()
  if (error) throw error
  return data as Task
}

export async function updateTask(id: string, changes: Partial<Task>): Promise<Task> {
  if (!supabase) {
    const tasks = readLocalTasks()
    const updated = tasks.map((task) => task.id === id ? { ...task, ...changes } : task)
    const task = updated.find((item) => item.id === id)
    if (!task) throw new Error('Tugas tidak ditemukan.')
    saveLocalTasks(updated)
    return task
  }
  const { data, error } = await supabase
    .from('tasks')
    .update(changes)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as Task
}

export async function removeTask(id: string): Promise<void> {
  if (!supabase) {
    saveLocalTasks(readLocalTasks().filter((task) => task.id !== id))
    return
  }
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throw error
}
