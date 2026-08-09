import { Outlet } from "react-router-dom";
import Chatbot from "../common/chatbot/chatbot";
import { useMenu } from "../common/menu/menuHook";
import { RouteProgress } from "../common/ui";
import Footer from "./Footer";
import Header from "./Header";

type MainLayoutProps = {
  showChatbot?: boolean;
};

export default function MainLayout({ showChatbot = true }: Readonly<MainLayoutProps>) {
  useMenu();

  return (
    <div className="flex flex-col min-h-screen">
      <RouteProgress />
      <Header />
      <Outlet />
      <Footer />
      {showChatbot && <Chatbot />}
    </div>
  );
}
