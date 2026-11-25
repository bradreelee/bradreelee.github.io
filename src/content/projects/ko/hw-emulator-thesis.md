---
title: 하드웨어 에뮬레이터 연구 (졸업 논문)
org: rwth-aachen
start: 2021-06
end: 2021-12
stack: [C++]
summary: C++로 실제 하드웨어와 유사도 90%인 에뮬레이터를 만들었고, 이 연구로 IEEE Intelligent Vehicles Symposium(IV 2022) 논문에 공저자로 참여했습니다.
links:
  - { label: "IEEE IV 2022 논문: Agent-Based Autonomous Vehicle Simulation with Hardware Emulation in the Loop", href: "https://ieeexplore.ieee.org/abstract/document/9827215" }
---

자율주행 시뮬레이터 MontiSim에서, 차량의 ECU를 대신하는 **하드웨어 에뮬레이터**가 소프트웨어 실행 시간을 더 정확하게 추정하도록 개선한 연구입니다. 졸업 논문으로 진행했고, 그 내용이 IEEE Intelligent Vehicles Symposium 2022 논문(5명 중 공저자)으로 발표되었습니다.

## 문제 정의

- MontiSim은 자율주행 소프트웨어를 실제 차량 없이 테스트하는 에이전트 기반 시뮬레이터입니다. 자율주행 소프트웨어는 새로운 센서 입력에 짧은 시간 안에 반응해야 하므로, 시뮬레이션에서도 "이 코드가 실제 하드웨어에서 얼마나 걸리는지"를 반영해야 결과를 믿을 수 있습니다.
- 그래서 각 ECU를 하드웨어 에뮬레이터로 돌려 실행 시간을 추정합니다. 그런데 기존 에뮬레이터는 실행 시간에 큰 영향을 주는 두 가지, **캐시 계층**과 **명령어 디코딩**(피연산자)을 무시했습니다.
- 그 결과 기존 에뮬레이터의 추정 시간은 실제 측정값보다 **몇 자릿수나 크게** 나와, 현실적인 값으로 쓸 수 없었습니다.

<figure>
  <img src="/images/projects/hw-emulator-thesis/fig2.webp" alt="시뮬레이터, E/E 아키텍처, 하드웨어 에뮬레이터가 한 시간 단계를 처리하는 활동 다이어그램" loading="lazy" decoding="async" />
  <figcaption>시뮬레이션 루프. 시간이 한 단계 진행되면 하드웨어 에뮬레이터가 프로그램을 에뮬레이션하고 실행 시간을 추정합니다. (논문 Fig. 2)</figcaption>
</figure>

<figure>
  <img src="/images/projects/hw-emulator-thesis/fig1.webp" alt="센서, 버스, 오토파일럿, 액추에이터 사이의 이벤트가 이산 사건 시뮬레이터의 시간축에 배치된 그림" loading="lazy" decoding="async" />
  <figcaption>MontiSim이 차량 내부의 통신과 실행 시간을 이산 사건으로 모델링하는 방식 (논문 Fig. 1)</figcaption>
</figure>

## 해결책

1. **캐시 계층 모델링**
   - 프로세서는 `MemoryAccess` 인터페이스로 메모리에 접근하고, 그 뒤에 `SetAssociativeCache` 여러 단계와 마지막 `RandomAccessMemory`를 계층으로 쌓았습니다.
   - 캐시 미스가 나면 요청을 다음 계층으로 넘기므로, 실제 컴퓨터처럼 미스가 날수록 시간이 늘어납니다.
   - 연관도(associativity), 캐시 라인 크기, write-back 정책에서 메인 메모리로 되돌려 쓰는 비용까지 반영했습니다.
2. **명령어 디코딩 모델링**
   - 기존에는 명령어의 피연산자를 무시했습니다. ZyDis 디스어셈블러로 실행할 명령어와 피연산자를 해석하고, 명령어별 지연 시간표로 필요한 CPU 사이클 수를 추정한 뒤, 클럭 속도로 시간으로 바꿨습니다.
   - 명령어를 가져오는(fetch) 과정도 캐시 계층을 거치게 했습니다.

<figure>
  <img src="/images/projects/hw-emulator-thesis/fig3.webp" alt="MemoryModel이 여러 MemoryAccess를 갖고, SetAssociativeCache와 RandomAccessMemory가 이를 구현하는 클래스 다이어그램" loading="lazy" decoding="async" />
  <figcaption>캐시 계층 모델. 각 계층은 캐시 미스가 나면 요청을 넘겨받는 하위 계층을 가질 수 있습니다. (논문 Fig. 3)</figcaption>
</figure>

## 결과

- **캐시 동작 검증:** 신경망 학습 프로그램을 돌려 에뮬레이터와 실제 하드웨어(Cachegrind 프로파일러)의 캐시 이벤트를 비교했습니다. 접근당 hit 비율이 L1 명령 캐시 0.755 대 0.769, L1 데이터 캐시 0.472 대 0.452, L2 캐시 0.982 대 0.997로 거의 같았습니다.
- **실행 시간 추정:** 11개 알고리즘(신경망 학습, Dijkstra, 행렬 곱셈 등)을 파라미터마다 100번씩 실행해 실측값과 비교했습니다.
  - 명령어 해석을 추가하자 정확도가 크게 올라갔고, 메모리 계층까지 추가하자 추정값이 실측 WCET와 **같은 자릿수**가 되었습니다.
  - 알고리즘 하나 안에서는 11개 중 10개가 피어슨 상관계수 0.9 이상이었습니다.
- **시뮬레이션에 미치는 영향:** 같은 경로 추종 컨트롤러를 에뮬레이션 없이 돌리면 매끄럽게 주행하지만, 에뮬레이션을 켜면 하드웨어 지연 때문에 궤적이 흔들리는 모습이 재현되었습니다. 하드웨어 지연을 고려하지 않으면 시뮬레이션이 실제보다 낙관적인 결과를 낸다는 것을 보여 줍니다.

<figure>
  <img src="/images/projects/hw-emulator-thesis/fig4.webp" alt="11개 알고리즘의 추정 실행 시간과 실측 WCET, 평균 실행 시간을 비교한 산점도 2개" loading="lazy" decoding="async" />
  <figcaption>추정 실행 시간과 실측값의 비교. 알고리즘별로는 직선에 가깝지만, 모두 합치면 상관계수가 0.757(WCET), 0.736(평균)입니다. (논문 Fig. 4)</figcaption>
</figure>

<figure>
  <img src="/images/projects/hw-emulator-thesis/fig5.webp" alt="계획 경로(빨강), 에뮬레이션 모드 주행(파랑), 즉시 실행 모드 주행(초록)을 지도 위에 겹친 그림" loading="lazy" decoding="async" />
  <figcaption>계획 경로(빨강)와 실제 주행 궤적. 하드웨어 에뮬레이션을 켠 경우(파랑)에는 지연 때문에 궤적이 흔들립니다. (논문 Fig. 5)</figcaption>
</figure>

## 한계

- 서로 다른 알고리즘을 섞어서 보면 상관계수가 WCET 기준 0.757, 평균 실행 시간 기준 0.736으로 떨어집니다. 일부 연산은 다른 연산보다 덜 정확하게 모델링되어 있습니다.
- 캐시 이벤트의 절대 개수는 Cachegrind와 약 2배 차이가 나서, 접근 수로 정규화한 비율로 비교했습니다. 실행 환경의 차이 때문으로 보입니다.
- 검증은 한 종류의 하드웨어(AMD Ryzen 5 3600)에서 단일 코어·단일 스레드 조건으로만 했습니다.
- 추정값이 실측과 완전히 일치하지는 않습니다. 대신 개발자가 차량 소프트웨어를 만들 때 하드웨어 지연을 고려할 수 있을 만큼의 근사치를 제공합니다.
