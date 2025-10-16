import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { LogOut, Sun, Moon, History } from 'lucide-react';
import { WeekView } from './WeekView';
import { WeekHistory, ArchivedWeek } from './WeekHistory';
import { Task } from './TaskItem';

interface TaskListAppProps {
  username: string;
  onLogout: () => void;
}

type View = 'current' | 'history';

export function TaskListApp({ username, onLogout }: TaskListAppProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [currentView, setCurrentView] = useState<View>('current');
  const [archivedWeeks, setArchivedWeeks] = useState<ArchivedWeek[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState<string>('');

  // Obter o início da semana atual (segunda-feira)
  const getWeekStart = (date: Date = new Date()): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajusta para segunda-feira
    return new Date(d.setDate(diff));
  };

  // Obter o fim da semana (domingo)
  const getWeekEnd = (startDate: Date): Date => {
    const end = new Date(startDate);
    end.setDate(end.getDate() + 6);
    return end;
  };

  // Formatar data para string
  const formatDateString = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Inicializar semana atual
  useEffect(() => {
    const weekStart = getWeekStart();
    const weekStartString = formatDateString(weekStart);
    
    const savedWeekStart = localStorage.getItem(`current_week_start_${username}`);
    
    if (savedWeekStart) {
      const savedDate = new Date(savedWeekStart);
      const currentDate = new Date();
      
      // Verificar se a semana mudou
      if (savedDate < weekStart) {
        // Arquivar a semana anterior
        archiveCurrentWeek(savedWeekStart);
        // Iniciar nova semana
        setCurrentWeekStart(weekStartString);
        localStorage.setItem(`current_week_start_${username}`, weekStartString);
        setTasks([]);
        localStorage.removeItem(`tasks_${username}`);
      } else {
        setCurrentWeekStart(savedWeekStart);
      }
    } else {
      setCurrentWeekStart(weekStartString);
      localStorage.setItem(`current_week_start_${username}`, weekStartString);
    }
  }, [username]);

  // Carregar tarefas do localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem(`tasks_${username}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, [username]);

  // Carregar semanas arquivadas
  useEffect(() => {
    const savedWeeks = localStorage.getItem(`archived_weeks_${username}`);
    if (savedWeeks) {
      setArchivedWeeks(JSON.parse(savedWeeks));
    }
  }, [username]);

  // Salvar tarefas no localStorage
  useEffect(() => {
    if (tasks.length > 0 || localStorage.getItem(`tasks_${username}`)) {
      localStorage.setItem(`tasks_${username}`, JSON.stringify(tasks));
    }
  }, [tasks, username]);

  // Salvar semanas arquivadas
  useEffect(() => {
    if (archivedWeeks.length > 0) {
      localStorage.setItem(`archived_weeks_${username}`, JSON.stringify(archivedWeeks));
    }
  }, [archivedWeeks, username]);

  // Theme toggle
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Arquivar semana atual
  const archiveCurrentWeek = (weekStartString: string) => {
    const savedTasks = localStorage.getItem(`tasks_${username}`);
    if (savedTasks) {
      const tasksToArchive = JSON.parse(savedTasks);
      if (tasksToArchive.length > 0) {
        const weekStart = new Date(weekStartString);
        const weekEnd = getWeekEnd(weekStart);
        
        const newArchivedWeek: ArchivedWeek = {
          id: weekStartString,
          startDate: formatDateString(weekStart),
          endDate: formatDateString(weekEnd),
          tasks: tasksToArchive
        };

        const currentArchived = localStorage.getItem(`archived_weeks_${username}`);
        const archived = currentArchived ? JSON.parse(currentArchived) : [];
        archived.unshift(newArchivedWeek); // Adiciona no início
        localStorage.setItem(`archived_weeks_${username}`, JSON.stringify(archived));
        setArchivedWeeks(archived);
      }
    }
  };

  const handleAddTask = (title: string, dayOfWeek: number, time?: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      dayOfWeek,
      time
    };
    setTasks([...tasks, newTask]);
  };

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleDeleteWeek = (weekId: string) => {
    const updated = archivedWeeks.filter(week => week.id !== weekId);
    setArchivedWeeks(updated);
    if (updated.length === 0) {
      localStorage.removeItem(`archived_weeks_${username}`);
    }
  };

  const handleArchiveManually = () => {
    if (tasks.length === 0) {
      alert('Não há tarefas para arquivar');
      return;
    }
    
    if (confirm('Deseja arquivar a semana atual e começar uma nova?')) {
      archiveCurrentWeek(currentWeekStart);
      
      // Iniciar nova semana
      const newWeekStart = formatDateString(getWeekStart());
      setCurrentWeekStart(newWeekStart);
      localStorage.setItem(`current_week_start_${username}`, newWeekStart);
      setTasks([]);
      localStorage.removeItem(`tasks_${username}`);
    }
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;

  const getWeekDateRange = () => {
    if (!currentWeekStart) return '';
    const start = new Date(currentWeekStart);
    const end = getWeekEnd(start);
    return `${start.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} - ${end.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
  };

  if (currentView === 'history') {
    return (
      <WeekHistory
        archivedWeeks={archivedWeeks}
        onBack={() => setCurrentView('current')}
        onDeleteWeek={handleDeleteWeek}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1>Minhas Tarefas</h1>
              <p className="text-sm text-muted-foreground">
                Olá, {username}! {totalTasks > 0 && `${completedTasks}/${totalTasks} tarefas concluídas`}
              </p>
              {currentWeekStart && (
                <p className="text-xs text-muted-foreground mt-1">
                  Semana: {getWeekDateRange()}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentView('history')}
              >
                <History className="w-4 h-4 mr-2" />
                Histórico
                {archivedWeeks.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs">
                    {archivedWeeks.length}
                  </span>
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsDark(!isDark)}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button variant="outline" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <WeekView
          tasks={tasks}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onUpdateTask={handleUpdateTask}
        />

        {/* Archive Button */}
        {tasks.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              onClick={handleArchiveManually}
            >
              Arquivar semana e começar nova
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
