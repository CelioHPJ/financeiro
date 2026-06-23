import { useEffect, useState } from 'react';
import { Plus, User, LogOut } from 'lucide-react';
import { api } from '../../lib/api';
import { Transaction, DashboardData } from '../../lib/types';
import { DashboardSummary } from '../organisms/DashboardSummary';
import { TransactionCard } from '../molecules/TransactionCard';
import { TransactionModal } from '../organisms/TransactionModal';
import { MonthSelector } from '../molecules/MonthSelector';
import { useAuth } from '../../contexts/AuthContext';

export function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summaryData, setSummaryData] = useState<DashboardData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  
  const { user, signOut } = useAuth();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();
      
      const [transRes, summaryRes] = await Promise.all([
        api.get<Transaction[]>('/transactions', { params: { month, year } }),
        api.get<DashboardData>('/transactions/summary', { params: { month, year } }),
      ]);
      setTransactions(transRes.data);
      setSummaryData(summaryRes.data);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este registro?")) return;

    try {
      await api.delete(`/transactions/${id}`);
      
      // Atualiza a lista imediatamente (UI otimista)
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      
      // Atualiza o resumo silenciosamente
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();
      const summaryRes = await api.get<DashboardData>('/transactions/summary', { params: { month, year } });
      setSummaryData(summaryRes.data);
    } catch (error) {
      console.error('Erro ao deletar:', error);
      alert('Não foi possível excluir o item.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28 lg:pb-12 font-sans selection:bg-violet-200">
      <header className="pt-8 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white shadow-premium flex items-center justify-center border border-slate-100 overflow-hidden shrink-0">
              <User size={24} className="text-slate-400" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800">
                Olá, {user?.name.split(' ')[0]}!
              </h1>
              <p className="text-sm font-medium text-slate-500">Seu resumo financeiro</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <button
              onClick={signOut}
              className="flex items-center justify-center w-12 h-12 md:w-auto md:h-auto md:py-3.5 md:px-5 bg-white text-slate-500 rounded-2xl shadow-sm border border-slate-100 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 active:scale-95 transition-all duration-300 ease-in-out"
              title="Sair da Conta"
            >
              <LogOut size={20} />
              <span className="hidden md:block ml-2 font-bold">Sair</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="hidden md:flex items-center gap-2 bg-slate-900 text-white font-bold py-3.5 px-7 rounded-2xl shadow-premium hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300 ease-in-out"
            >
              <Plus size={20} />
              Lançar
            </button>
          </div>
        </div>
        
        {/* Componente de Navegação por Mês */}
        <div className="flex justify-center md:justify-start">
          <MonthSelector currentDate={selectedDate} onChange={setSelectedDate} />
        </div>
      </header>

      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 transition-opacity duration-300 ${isLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          <div className="lg:col-span-5 xl:col-span-5 space-y-8 lg:sticky lg:top-8 h-fit">
            {summaryData && <DashboardSummary data={summaryData} />}
          </div>

          <div className="lg:col-span-7 xl:col-span-7 space-y-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-slate-800">Extrato Mensal</h2>
              <span className="text-sm font-semibold text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm">
                {transactions.length} registros
              </span>
            </div>
            
            {transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl shadow-premium min-h-[300px]">
                <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-6">
                  <Plus size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Nenhuma transação</h3>
                <p className="text-slate-500 max-w-xs text-sm">
                  Não encontramos nenhum registro neste mês. Que tal adicionar o primeiro?
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <TransactionCard 
                    key={transaction.id} 
                    transaction={transaction} 
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      <button
        onClick={() => setIsModalOpen(true)}
        className="md:hidden fixed bottom-8 right-6 w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-full shadow-[0_10px_25px_rgba(99,102,241,0.5)] flex items-center justify-center active:scale-90 transition-transform duration-300 z-40"
        aria-label="Adicionar Lançamento"
      >
        <Plus size={32} />
      </button>

      {isModalOpen && (
        <TransactionModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchData();
          }} 
        />
      )}
    </div>
  );
}
