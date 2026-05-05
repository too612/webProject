import { Outlet } from 'react-router-dom';
import Chatbot from '../components/chatbot/Chatbot';
import { useMenu } from '../hooks/useMenu';
import Footer from './Footer';
import Header from './Header';

export default function AuthLayout() {
    useMenu();

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4">
                <Outlet />
            </main>
            <Footer />
            <Chatbot />
        </div>
    );
}
