---
title: (예시) 결제 API의 p95 응답 시간을 줄인 과정
description: 느린 쿼리를 찾고, 캐시를 도입하고, 결과를 검증한 과정을 정리합니다.
pubDate: 2024-07-01
draft: true
tags: [성능, PostgreSQL]
project: payment-api
---

## 문제

어떤 증상이 있었는지 씁니다.

## 원인 분석

가설과 확인 과정을 씁니다.

```sql
EXPLAIN ANALYZE
SELECT * FROM payments WHERE merchant_id = $1 ORDER BY created_at DESC LIMIT 20;
```

## 해결과 결과

무엇을 바꿨고, 어떤 수치로 확인했는지 씁니다.
