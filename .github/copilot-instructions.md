# Harness Engineering Lab — Copilot Instructions

이 프로젝트에는 GitHub Copilot용 하네스 실습 스킬이 있습니다.

## 사용 전 확인 (최초 1회)

VS Code 설정에서 `chat.promptFiles`를 `true`로 활성화해야 prompt 파일이 동작합니다.

```
Ctrl+Shift+P → "Preferences: Open Settings (UI)" → "chat.promptFiles" 검색 → 활성화
```

## 주요 위치

- 실행 프롬프트: `.github/prompts/`
- 스킬 참조 문서: `.github/harness-lab/`
- 중간 산출물: `artifacts/`

## 자연어 라우팅

**새 하네스 설계**: "하네스 만들어줘", "업무를 Agent 구조로 나눠줘" → `/harness-lab`

**생성된 하네스 실행**: 각 하네스 orchestrator 프롬프트 (`/{harness-name}-orchestrator`)

## 호출 방법

```
/harness-lab 1박 2일 가족 여행 계획을 위한 하네스를 만들어줘.
```
