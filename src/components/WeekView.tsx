import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { Task, TaskItem } from './TaskItem';
import { AddTaskDialog } from './AddTaskDialog';
import { cn } from './ui/utils';

const daysOfWeek = [
  { name: 'Segunda', short: 'SEG' },
  { name: 'Terça', short: 'TER' },
  { name: 'Quarta', short: 'QUA' },
  { name: 'Quinta', short: 'QUI' },
  { name: 'Sexta', short: 'SEX' },
  { name: 'Sábado', short: 'SÁB' },
  { name: 'Domingo', short: 'DOM' }
];

interface WeekViewProps {
  tasks: Task[];
  onAddTask: (title: string, dayOfWeek: number, time?: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (task: Task) => void;
}

export function WeekView({ 
  tasks, 
  onAddTask, 
  onToggleTask, 
  onDeleteTask,
  onUpdateTask 
}: WeekViewProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddClick = (dayIndex: number) => {
    setSelectedDay(dayIndex);
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setSelectedDay(task.dayOfWeek);
    setDialogOpen(true);
  };

  const getTasksForDay = (dayIndex: number) => {
    const dayTasks = tasks.filter(task => task.dayOfWeek === dayIndex);
    // Ordenar por horário, tarefas sem horário vão para o final
    return dayTasks.sort((a, b) => {
      if (!a.time && !b.time) return 0;
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });
  };

  const getCompletedCount = (dayIndex: number) => {
    const dayTasks = getTasksForDay(dayIndex);
    const completed = dayTasks.filter(t => t.completed).length;
    return { completed, total: dayTasks.length };
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {daysOfWeek.map((day, index) => {
          const dayTasks = getTasksForDay(index);
          const { completed, total } = getCompletedCount(index);
          
          return (
            <Card key={index} className="flex flex-col">
              <div className="p-4 border-b bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-sm">{day.name}-feira</h3>
                    <p className="text-xs text-muted-foreground">
                      {total > 0 ? `${completed}/${total} concluídas` : 'Sem tarefas'}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => handleAddClick(index)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {total > 0 && (
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${(completed / total) * 100}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="flex-1 p-4 space-y-2 min-h-[200px]">
                {dayTasks.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-center text-muted-foreground text-sm">
                    Nenhuma tarefa
                  </div>
                ) : (
                  dayTasks.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={onToggleTask}
                      onDelete={onDeleteTask}
                      onEdit={handleEditClick}
                    />
                  ))
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <AddTaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={onAddTask}
        dayOfWeek={selectedDay}
        editingTask={editingTask}
        onUpdate={onUpdateTask}
      />
    </>
  );
}
