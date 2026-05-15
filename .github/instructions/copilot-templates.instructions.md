---
applyTo: "**"
---

# GitHub Copilot 산출물 템플릿

실제 `.github/` 파일이나 하네스 청사진을 작성할 때 사용한다.
프로젝트의 기존 규칙이 있으면 기존 규칙을 우선한다.

## 하네스 청사진

```md
## 하네스 청사진

### 목표

- 이 하네스가 돕는 일:
- 최종 산출물:
- 주요 사용자:

### 사람의 작업 절차

1.
2.
3.

### 선택한 팀 패턴

- 패턴:
- 선택 이유:
- 주의할 점:

### Agent 역할표

| Agent | 맡는 일 | 입력 | 출력 | 하지 말아야 할 일 |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

### Skill 목록

| Skill | 사용하는 역할 | 절차 요약 | 품질 기준 |
| --- | --- | --- | --- |
|  |  |  |  |

### Orchestrator 흐름

- Orchestrator 프롬프트 이름: `{하네스-이름}-orchestrator`
- Orchestrator 지시문: `.github/instructions/{하네스-이름}-orchestrator.instructions.md`
- Orchestrator 프롬프트: `.github/prompts/{하네스-이름}-orchestrator.prompt.md`

1.
2.
3.

### 테스트 프롬프트

| 유형 | 프롬프트 | 기대 결과 |
| --- | --- | --- |
| 정상 |  |  |
| 애매함 |  |  |
| 실패 위험 |  |  |
```

---

## `.github/instructions/{skill-name}.instructions.md`

```md
---
applyTo: "**"
---

# {Skill 이름}

## 목적

이 지시문은 {역할}이 {작업}을 일관되게 수행하도록 돕는다.

## 역할 정의

당신은 {역할 이름}입니다.

### 책임

-

### 입력

-

### 출력

-

### 하지 말아야 할 일

- 역할 밖의 결정을 대신 확정하지 않는다.
- 확인하지 않은 사실을 단정하지 않는다.

## 절차

1. 입력 자료를 확인한다.
2. 빠진 조건을 표시한다.
3. 결과를 작성한다.
4. 품질 기준으로 점검한다.

## 산출물 형식

결과, 근거, 확인 필요 항목을 구분해서 작성한다.

## 품질 기준

- 결과가 사용자의 원래 목표와 연결되어야 한다.
- 근거와 추측을 구분해야 한다.
- 다음 단계에서 바로 사용할 수 있어야 한다.
```

---

## `.github/instructions/{harness-name}-orchestrator.instructions.md`

Orchestrator 역할을 하는 지시문은 파일명이 반드시 `-orchestrator`로 끝나야 한다.
일반 작업 Skill 지시문에는 이 접미사를 쓰지 않는다.

```md
---
applyTo: "**"
---

# {하네스 이름} Orchestrator 지시문

## 목적

이 Orchestrator는 {업무 이름}을 여러 역할로 나누고,
중간 산출물을 이어서 최종 결과를 만든다.

## 입력

- 사용자 요청:
- 참고 자료:
- 제약 조건:

## 실행 흐름

1. 요청을 정리하고 최종 산출물을 확인한다.
2. {역할 A}가 {중간 산출물 A}를 만든다. → `artifacts/01-{name}.md`
3. {역할 B}가 {중간 산출물 A}를 바탕으로 {중간 산출물 B}를 만든다. → `artifacts/02-{name}.md`
4. {검토 역할}이 누락, 충돌, 독자 수준 불일치를 확인한다. → `artifacts/03-review.md`
5. 최종 결과와 확인 필요 사항을 함께 보고한다. → `artifacts/final.md`

## 파일 기반 산출물

- `artifacts/01-brief.md`
- `artifacts/02-draft.md`
- `artifacts/03-review.md`
- `artifacts/final.md`

## 실패 처리

- 입력이 부족하면 바로 생성하지 말고 빠진 정보를 질문한다.
- 중간 산출물이 다음 단계에서 쓰기 어렵다면 해당 단계만 다시 수행한다.
- 품질 기준을 통과하지 못하면 수정 목록을 먼저 제시한다.
```

---

## `.github/prompts/{harness-name}-orchestrator.prompt.md`

사용자가 Copilot Chat에서 `#`으로 선택하거나 `#file:`로 참조해 호출하는 입구 프롬프트.
파일명은 반드시 `-orchestrator`로 끝나야 한다.

```md
---
mode: 'agent'
description: '{업무 이름} 하네스의 전체 흐름을 실행하는 Orchestrator 프롬프트'
tools: ['codebase', 'editFiles', 'fetch', 'search']
---

#file:.github/instructions/{harness-name}-orchestrator.instructions.md
#file:.github/instructions/{task-skill}.instructions.md

당신은 {업무 이름} 하네스의 Orchestrator입니다.
위 지시문에 따라 사용자의 요청을 단계별로 처리하세요.

## 시작 전 확인

1. 사용자의 요청 목적과 최종 산출물을 확인합니다.
2. 필요한 정보가 부족하면 한 가지 질문을 먼저 합니다.

## 실행

지시문의 실행 흐름에 따라 단계별로 진행하고,
각 단계의 결과를 `artifacts/` 폴더에 저장합니다.
```

---

## `.github/copilot-instructions.md` 포인터 섹션

기존 `copilot-instructions.md`가 있다면 아래 섹션만 추가한다. 기존 내용을 지우지 않는다.

```md
## {하네스 이름} 하네스

이 프로젝트에는 {업무 이름}을 위한 Copilot 하네스가 있습니다.

### 주요 위치

- Orchestrator 프롬프트: `.github/prompts/{harness-name}-orchestrator.prompt.md`
- 작업 지시문: `.github/instructions/`
- 중간 산출물: `artifacts/`

### 자연어 라우팅

아래 요청이 오면 `{harness-name}-orchestrator` 프롬프트를 우선 사용한다:

- "{업무} 계획을 만들어줘"
- "{업무} 초안을 정리해줘"
- "{업무}를 역할별로 나눠서 진행해줘"
- "{업무} 결과를 검토하고 개선해줘"

### 사용 방법

```text
#file:.github/prompts/{harness-name}-orchestrator.prompt.md
{사용자의 요청}
```
```

---

## 개선 기록

```md
## 개선 기록

- 날짜:
- 하네스 이름:
- 실행한 요청:
- 기대한 결과:
- 실제 결과:
- 잘된 점:
- 막힌 점:
- 다음 버전에서 바꿀 규칙:
```

---

## 생성 후 사용 안내

```md
## 이 하네스 사용 방법

### 1. 자연어로 요청합니다

`.github/copilot-instructions.md`에 자연어 요청을 Orchestrator 프롬프트로 연결하는 규칙이 들어 있습니다.
Copilot Chat에서 스킬명을 외우지 않아도 아래처럼 평소 말하듯 요청할 수 있습니다.

{사용자의 실제 요청 예시}

### 2. 필요하면 Orchestrator 프롬프트를 직접 실행합니다

Copilot Chat에서 `#`을 입력한 뒤 `{harness-name}-orchestrator`를 선택하거나,
아래처럼 직접 참조합니다:

#file:.github/prompts/{harness-name}-orchestrator.prompt.md
{사용자의 실제 요청}

Orchestrator는 여러 역할과 Skill의 순서를 묶는 입구입니다.
처음에는 개별 지시문을 직접 참조하기보다 Orchestrator를 통해 실행하는 편이 안전합니다.

### 3. 테스트하고 개선합니다

정상 사례, 애매한 사례, 실패 위험 사례를 각각 실행하고 개선 기록에 남깁니다.
```
