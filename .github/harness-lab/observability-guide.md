# 관찰 가능성 & SLA 가이드 (Phase 13)

상업용 하네스의 운영 가시성 확보와 SLA 정의.

---

## 관찰 가능성 3요소

| 요소 | 역할 | 예시 |
| --- | --- | --- |
| **로그 (Logs)** | 무슨 일이 일어났는가 | Agent 실행 기록, 에러 메시지, 입출력 요약 |
| **메트릭 (Metrics)** | 얼마나, 얼마나 빠르게 | 요청 수, 응답 시간, 에러율, 토큰 소비량 |
| **트레이스 (Traces)** | 어디서 시간이 걸렸는가 | 각 Agent/Skill 단계별 소요 시간 |

---

## SLI / SLO / SLA 정의

```
SLI (지표) → 측정하는 것
SLO (목표) → 내부적으로 달성하려는 기준
SLA (약속) → 외부에 약속하는 기준 (SLO보다 보수적으로)
에러 예산 → SLO까지 허용하는 장애 시간
```

### SLI/SLO 정의 템플릿

```md
## SLO 정의 — {하네스 이름}

### 가용성
- SLI: 성공 응답 수 / 전체 요청 수
- SLO: 99.5% (월 기준 허용 다운타임 약 3.6시간)
- SLA: 99.0%

### 응답 시간
- SLI: 요청 수락부터 최종 응답까지 시간 (p95)
- SLO: p95 < 5초, p99 < 15초
- SLA: p95 < 10초

### 에러율
- SLI: 에러 응답 수 / 전체 요청 수
- SLO: < 0.5%
- SLA: < 1.0%

### 에러 예산
- 월 허용 장애: (1 - 0.995) × 30일 × 24시간 = 3.6시간
- 에러 예산 소진 속도가 빠르면 신규 배포를 중단한다.
```

---

## 필수 로그 항목

### 각 요청 로그
```json
{
  "timestamp": "ISO8601",
  "request_id": "uuid",
  "harness_name": "trip-planning",
  "user_id": "hash (개인정보 제외)",
  "phase": "Phase 6 / Agent 설계",
  "agent": "trip-researcher",
  "status": "success | error | timeout",
  "duration_ms": 1234,
  "tokens_used": 850,
  "error_code": null
}
```

로그에 절대 포함하지 않는 것:
- 개인식별정보 (이름, 이메일, 전화번호)
- API 키, 비밀번호, 토큰
- 전체 사용자 입력 (요약 또는 해시만)

### 에러 로그
```json
{
  "timestamp": "ISO8601",
  "request_id": "uuid",
  "error_type": "timeout | api_error | validation_error | budget_exceeded",
  "error_message": "...",
  "retry_count": 2,
  "fallback_used": true,
  "requires_human_review": false
}
```

---

## 알림 규칙

| 조건 | 심각도 | 알림 대상 | 대응 시간 목표 |
| --- | --- | --- | --- |
| 에러율 > 1% (5분 평균) | 경고 | 담당자 | 30분 이내 |
| 에러율 > 5% (5분 평균) | 심각 | 담당자 + 팀장 | 10분 이내 |
| 응답 시간 p95 > SLO 2배 | 경고 | 담당자 | 30분 이내 |
| 가용성 < 99% (1시간) | 심각 | 담당자 + 팀장 | 10분 이내 |
| 일 비용 > 예산의 10% | 경고 | 담당자 | 60분 이내 |
| 에러 예산 80% 소진 | 경고 | 팀 전체 | 다음 근무일 |

---

## 대시보드 구성 항목

### 운영 대시보드 (실시간)
- 현재 요청 처리율 (req/min)
- 에러율 (%) — 5분 이동 평균
- 응답 시간 p50 / p95 / p99
- 현재 활성 Agent 수
- 최근 에러 목록 (최근 20건)

### 비즈니스 대시보드 (일별)
- 일별 요청 수 및 성공률
- 일별 LLM 토큰 소비량 및 비용
- SLO 달성률 (월 누적)
- 에러 예산 잔여량

### Agent 성능 대시보드
- Agent별 평균 응답 시간
- Agent별 에러율
- Orchestrator 단계별 소요 시간 (트레이스 집계)

---

## 관찰 가능성 설정 템플릿

```md
## 관찰 가능성 설정 — {하네스 이름}

### 로그
- 저장 위치: {경로}
- 보존 기간: {N일}
- 마스킹 규칙: 이메일, 전화번호, API 키

### 메트릭
- 수집 도구: {Prometheus / CloudWatch / Datadog 등}
- 수집 주기: {N초}
- 핵심 지표: 요청 수, 에러율, 응답 시간, 토큰 수, 비용

### 트레이스
- 수집 도구: {OpenTelemetry / Jaeger / X-Ray 등}
- 샘플링: {N}% (부하 상황에서 조정 가능)

### 알림
- 알림 채널: {Slack / 이메일 / PagerDuty}
- 담당자:
  - 1차: {이름 / 연락처}
  - 2차: {이름 / 연락처}
```

---

## 산출물

- `docs/13-slo-definition.md`: SLI/SLO/SLA 정의
- `docs/13-observability-config.md`: 관찰 가능성 설정
- `docs/13-alert-rules.md`: 알림 규칙 목록
