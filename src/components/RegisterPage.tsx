import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { CheckSquare, ArrowLeft } from 'lucide-react';

interface RegisterPageProps {
  onRegister: (username: string, password: string) => boolean;
  onBackToLogin: () => void;
}

export function RegisterPage({ onRegister, onBackToLogin }: RegisterPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações
    if (username.trim().length < 3) {
      setError('Usuário deve ter pelo menos 3 caracteres');
      return;
    }

    if (password.length < 4) {
      setError('Senha deve ter pelo menos 4 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    const success = onRegister(username.trim(), password);
    if (!success) {
      setError('Este usuário já existe');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <Button
          variant="ghost"
          className="gap-2 -ml-2"
          onClick={onBackToLogin}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>

        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
            <CheckSquare className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-center">Criar Conta</h1>
          <p className="text-center text-muted-foreground">
            Crie sua conta para começar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="username" className="text-sm">
              Usuário
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Escolha um nome de usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Crie uma senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm">
              Confirmar Senha
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Digite a senha novamente"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Cadastrar
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-primary hover:underline"
          >
            Fazer login
          </button>
        </p>
      </Card>
    </div>
  );
}
