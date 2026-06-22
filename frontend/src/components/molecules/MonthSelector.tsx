import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  currentDate: Date;
  onChange: (date: Date) => void;
}

export function MonthSelector({ currentDate, onChange }: Props) {
  const handlePreviousMonth = () => {
    onChange(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    onChange(addMonths(currentDate, 1));
  };

  const formattedMonth = format(currentDate, "MMMM yyyy", { locale: ptBR });

  return (
    <div className="flex items-center justify-between w-full max-w-[260px] mx-auto bg-white rounded-full p-1.5 shadow-sm border border-slate-100">
      <button 
        onClick={handlePreviousMonth}
        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-full transition-colors active:scale-90"
        aria-label="Mês Anterior"
      >
        <ChevronLeft size={22} />
      </button>

      <span className="font-bold text-slate-700 capitalize w-32 text-center text-[15px] select-none tracking-tight">
        {formattedMonth}
      </span>

      <button 
        onClick={handleNextMonth}
        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-full transition-colors active:scale-90"
        aria-label="Próximo Mês"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}
