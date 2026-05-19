# 일상 업무 예시

하네스를 일상 업무와 연결해 설명할 때 사용한다.
수준별로 구분해서 참고한다.

---

## 학습 / POC 수준 예시

### 여행 계획 하네스 (Phase 2-9)

사람의 업무: 목적·예산 확정 → 후보지·숙소 조사 → 동선 설계 → 예산 검토 → 최종 일정

| 구성 | 예시 |
| --- | --- |
| Agent | 조사 담당, 일정 설계 담당, 예산 검토 담당 |
| Skill | 후보 조사법, 일정표 작성법, 예산 점검법 |
| Orchestrator | 조사 → 일정표 → 예산 검토 → 최종안 |
| Test | "2박 3일 부산 여행, 1인 40만원 이하" |

협업 패턴: Pipeline

Copilot 파일 구조:
```
.github/
  instructions/
    trip-research-guide.instructions.md
    trip-planning-orchestrator.instructions.md
  prompts/
    trip-planning-orchestrator.prompt.md
artifacts/
  01-research.md / 02-itinerary.md / 03-review.md / final.md
```

### 블로그 글 작성 하네스 (Phase 2-9)

사람의 업무: 주제·독자 확정 → 자료 수집 → 목차 → 초안 → 검토

협업 패턴: Pipeline + Producer-Reviewer

### 회의록 정리 하네스 (Phase 2-9)

사람의 업무: 내용 읽기 → 결정 사항 → 할 일 배분 → 리스크 → 요약

협업 패턴: Fan-out/Fan-in

---

## 팀 내부 도구 수준 예시 (Phase 1-11)

### 코드 리뷰 자동화 하네스

사람의 업무:
1. PR 내용과 변경 파일을 파악한다.
2. 코딩 컨벤션을 확인한다.
3. 보안 취약점을 점검한다.
4. 성능 영향을 평가한다.
5. 리뷰 코멘트를 작성한다.

| 구성 | 예시 |
| --- | --- |
| Agent | 코드 분석 담당, 보안 점검 담당, 성능 평가 담당, 리뷰 작성 담당 |
| Skill | PR 분석법, 보안 체크리스트, 성능 평가법, 리뷰 작성법 |
| Orchestrator | 코드 분석 → 병렬 점검 (보안+성능) → 리뷰 통합 |
| 주요 리스크 | 코드베이스 접근 권한 최소화, 민감 코드 노출 방지 |

협업 패턴: Fan-out/Fan-in + Producer-Reviewer
추가 패턴: Bulkhead (대용량 PR 처리 시 리소스 분리)

팀 내부 도구이므로 추가 산출물:
```
docs/
  01-risk-register.md      ← 코드 유출 리스크, 오탐 리스크
  10-security-checklist.md ← 코드베이스 접근 권한 검토
  11-infra-spec.md         ← GitHub API 연동, 비용 예산
```

### 사내 문서 Q&A 하네스

사람의 업무:
1. 질문 의도를 파악한다.
2. 관련 문서를 검색한다.
3. 답변을 구성한다.
4. 출처를 명시한다.
5. 답변 신뢰도를 평가한다.

협업 패턴: Pipeline + Expert Pool
추가 패턴: Circuit Breaker (문서 검색 API 장애 대응)

---

## 상업용 서비스 수준 예시 (Phase 0-15)

### 고객 지원 자동화 하네스

사람의 업무:
1. 문의 유형을 분류한다.
2. 관련 정책과 이력을 조회한다.
3. 답변 초안을 작성한다.
4. 답변을 검토한다.
5. 복잡한 건은 사람 담당자에게 이관한다.

| 구성 | 예시 |
| --- | --- |
| Agent | 분류 담당, 정책 조회 담당, 답변 작성 담당, QA 담당, 이관 판단 담당 |
| Skill | 문의 분류법, 정책 검색법, 답변 작성법, 품질 체크법 |
| Orchestrator | 분류 → 조회 → 답변 초안 → QA → 자동 응답 또는 이관 |

협업 패턴: Supervisor + Producer-Reviewer
장애 격리 패턴: Circuit Breaker (정책 DB), Bulkhead (문의 유형별 처리 풀 분리)

상업용이므로 Phase 0-15 전체 진행:
```
docs/
  00-business-objectives.md   ← KPI: 자동 해결률 70%, 응답 시간 < 30초
  01-risk-register.md         ← 잘못된 답변 리스크, 개인정보 처리 규정
  01-compliance-checklist.md  ← 개인정보보호법, 소비자보호법
  10-security-checklist.md    ← 고객 정보 마스킹, 프롬프트 인젝션 방어
  11-infra-spec.md             ← CRM 연동, 비용 예산
  11-cost-budget.md
  12-deployment-plan.md       ← 카나리 10% → 점진 확대
  13-slo-definition.md        ← 가용성 99.9%, p95 < 3초
  13-alert-rules.md
  14-runbook-api-failure.md
  14-runbook-high-error-rate.md
  15-change-log.md
```

### 콘텐츠 생성 파이프라인 하네스

사람의 업무:
1. 키워드와 타겟 독자를 확인한다.
2. 경쟁 콘텐츠를 분석한다.
3. 아웃라인을 설계한다.
4. 초안을 작성한다.
5. SEO와 팩트를 검토한다.
6. 최종 편집 후 발행한다.

협업 패턴: Pipeline + Producer-Reviewer
장애 격리 패턴: Circuit Breaker (외부 검색 API), Bulkhead (키워드 분석 / 글쓰기 풀 분리)

상업용 SLO 예시:
- 가용성: 99.5%
- 아웃라인 생성: p95 < 10초
- 초안 완성: p95 < 60초
- 에러율: < 0.5%

### 데이터 분석 보고서 자동화 하네스

사람의 업무:
1. 데이터 소스를 수집한다.
2. 이상값과 결측값을 처리한다.
3. 핵심 지표를 계산한다.
4. 인사이트를 도출한다.
5. 보고서 형식으로 정리한다.
6. 이해관계자별 요약을 만든다.

협업 패턴: Fan-out/Fan-in + Hierarchical Delegation
장애 격리 패턴: Saga (여러 데이터 소스 실패 시 부분 결과 처리), CQRS (읽기/쓰기 분리)

주요 리스크:
- 데이터 유출: 분석 결과에 원본 개인정보 포함 가능성
- 잘못된 인사이트: 데이터 품질 문제로 인한 오분석
- 비용: 대용량 데이터 처리 시 토큰 폭증
