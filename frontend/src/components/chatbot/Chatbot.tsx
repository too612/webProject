import { FormEvent, useMemo, useState } from 'react';

type ChatMessage = {
    role: 'bot' | 'user';
    text: string;
};

const INITIAL_MESSAGE: ChatMessage = {
    role: 'bot',
    text: '안녕하세요. 궁금한 점을 물어보세요. 예) 운영시간, 예약, 위치, 상담',
};

function getBotReply(message: string): string {
    const normalized = message.toLowerCase();

    if (normalized.includes('운영시간') || normalized.includes('시간')) {
        return '운영시간은 평일 9:00~21:30, 토요일 9:00~18:30, 공휴일 9:00~17:00입니다.';
    }
    if (normalized.includes('예약')) {
        return '예약은 홈페이지의 예약하기 메뉴에서 가능합니다.';
    }
    if (normalized.includes('위치') || normalized.includes('오시는길')) {
        return '대전광역시 유성구 대전로 506, 대전청소년위캔센터입니다.';
    }
    if (normalized.includes('상담')) {
        return '상담 예약은 상담예약하기 메뉴를 이용해 주세요.';
    }
    if (normalized.includes('프로그램')) {
        return '다양한 프로그램은 프로그램 안내 메뉴에서 확인할 수 있습니다.';
    }

    return '죄송해요, 아직 해당 질문에 대한 답변을 준비 중입니다. 운영시간, 예약, 위치, 상담 관련 질문은 바로 안내해 드릴 수 있어요.';
}

export default function Chatbot() {
    const [isFabVisible, setIsFabVisible] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);

    const hasMessages = useMemo(() => messages.length > 0, [messages.length]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmed = inputValue.trim();
        if (!trimmed) {
            return;
        }

        const nextMessages: ChatMessage[] = [
            ...messages,
            { role: 'user', text: trimmed },
            { role: 'bot', text: getBotReply(trimmed) },
        ];

        setMessages(nextMessages);
        setInputValue('');
    };

    return (
        <>
            {isFabVisible && (
                <aside className="chatbot-fab" aria-label="채팅 도우미">
                    <button type="button" className="chatbot-fab__open" onClick={() => setIsOpen(true)}>
                        챗봇
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
                        <h3>교회 챗봇</h3>
                        <button type="button" onClick={() => setIsOpen(false)}>×</button>
                    </header>

                    <div className="chatbot-window__messages">
                        {hasMessages &&
                            messages.map((message, index) => (
                                <div
                                    key={`${message.role}-${index}`}
                                    className={`chatbot-message ${message.role}`}
                                >
                                    <p>{message.text}</p>
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
