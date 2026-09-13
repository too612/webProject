import { FormEvent, useMemo, useState } from "react";
import { useChatbot } from "./chatbotHook";
import { Link } from "react-router-dom";

export default function Chatbot() {
  const [isFabVisible, setIsFabVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { messages, isSending, sendMessage } = useChatbot();

  const hasMessages = useMemo(() => messages.length > 0, [messages.length]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isSending) {
      return;
    }
    setInputValue("");
    sendMessage(trimmed);
  };

  return (
    <>
      {isFabVisible && (
        <aside className="chatbot-fab" aria-label="채팅 도우미">
          <button
            type="button"
            className="chatbot-fab__open"
            aria-label="챗봇 열기"
            onClick={() => setIsOpen(true)}
          >
            <img src="/img/chatbot.png" alt="" className="chatbot-fab__icon" />
          </button>
          <button
            type="button"
            className="chatbot-fab__close"
            aria-label="챗봇 아이콘 닫기"
            onClick={() => {
              setIsOpen(false);
              setIsFabVisible(false);
            }}
          >
            ×
          </button>
        </aside>
      )}

      {isOpen && (
        <section className="chatbot-window" aria-label="챗봇 창">
          <header className="chatbot-window__header">
            <h3>다사랑교회 챗봇</h3>
            <button type="button" onClick={() => setIsOpen(false)}>
              ×
            </button>
          </header>

          <div className="chatbot-window__messages">
            {hasMessages &&
              messages.map((message, index) => (
                <div
                  key={message.role + "-" + index}
                  className={"chatbot-message " + message.role}
                >
                  {message.role === "bot" && (
                    <img
                      src="/img/chatbotChat.png"
                      alt=""
                      className="chatbot-message__avatar"
                    />
                  )}
                  <div className="chatbot-message__content">
                    <p>{message.text}</p>
                    {message.role === "bot" && message.menuPath && (
                      <Link
                        to={message.menuPath}
                        className="chatbot-message__link"
                      >
                        관련 페이지 보기
                      </Link>
                    )}
                  </div>
                </div>
              ))}
          </div>

          <form className="chatbot-window__form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="챗봇에게 물어보세요"
            />
            <button type="submit">전송</button>
          </form>
        </section>
      )}
    </>
  );
}
