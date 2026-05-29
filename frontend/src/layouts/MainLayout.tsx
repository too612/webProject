import { Outlet } from 'react-router-dom';
import Chatbot from '../common/chatbot/chatbot';
import { useMenu } from '../common/menu/menuHook';
import Footer from './Footer';
import Header from './Header';

type MainLayoutProps = {
  showChatbot?: boolean;
};

export default function MainLayout({ showChatbot = true }: MainLayoutProps) {
  useMenu();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Outlet />
      <Footer />
      {showChatbot && <Chatbot />}
    </div>
  );
}