import { useState } from 'react';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { Trash2, Edit2, GripVertical, Clock } from 'lucide-react';
import { cn } from './ui/utils';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dayOfWeek: number; // 0 = segunda, 6 = domingo
  time?: string; // Horário no formato HH:mm
}

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "group flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors",
        task.completed && "opacity-60"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggle(task.id)}
      />

      <div className="flex-1 flex flex-col gap-1">
        <span
          className={cn(
            "transition-all",
            task.completed && "line-through text-muted-foreground"
          )}
        >
          {task.title}
        </span>
        {task.time && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{task.time}</span>
          </div>
        )}
      </div>

      <div className={cn(
        "flex items-center gap-1 transition-opacity",
        !isHovered && "opacity-0"
      )}>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onEdit(task)}
        >
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={() => onDelete(task.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
