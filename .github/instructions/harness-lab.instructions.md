---
applyTo: "**"
---

# Harness Lab 라우팅

사용자가 하네스 설계, Agent/Skill/Orchestrator 구조 만들기, 업무 자동화 팀 구성,
또는 상업용 시스템(보안 검토, SLO 정의, 배포 전략, 인시던트 런북 등)을 요청하면
`.github/prompts/harness-lab.prompt.md` 프롬프트를 먼저 실행한다.

Chat에서 `/harness-lab`을 입력하거나 `#` 선택기에서 `harness-lab`을 고르면 실행된다.

프로젝트별 하네스를 만들 때 실제 내용은 `.github/{project-name}/` 아래에 두고,
`.github/prompts/`와 `.github/instructions/`에는 얇은 엔트리 파일만 둔다.

생성된 하네스가 있으면 `.github/copilot-instructions.md`의 라우팅 규칙을 따라
`{harness-name}-orchestrator` 프롬프트를 우선 실행한다.
