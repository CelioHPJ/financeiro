import { X } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../../lib/api';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { formatCurrencyBRL, parseCurrencyToNumber } from '../../lib/formatters';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const transactionSchema = z.object({
  amount: z.number().positive('O valor deve ser maior que zero'),
  description: z.string().min(1, 'A descrição é obrigatória'),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.enum([
    'MORADIA', 'ALIMENTACAO', 'TRANSPORTE', 'SAUDE', 'LAZER', 'COMPRAS', 'OUTROS',
    'SALARIO', 'RENDIMENTOS', 'PIX', 'FREELANCE'
  ], {
    required_error: 'Selecione uma categoria',
  }),
  date: z.string().min(1, 'A data é obrigatória'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export function TransactionModal({ onClose, onSuccess }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');

  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      type: 'EXPENSE',
      date: format(new Date(), 'yyyy-MM-dd'),
    }
  });

  useEffect(() => {
    setValue('type', type);
    setValue('category', type === 'EXPENSE' ? 'OUTROS' : 'SALARIO'); // Reset category on type change
  }, [type, setValue]);

  const onSubmit = async (data: TransactionFormData) => {
    try {
      setIsSubmitting(true);
      
      await api.post('/transactions', data);
      onSuccess();
    } catch (error) {
      console.error('Erro ao salvar transação', error);
      alert('Ocorreu um erro ao salvar a transação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isIncome = type === 'INCOME';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-900/40 backdrop-blur-md transition-opacity"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-lg rounded-t-[2rem] md:rounded-[2.5rem] p-6 md:p-10 animate-in slide-in-from-bottom-10 md:slide-in-from-bottom-0 md:zoom-in-95 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Novo Lançamento</h2>
          <button 
            onClick={onClose}
            className="p-3 bg-slate-100/80 text-slate-400 rounded-full hover:bg-slate-200 hover:text-slate-700 active:scale-90 transition-all duration-300"
            aria-label="Fechar"
          >
            <X size={22} />
          </button>
        </div>

        {/* Toggle Segmentado (iOS Pill) */}
        <div className="flex p-1 bg-slate-100 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setType('EXPENSE')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
              !isIncome ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Nova Despesa
          </button>
          <button
            type="button"
            onClick={() => setType('INCOME')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
              isIncome ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Nova Receita
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Valor (R$)</label>
            <Controller
              name="amount"
              control={control}
              render={({ field: { onChange, value } }) => {
                const displayValue = value ? formatCurrencyBRL(value.toFixed(2).replace('.', '')) : "";
                return (
                  <input
                    type="text"
                    value={displayValue}
                    onChange={(e) => {
                      const numericValue = parseCurrencyToNumber(e.target.value);
                      onChange(numericValue);
                    }}
                    placeholder="0,00"
                    className={`w-full text-4xl md:text-5xl font-extrabold text-slate-800 bg-slate-100/80 border-none rounded-[1.5rem] p-5 md:p-6 focus:ring-4 outline-none transition-all placeholder:text-slate-300 ${isIncome ? 'focus:ring-emerald-500/30' : 'focus:ring-violet-500/30'}`}
                  />
                );
              }}
            />
            {errors.amount && <span className="text-rose-500 text-sm mt-2 ml-1 block font-medium">{errors.amount.message}</span>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Descrição</label>
            <input
              type="text"
              {...register('description')}
              placeholder={isIncome ? "Ex: Salário do mês" : "Ex: Supermercado"}
              className={`w-full bg-slate-100/80 text-lg md:text-xl font-medium text-slate-800 border-none rounded-[1.5rem] p-4 md:p-5 focus:ring-4 outline-none transition-all placeholder:text-slate-400 ${isIncome ? 'focus:ring-emerald-500/30' : 'focus:ring-violet-500/30'}`}
            />
            {errors.description && <span className="text-rose-500 text-sm mt-2 ml-1 block font-medium">{errors.description.message}</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Categoria</label>
              <select
                {...register('category')}
                className={`w-full bg-slate-100/80 text-lg md:text-xl font-medium text-slate-800 border-none rounded-[1.5rem] p-4 md:p-5 focus:ring-4 outline-none appearance-none transition-all cursor-pointer ${isIncome ? 'focus:ring-emerald-500/30' : 'focus:ring-violet-500/30'}`}
              >
                {isIncome ? (
                  <>
                    <option value="SALARIO">Salário</option>
                    <option value="RENDIMENTOS">Rendimentos</option>
                    <option value="PIX">Pix Recebido</option>
                    <option value="FREELANCE">Freelance</option>
                    <option value="OUTROS">Outros</option>
                  </>
                ) : (
                  <>
                    <option value="MORADIA">Moradia</option>
                    <option value="ALIMENTACAO">Alimentação</option>
                    <option value="TRANSPORTE">Transporte</option>
                    <option value="SAUDE">Saúde</option>
                    <option value="LAZER">Lazer</option>
                    <option value="COMPRAS">Compras</option>
                    <option value="OUTROS">Outros</option>
                  </>
                )}
              </select>
              {errors.category && <span className="text-rose-500 text-sm mt-2 ml-1 block font-medium">{errors.category.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Data</label>
              <input
                type="date"
                {...register('date')}
                className={`w-full bg-slate-100/80 text-lg md:text-xl font-medium text-slate-800 border-none rounded-[1.5rem] p-4 md:p-5 focus:ring-4 outline-none transition-all cursor-pointer ${isIncome ? 'focus:ring-emerald-500/30' : 'focus:ring-violet-500/30'}`}
              />
              {errors.date && <span className="text-rose-500 text-sm mt-2 ml-1 block font-medium">{errors.date.message}</span>}
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full text-white text-xl font-bold py-5 md:py-6 rounded-[1.5rem] shadow-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 ${
                isIncome 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/30' 
                  : 'bg-gradient-to-r from-violet-600 to-indigo-600 shadow-indigo-500/30'
              }`}
            >
              {isSubmitting ? 'Salvando...' : (isIncome ? 'Adicionar Receita' : 'Adicionar Despesa')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
