# Harness Engineering Lab — Copilot Instructions

이 프로젝트에는 GitHub Copilot용 하네스 실습 스킬이 있습니다.

## 주요 위치

- 실행 프롬프트: `.github/prompts/`
- 스킬 지시문: `.github/instructions/`
- 중간 산출물: `artifacts/`

## 자연어 라우팅

사용자가 프롬프트 이름을 직접 입력하지 않아도 하네스 관련 업무로 판단되면
`{harness-name}-orchestrator` 프롬프트를 우선 사용한다.

예시:
- "하네스를 만들어줘" → `harness-lab` 프롬프트
- "여행 계획을 정리해줘" → `trip-planning-orchestrator` 프롬프트
- "{업무} 초안을 역할별로 나눠줘" → 해당 orchestrator 프롬프트

## 사용 흐름

1. Copilot Chat에서 `#` 입력 후 프롬프트 파일을 선택하거나 `#file:.github/prompts/harness-lab.prompt.md`를 입력한다.
2. 자연어 요청이 이 하네스 범위에 들어오면 `-orchestrator` 프롬프트를 우선 실행한다.
3. Orchestrator가 필요한 instruction과 작업 단계를 선택한다.
4. 결과는 `artifacts/`에 남기고 검토 후 다음 단계로 넘긴다.
5. 범위가 애매하면 한 가지 확인 질문을 먼저 한다.

## 하네스 프롬프트 호출 방법

```
#file:.github/prompts/harness-lab.prompt.md
1박 2일 가족 여행 계획을 위한 작은 하네스를 만들어줘.
```

또는 Copilot Chat 프롬프트 선택기(#)에서 `harness-lab`을 찾아 선택한다.
