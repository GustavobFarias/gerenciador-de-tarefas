import { Card } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Calendar, ArrowLeft, Trash2 } from 'lucide-react';
import { Task } from './TaskItem';
import { TaskItem } from './TaskItem';

export interface ArchivedWeek {
  id: string;
  startDate: string;
  endDate: string;
  tasks: Task[];
}

interface WeekHistoryProps {
  archivedWeeks: ArchivedWeek[];
  onBack: () => void;
  onDeleteWeek: (weekId: string) => void;
}

const daysOfWeek = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo'
];

export function WeekHistory({ archivedWeeks, onBack, onDeleteWeek }: WeekHistoryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getTasksForDay = (tasks: Task[], dayIndex: number) => {
    const dayTasks = tasks.filter(task => task.dayOfWeek === dayIndex);
    return dayTasks.sort((a, b) => {
      if (!a.time && !b.time) return 0;
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });
  };

  const getWeekStats = (week: ArchivedWeek) => {
    const completed = week.tasks.filter(t => t.completed).length;
    const total = week.tasks.length;
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1>Histórico de Semanas</h1>
                <p className="text-sm text-muted-foreground">
                  {archivedWeeks.length} {archivedWeeks.length === 1 ? 'semana arquivada' : 'semanas arquivadas'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {archivedWeeks.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2>Nenhuma semana arquivada</h2>
            <p className="text-muted-foreground mt-2">
              Suas semanas anteriores aparecerão aqui
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {archivedWeeks.map((week) => {
              const stats = getWeekStats(week);
              
              return (
                <Card key={week.id} className="overflow-hidden">
                  <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <h3>{formatDate(week.startDate)} - {formatDate(week.endDate)}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {stats.completed}/{stats.total} tarefas concluídas ({stats.percentage}%)
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm('Deseja excluir esta semana do histórico?')) {
                          onDeleteWeek(week.id);
                        }
                      }}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
                      {daysOfWeek.map((day, index) => {
                        const dayTasks = getTasksForDay(week.tasks, index);
                        const dayCompleted = dayTasks.filter(t => t.completed).length;
                        
                        return (
                          <div key={index} className="space-y-2">
                            <div className="pb-2 border-b">
                              <h4 className="text-sm">{day}</h4>
                              <p className="text-xs text-muted-foreground">
                                {dayTasks.length > 0 ? `${dayCompleted}/${dayTasks.length}` : 'Sem tarefas'}
                              </p>
                            </div>
                            <div className="space-y-2">
                              {dayTasks.length === 0 ? (
                                <p className="text-xs text-muted-foreground text-center py-2">
                                  -
                                </p>
                              ) : (
                                dayTasks.map(task => (
                                  <div
                                    key={task.id}
                                    className="p-2 rounded border bg-card text-sm"
                                  >
                                    <div className="flex items-start gap-2">
                                      <input
                                        type="checkbox"
                                        checked={task.completed}
                                        readOnly
                                        className="mt-0.5"
                                      />
                                      <div className="flex-1">
                                        <p className={task.completed ? 'line-through text-muted-foreground' : ''}>
                                          {task.title}
                                        </p>
                                        {task.time && (
                                          <p className="text-xs text-muted-foreground mt-1">
                                            {task.time}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
