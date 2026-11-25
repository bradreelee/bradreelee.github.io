---
title: Hardware emulator research (thesis)
org: rwth-aachen
start: 2021-06
end: 2021-12
stack: [C++]
summary: Built a C++ hardware emulator with 90% similarity to the real hardware; the research led to a co-authored paper at the IEEE Intelligent Vehicles Symposium (IV 2022).
links:
  - { label: "IEEE IV 2022 paper: Agent-Based Autonomous Vehicle Simulation with Hardware Emulation in the Loop", href: "https://ieeexplore.ieee.org/abstract/document/9827215" }
---

An agent-based simulator for testing autonomous driving software without a physical vehicle. Each ECU is simulated with a hardware emulator, so the software can be tested as if it runs on the actual target hardware, and the emulator also estimates execution time to check the software's real-time behavior.
