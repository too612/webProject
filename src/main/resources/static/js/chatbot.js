document.addEventListener('DOMContentLoaded', function() {
    // 1. 챗봇 UI의 HTML 구조 정의
    const chatbotHTML = `
        <!-- 챗봇 플로팅 버튼 -->
        <div id="chatbot-fab" style="position: fixed; right: 32px; bottom: 32px; z-index: 9999; width: 64px; height: 64px; background: #1976D2; border-radius: 50%; box-shadow: 0 4px 16px rgba(33,150,243,0.2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: box-shadow 0.2s;">
            <span class="material-icons" style="color:white; font-size:36px;">smart_toy</span>
            <span id="chatbot-fab-close" class="material-icons" title="챗봇 아이콘 닫기" style="position: absolute; top: -10px; right: -10px; background: #fff; color: #1976D2; border-radius: 50%; font-size: 20px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(33,150,243,0.15); cursor: pointer; border: 1px solid #e0e0e0;">close</span>
        </div>
        <!-- 챗봇 창 -->
        <div id="chatbot-window" style="position: fixed; right: 32px; bottom: 110px; width: 400px; max-width: 95vw; height: 600px; background: #fff; border-radius: 18px; box-shadow: 0 8px 32px rgba(33,150,243,0.18); z-index: 10000; display: none; flex-direction: column; overflow: hidden; border: 1px solid #e0e0e0; animation: chatbot-pop 0.3s;">
            <div style="background: #1976D2; color: #fff; padding: 18px 20px; display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span class="material-icons" style="font-size: 28px;">smart_toy</span>
                    <span style="font-size: 18px; font-weight: 600;">위캔센터 챗봇</span>
                </div>
                <span id="chatbot-close" class="material-icons" style="cursor:pointer; font-size: 28px;">close</span>
            </div>
            <div id="chatbot-messages" style="flex: 1; padding: 24px 16px 16px 16px; overflow-y: auto; background: #f5f7fa; font-size: 15px;">
                <div style="display:flex; align-items:flex-start; gap:10px; margin-bottom:18px;">
                    <span class="material-icons" style="color:#1976D2;">smart_toy</span>
                    <div style="background:#e3f2fd; color:#1976D2; border-radius:12px; padding:12px 16px; max-width:75%;">
                        안녕하세요! <br> 궁금한 점을 물어보세요.<br>
                        <span style="font-size:13px; color:#888;">예) 운영시간, 예약, 위치 등</span>
                    </div>
                </div>
            </div>
            <form id="chatbot-form" style="display: flex; align-items: center; padding: 12px 16px; border-top: 1px solid #eee; background: #fff;">
                <input id="chatbot-input" type="text" placeholder="챗봇에게 물어보세요." autocomplete="off" style="flex: 1; border: none; outline: none; font-size: 15px; padding: 12px 14px; border-radius: 8px; background: #f5f5f5; margin-right: 8px;">
                <button type="submit" style="background: #1976D2; color: #fff; border: none; border-radius: 8px; padding: 10px 18px; font-size: 15px; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                    <span class="material-icons" style="font-size:20px;">send</span>
                </button>
            </form>
        </div>
    `;

    // 2. 챗봇 애니메이션 및 반응형 스타일 정의
    const chatbotCSS = `
        @keyframes chatbot-pop {
            from { transform: translateY(40px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @media (max-width: 600px) {
            #chatbot-window {
                width: 98vw !important;
                right: 1vw !important;
                height: 70vh !important;
                bottom: 80px !important;
            }
            #chatbot-fab {
                right: 16px !important;
                bottom: 16px !important;
            }
        }
    `;

    // 3. 정의된 HTML과 CSS를 페이지에 삽입
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    const styleElement = document.createElement('style');
    styleElement.innerHTML = chatbotCSS;
    document.head.appendChild(styleElement);

    // 4. 챗봇 기능에 필요한 DOM 요소들을 가져오기
    const chatbotFab = document.getElementById('chatbot-fab');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotFabClose = document.getElementById('chatbot-fab-close');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // 5. 이벤트 리스너 설정
    chatbotFab.onclick = (e) => {
        // 닫기(X) 아이콘 클릭 시에는 창이 열리지 않도록 방지
        if (chatbotFabClose.contains(e.target)) return;
        chatbotWindow.style.display = 'flex';
        chatbotFab.style.display = 'none';
    };

    chatbotClose.onclick = () => {
        chatbotWindow.style.display = 'none';
        chatbotFab.style.display = 'flex';
    };

    chatbotFabClose.onclick = (e) => {
        chatbotFab.style.display = 'none';
        chatbotWindow.style.display = 'none';
        e.stopPropagation(); // 이벤트 버블링 방지
    };

    chatbotForm.onsubmit = function(e) {
        e.preventDefault();
        const userMsg = chatbotInput.value.trim();
        if (!userMsg) return;
        appendUserMsg(userMsg);
        chatbotInput.value = '';
        setTimeout(() => {
            appendBotMsg(getBotReply(userMsg));
        }, 700);
    };

    // 6. 메시지 처리 함수들
    function appendUserMsg(msg) {
        const div = document.createElement('div');
        div.style = "display:flex; justify-content:flex-end; gap:10px; margin-bottom:18px;";
        div.innerHTML = `
            <div style="background:#1976D2; color:#fff; border-radius:12px; padding:12px 16px; max-width:75%;">
                ${escapeHtml(msg)}
            </div>
            <span class="material-icons" style="color:#1976D2;">person</span>
        `;
        chatbotMessages.appendChild(div);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function appendBotMsg(msg) {
        const div = document.createElement('div');
        div.style = "display:flex; align-items:flex-start; gap:10px; margin-bottom:18px;";
        div.innerHTML = `
            <span class="material-icons" style="color:#1976D2;">smart_toy</span>
            <div style="background:#e3f2fd; color:#1976D2; border-radius:12px; padding:12px 16px; max-width:75%;">
                ${msg}
            </div>
        `;
        chatbotMessages.appendChild(div);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function getBotReply(msg) {
        msg = msg.toLowerCase();
        if (msg.includes('운영시간') || msg.includes('시간')) {
            return '운영시간은 평일 9:00~21:30, 토요일 9:00~18:30, 공휴일 9:00~17:00입니다.';
        }
        if (msg.includes('예약')) {
            return '예약은 홈페이지의 예약하기 메뉴에서 가능합니다.';
        }
        if (msg.includes('위치') || msg.includes('오시는길')) {
            return '대전광역시 유성구 대전로 506, 대전청소년위캔센터입니다.';
        }
        if (msg.includes('상담')) {
            return '상담 예약은 상담예약하기 메뉴를 이용해 주세요.';
        }
        if (msg.includes('프로그램')) {
            return '다양한 프로그램은 프로그램 안내 메뉴에서 확인할 수 있습니다.';
        }
        return '죄송해요, 아직 해당 질문에 대한 답변을 준비 중입니다.<br>운영시간, 예약, 위치 등은 바로 안내해 드릴 수 있어요!';
    }

    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }
});

