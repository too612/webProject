import { Outlet } from 'react-router-dom';
import Chatbot from '../components/chatbot/Chatbot';
import { useMenu } from '../hooks/useMenu';
import Footer from './Footer';
import Header from './Header';

export default function MainLayout() {
  useMenu();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Outlet />
      <Footer />
      <Chatbot />
    </div>
  );
}