import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Task } from './TaskItem';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (title: string, dayOfWeek: number, startTime?: string, endTime?: string) => void;
  dayOfWeek: number;
  editingTask?: Task | null;
  onUpdate?: (task: Task) => void;
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

export function AddTaskDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  dayOfWeek,
  editingTask,
  onUpdate 
}: AddTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [selectedDay, setSelectedDay] = useState(dayOfWeek);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setSelectedDay(editingTask.dayOfWeek);
      setStartTime(editingTask.startTime || '');
      setEndTime(editingTask.endTime || '');
    } else {
      setTitle('');
      setSelectedDay(dayOfWeek);
      setStartTime('');
      setEndTime('');
    }
  }, [editingTask, dayOfWeek, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      if (editingTask && onUpdate) {
        onUpdate({
          ...editingTask,
          title: title.trim(),
          dayOfWeek: selectedDay,
          startTime: startTime || undefined,
          endTime: endTime || undefined
        });
      } else {
        onSave(title.trim(), selectedDay, startTime || undefined, endTime || undefined);
      }
      setTitle('');
      setStartTime('');
      setEndTime('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div className="space-y-2">
            <label htmlFor="task-title" className="text-sm">
              Título da tarefa
            </label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Comprar mantimentos"
              autoFocus
            />
          </div>

          {/* Dia da semana */}
          <div className="space-y-2">
            <label htmlFor="day-select" className="text-sm">
              Dia da semana
            </label>
            <select
              id="day-select"
              value={selectedDay}
              onChange={(e) => setSelectedDay(Number(e.target.value))}
              className="w-full p-2 rounded-lg border bg-background"
            >
              {daysOfWeek.map((day, index) => (
                <option key={index} value={index}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          {/* Horário de início */}
          <div className="space-y-2">
            <label htmlFor="task-start-time" className="text-sm">
              Horário de início (opcional)
            </label>
            <Input
              id="task-start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          {/* Horário de término */}
          <div className="space-y-2">
            <label htmlFor="task-end-time" className="text-sm">
              Horário de término (opcional)
            </label>
            <Input
              id="task-end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {editingTask ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
