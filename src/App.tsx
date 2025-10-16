import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { TaskListApp } from './components/TaskListApp';

type AuthView = 'login' | 'register';

interface User {
  username: string;
  password: string;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [authView, setAuthView] = useState<AuthView>('login');

  // Verificar se há usuário logado no localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  // Carregar usuários do localStorage
  const getUsers = (): User[] => {
    const usersJson = localStorage.getItem('users');
    return usersJson ? JSON.parse(usersJson) : [];
  };

  // Salvar usuários no localStorage
  const saveUsers = (users: User[]) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  const handleLogin = (username: string, password: string): boolean => {
    const users = getUsers();
    const user = users.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      setCurrentUser(username);
      localStorage.setItem('currentUser', username);
      return true;
    }
    return false;
  };

  const handleRegister = (username: string, password: string): boolean => {
    const users = getUsers();
    
    // Verificar se o usuário já existe
    const userExists = users.some(u => u.username === username);
    if (userExists) {
      return false;
    }

    // Adicionar novo usuário
    const newUser: User = { username, password };
    saveUsers([...users, newUser]);

    // Fazer login automático após cadastro
    setCurrentUser(username);
    localStorage.setItem('currentUser', username);
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  if (!currentUser) {
    if (authView === 'register') {
      return (
        <RegisterPage
          onRegister={handleRegister}
          onBackToLogin={() => setAuthView('login')}
        />
      );
    }
    
    return (
      <LoginPage
        onLogin={handleLogin}
        onNavigateToRegister={() => setAuthView('register')}
      />
    );
  }

  return <TaskListApp username={currentUser} onLogout={handleLogout} />;
}
