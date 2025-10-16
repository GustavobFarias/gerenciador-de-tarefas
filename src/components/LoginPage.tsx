import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { CheckSquare } from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string, password: string) => boolean;
  onNavigateToRegister: () => void;
}

export function LoginPage({ onLogin, onNavigateToRegister }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (username.trim() && password) {
      const success = onLogin(username.trim(), password);
      if (!success) {
        setError('Usuário ou senha incorretos');
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
            <CheckSquare className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-center">Gerenciador de tarefas</h1>
          <p className="text-center text-muted-foreground">
            Organize suas tarefas semanais
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
              placeholder="Digite seu usuário"
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
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="text-primary hover:underline"
          >
            Cadastre-se
          </button>
        </p>
      </Card>
    </div>
  );
}
