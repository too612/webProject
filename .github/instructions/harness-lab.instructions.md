---
applyTo: "**"
---

# Harness Lab 라우팅

사용자가 하네스 설계, Agent/Skill/Orchestrator 구조 만들기, 업무 자동화 팀 구성을 요청하면
`.github/prompts/harness-lab.prompt.md` 프롬프트를 먼저 실행한다.

Chat에서 `/harness-lab`을 입력하거나 `#` 선택기에서 `harness-lab`을 고르면 해당 프롬프트가 실행된다.

기존에 생성된 하네스가 있으면 `.github/copilot-instructions.md`의 라우팅 규칙을 따라
`{harness-name}-orchestrator` 프롬프트를 우선 실행한다.
