import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.post('/auth/register', { name, email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ocorreu um erro ao criar a conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-violet-200">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-slate-800 tracking-tight">
          Crie sua conta
        </h2>
        <p className="mt-2 text-sm text-slate-500 font-medium">
          Comece a ter o controle total do seu dinheiro hoje.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:rounded-[2rem] sm:px-10 border border-slate-100">
          <form className="space-y-6" onSubmit={handleRegister}>
            
            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-500 text-sm font-semibold p-3 rounded-xl text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Seu Nome
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como gosta de ser chamado"
                className="w-full bg-slate-100/80 text-lg font-medium text-slate-800 border-none rounded-[1.5rem] p-4 focus:ring-4 focus:ring-violet-500/30 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Seu E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@email.com"
                className="w-full bg-slate-100/80 text-lg font-medium text-slate-800 border-none rounded-[1.5rem] p-4 focus:ring-4 focus:ring-violet-500/30 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                Crie uma Senha
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="No mínimo 6 caracteres"
                className="w-full bg-slate-100/80 text-lg font-medium text-slate-800 border-none rounded-[1.5rem] p-4 focus:ring-4 focus:ring-violet-500/30 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-lg font-bold py-4 rounded-[1.5rem] shadow-[0_10px_25px_rgba(99,102,241,0.4)] hover:shadow-[0_15px_35px_rgba(99,102,241,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 disabled:opacity-70"
              >
                {isLoading ? 'Criando conta...' : 'Criar minha conta'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <Link to="/" className="text-slate-500 font-medium hover:text-slate-800 transition-colors">
              Já tem uma conta? <span className="text-violet-600 font-bold">Entrar</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
