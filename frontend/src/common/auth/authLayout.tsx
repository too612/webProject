import type { ReactNode } from 'react';
import Chatbot from '../chatbot/chatbot';
import { useMenu } from '../menu/menuHook';
import Footer from '../../layouts/Footer';
import Header from '../../layouts/Header';

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  useMenu();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4">{children}</main>
      <Footer />
      <Chatbot />
    </div>
  );
}
