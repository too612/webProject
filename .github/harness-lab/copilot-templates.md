# GitHub Copilot 산출물 템플릿

실행 하네스를 생성할 때 사용한다. 프로젝트에 기존 규칙이 있으면 우선한다.

---

## 하네스 청사진 템플릿

```md
## 하네스 청사진

### 목표
- 이 하네스가 돕는 일:
- 최종 산출물:

### 사람의 작업 절차
1.
2.
3.

### 선택한 팀 패턴
- 패턴:
- 선택 이유:

### Agent 역할표
| Agent | 맡는 일 | 입력 | 출력 | 하지 말아야 할 일 |
| --- | --- | --- | --- | --- |

### Orchestrator 흐름
- 프롬프트 파일: `.github/prompts/{harness-name}-orchestrator.prompt.md`
- 지시문 파일: `.github/instructions/{harness-name}-orchestrator.instructions.md`
1.
2.

### 테스트 프롬프트
| 유형 | 프롬프트 | 기대 결과 |
| --- | --- | --- |
| 정상 | | |
| 애매함 | | |
| 실패 위험 | | |
```

---

## `.github/instructions/{skill-name}.instructions.md`

**중요**: 이 파일의 `applyTo`는 넓게 쓰지 않는다.
- 하네스 관련 파일에만 적용하려면: `applyTo: ".github/**"`
- 특정 파일 유형에만: `applyTo: "src/**/*.ts"`
- 모든 파일에 적용이 꼭 필요할 때만: `applyTo: "**"` (단, 파일을 짧게 유지)

```md
---
applyTo: ".github/**"
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

## 품질 기준
- 결과가 사용자의 원래 목표와 연결되어야 한다.
- 근거와 추측을 구분해야 한다.
- 다음 단계에서 바로 사용할 수 있어야 한다.
```

---

## `.github/instructions/{harness-name}-orchestrator.instructions.md`

Orchestrator 지시문. 파일명은 반드시 `-orchestrator`로 끝난다.
`applyTo`는 `.github/**`처럼 좁은 범위로 설정한다.

```md
---
applyTo: ".github/**"
---

# {하네스 이름} Orchestrator 지시문

## 목적
{업무 이름}을 여러 역할로 나누고, 중간 산출물을 이어서 최종 결과를 만든다.

## 실행 흐름
1. 요청 목적과 최종 산출물을 확인한다.
2. {역할 A}가 {중간 산출물 A}를 만든다. → `artifacts/01-{name}.md`
3. {역할 B}가 이를 바탕으로 {중간 산출물 B}를 만든다. → `artifacts/02-{name}.md`
4. {검토 역할}이 누락, 충돌, 수준 불일치를 확인한다. → `artifacts/03-review.md`
5. 최종 결과를 보고한다. → `artifacts/final.md`

## 실패 처리
- 입력이 부족하면 생성 전에 빠진 정보를 질문한다.
- 중간 산출물이 다음 단계에 쓰기 어려우면 해당 단계만 다시 수행한다.
```

---

## `.github/prompts/{harness-name}-orchestrator.prompt.md`

사용자가 `/harness-name-orchestrator`로 호출하는 실행 입구.
파일명은 반드시 `-orchestrator`로 끝난다.

```md
---
agent: 'agent'
description: '{업무 이름} 하네스의 전체 흐름을 실행하는 Orchestrator'
tools: ['search/codebase', 'editFiles', 'vscode/askQuestions']
---

# {하네스 이름} Orchestrator

[실행 지시문](./../instructions/{harness-name}-orchestrator.instructions.md) 참고.

## 시작 전 확인
필요한 정보가 부족하면 #tool:vscode/askQuestions 으로 한 가지 질문을 먼저 한다.

## 실행
지시문의 흐름에 따라 단계별로 진행하고,
각 단계의 결과를 `artifacts/` 폴더에 저장합니다.
```

---

## `.github/copilot-instructions.md` 추가 섹션

기존 파일이 있으면 내용을 지우지 말고 아래 섹션만 추가한다.

```md
## {하네스 이름} 하네스

- Orchestrator 프롬프트: `.github/prompts/{harness-name}-orchestrator.prompt.md`
- 작업 지시문: `.github/instructions/`
- 산출물: `artifacts/`

아래 요청이 오면 `/harness-name-orchestrator` 프롬프트를 우선 실행한다:
- "{업무} 계획을 만들어줘"
- "{업무} 초안을 정리해줘"
- "{업무}를 역할별로 나눠서 진행해줘"
```

---

## 개선 기록 템플릿

```md
## 개선 기록
- 날짜:
- 하네스 이름:
- 실행한 요청:
- 기대한 결과:
- 실제 결과:
- 막힌 점:
- 다음 버전에서 바꿀 규칙:
```
