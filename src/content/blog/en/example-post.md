---
title: (Sample) How we cut p95 latency of the payment API
description: Finding the slow query, adding a cache, and verifying the result.
pubDate: 2024-07-01
tags: [performance, PostgreSQL]
project: payment-api
---

## Problem

Describe the symptoms.

## Investigation

Describe the hypotheses and how you checked them.

```sql
EXPLAIN ANALYZE
SELECT * FROM payments WHERE merchant_id = $1 ORDER BY created_at DESC LIMIT 20;
```

## Fix and result

Describe the change and the numbers that confirmed it.
