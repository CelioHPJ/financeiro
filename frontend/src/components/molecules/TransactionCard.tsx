import { Home, Utensils, Car, Pill, Gamepad2, ShoppingBag, ReceiptText, ArrowUpCircle, Briefcase, Landmark } from 'lucide-react';
import { Transaction } from '../../lib/types';
import { formatCurrency } from '../../lib/utils';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  transaction: Transaction;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  // Despesas
  MORADIA: <Home size={22} className="text-blue-600" />,
  ALIMENTACAO: <Utensils size={22} className="text-emerald-600" />,
  TRANSPORTE: <Car size={22} className="text-amber-600" />,
  SAUDE: <Pill size={22} className="text-rose-600" />,
  LAZER: <Gamepad2 size={22} className="text-violet-600" />,
  COMPRAS: <ShoppingBag size={22} className="text-pink-600" />,
  // Receitas
  SALARIO: <Briefcase size={22} className="text-emerald-600" />,
  RENDIMENTOS: <Landmark size={22} className="text-blue-600" />,
  PIX: <ArrowUpCircle size={22} className="text-emerald-600" />,
  FREELANCE: <Briefcase size={22} className="text-amber-600" />,
  // Geral
  OUTROS: <ReceiptText size={22} className="text-slate-600" />,
};

const CATEGORY_COLORS: Record<string, string> = {
  // Despesas
  MORADIA: 'bg-blue-100/70',
  ALIMENTACAO: 'bg-emerald-100/70',
  TRANSPORTE: 'bg-amber-100/70',
  SAUDE: 'bg-rose-100/70',
  LAZER: 'bg-violet-100/70',
  COMPRAS: 'bg-pink-100/70',
  // Receitas
  SALARIO: 'bg-emerald-100/70',
  RENDIMENTOS: 'bg-blue-100/70',
  PIX: 'bg-emerald-100/70',
  FREELANCE: 'bg-amber-100/70',
  // Geral
  OUTROS: 'bg-slate-100/70',
};

export function TransactionCard({ transaction }: Props) {
  const icon = CATEGORY_ICONS[transaction.category] || CATEGORY_ICONS.OUTROS;
  const bgColor = CATEGORY_COLORS[transaction.category] || CATEGORY_COLORS.OUTROS;
  
  const isIncome = transaction.type === 'INCOME';

  return (
    <div className="bg-white p-5 md:p-6 rounded-3xl shadow-premium flex items-center gap-5 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 ease-in-out cursor-default">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${bgColor}`}>
        {icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-800 text-lg truncate">{transaction.description}</h3>
        <p className="text-sm text-slate-400 capitalize mt-0.5 font-medium">
          {format(parseISO(transaction.date), "dd 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className={`font-extrabold text-xl tracking-tight ${isIncome ? 'text-emerald-600' : 'text-slate-800'}`}>
          {isIncome ? '+' : '-'} {formatCurrency(transaction.amount)}
        </p>
      </div>
    </div>
  );
}
