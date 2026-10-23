"use client";

export interface ExerciseCardProps {
  exercise: any;
  onToggle?: (exerciseId: string) => void;
  onStart?: (exerciseId: string) => void;
}

export function ExerciseCard({ exercise, onToggle, onStart }: ExerciseCardProps) {
  const completed = exercise.completed;
  const progressText = completed ? "Completed" : "Pending";
  const levelText = exercise.level || "Beginner";

  const hoverClass = `
    transition-all duration-300
    transform translate-y-[-2px]
    shadow-lg shadow-primary/10
  `;

  return (
    <article
      className={`
        card p-4 border-l-4 border-transition-colors hover:border-primary cursor-pointer
        ${completed && "border-teal"}
        ${hoverClass}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3 mb-2">
          <i className="dumbbell" size={24} className="text-primary/80" />
          <h3 className="font-medium">
            {exercise.name}
          </h3>
        </div>
        <p className="text-sm text-muted line-clamp-2">
          {exercise.instructions || "No instructions provided"}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-muted">
            {levelText}
          </span>
          <span className="text-xs rounded px-2 py-1">
            {progressText}
          </span>
        </div>
      </div>
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
        {completed ? (
          <i className="check" size={18} className="text-white" />
        ) : (
          <i className="play" size={16} className="text-white" />
        )}
      </div>
      {onToggle && (
        <button
          onClick={() => onToggle(exercise.id)}
          className="mt-3 w-full justify-center py-2 text-primary hover:text-primary/90 transition-colors"
        >
          {completed ? "Mark incomplete" : "Mark complete"}
        </button>
      )}
      {onStart && (
        <button
          onClick={() => onStart(exercise.id)}
          className="mt-3 w-full justify-center py-2 bg-primary text-white rounded text-sm hover:bg-primary/90 transition-colors"
        >
          Start exercise
        </button>
      )}
    </article>
  );
}