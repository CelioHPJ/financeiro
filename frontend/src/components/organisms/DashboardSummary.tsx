import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DashboardData } from '../../lib/types';
import { formatCurrency } from '../../lib/utils';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

interface Props {
  data: DashboardData;
}

const COLORS: Record<string, string> = {
  MORADIA: '#60a5fa',     
  ALIMENTACAO: '#34d399', 
  TRANSPORTE: '#fbbf24',  
  SAUDE: '#fb7185',       
  LAZER: '#a78bfa',       
  COMPRAS: '#f472b6',     
  OUTROS: '#94a3b8',      
};

const CATEGORY_LABELS: Record<string, string> = {
  MORADIA: 'Moradia',
  ALIMENTACAO: 'Alimentação',
  TRANSPORTE: 'Transporte',
  SAUDE: 'Saúde',
  LAZER: 'Lazer',
  COMPRAS: 'Compras',
  OUTROS: 'Outros',
};

export function DashboardSummary({ data }: Props) {
  const { balance, totalIncome, totalExpense, categorySummary } = data;

  const chartData = categorySummary.map((s) => ({
    name: CATEGORY_LABELS[s.category],
    value: s.total,
    color: COLORS[s.category] || COLORS.OUTROS,
  })).sort((a, b) => b.value - a.value);

  const isPositive = balance >= 0;
  
  // Cálculo da barra de progresso
  const progressPercent = totalIncome > 0 
    ? Math.min((totalExpense / totalIncome) * 100, 100) 
    : (totalExpense > 0 ? 100 : 0);
  
  const isOverspent = totalExpense > totalIncome;

  return (
    <div className="space-y-6">
      {/* O Cartão de Crédito Premium (Saldo) */}
      <div className={`relative rounded-[2rem] p-8 shadow-[0_15px_30px_rgba(0,0,0,0.1)] overflow-hidden transition-colors duration-500 ${
        isPositive 
          ? 'bg-gradient-to-br from-violet-600 via-indigo-600 to-indigo-800' 
          : 'bg-gradient-to-br from-rose-500 via-rose-600 to-red-700'
      }`}>
        <div className="relative z-10">
          <p className="text-white/80 font-medium text-sm md:text-base uppercase tracking-widest mb-2">
            Saldo Disponível
          </p>
          <h2 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
            {formatCurrency(balance)}
          </h2>
          
          <div className="mt-8 pt-6 border-t border-white/20 grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-300 mb-1">
                <ArrowUpCircle size={16} />
                <span className="text-xs uppercase font-bold tracking-wider">Entradas</span>
              </div>
              <p className="text-white font-bold text-lg">{formatCurrency(totalIncome)}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-rose-300 mb-1">
                <ArrowDownCircle size={16} />
                <span className="text-xs uppercase font-bold tracking-wider">Saídas</span>
              </div>
              <p className="text-white font-bold text-lg">{formatCurrency(totalExpense)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Progresso (Gasto vs Receita) */}
      {(totalIncome > 0 || totalExpense > 0) && (
        <div className="bg-white rounded-[1.5rem] p-6 shadow-premium">
          <div className="flex justify-between items-end mb-3">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Orçamento Consumido</span>
            <span className={`font-bold ${isOverspent ? 'text-rose-500' : 'text-slate-800'}`}>
              {progressPercent.toFixed(0)}%
            </span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${isOverspent ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          {isOverspent && (
            <p className="text-xs text-rose-500 mt-2 font-medium">Atenção: Seus gastos ultrapassaram suas receitas.</p>
          )}
        </div>
      )}

      {/* Gráfico de Despesas */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-premium flex flex-col md:flex-row lg:flex-col gap-8 items-center">
          <div className="w-full h-48 sm:h-56 shrink-0 md:w-1/2 lg:w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  innerRadius="65%"
                  outerRadius="100%"
                  paddingAngle={6}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={10}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ 
                    borderRadius: '16px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', fontWeight: 600, color: '#1e293b'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Texto central no Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Saídas</span>
            </div>
          </div>

          {/* Legenda Customizada Premium */}
          <div className="w-full md:w-1/2 lg:w-full space-y-3">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                  <span className="font-semibold text-slate-700 text-sm">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 text-sm">
                  {formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
