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

Research on making the **hardware emulator** in the MontiSim autonomous driving simulator estimate software execution time more accurately. It was my bachelor's thesis, and the work was published as a co-authored paper (one of five authors) at the IEEE Intelligent Vehicles Symposium 2022.

## Problem

- MontiSim is an agent-based simulator for testing autonomous driving software without a physical vehicle. Autonomous driving software must react to new sensor input within a very short time, so a simulation is only trustworthy if it reflects how long the code would take on the real hardware.
- Each ECU therefore runs inside a hardware emulator that estimates execution time. The existing emulator, however, ignored two major factors: the **cache hierarchy** and **instruction decoding (operands)**.
- As a result, its estimates were **several orders of magnitude** higher than measured times, which made them unusable.

## Solution

1. **Modeling the cache hierarchy**
   - The processor accesses memory through a `MemoryAccess` interface, behind which I stacked multiple `SetAssociativeCache` layers and a final `RandomAccessMemory`.
   - On a cache miss the request falls through to the next layer, so, as on real hardware, more misses mean more time.
   - The model accounts for associativity, cache line size, and the cost of writing data back to main memory under a write-back policy.
2. **Modeling instruction decoding**
   - The emulator previously ignored operands. I used the ZyDis disassembler to decode each instruction and its operands, estimated the required CPU cycles from instruction latency tables, and converted them to time using the clock speed.
   - Instruction fetches also go through the cache hierarchy.

## Results

- **Cache behavior:** Profiling a neural network training program, I compared cache events between the emulator and real hardware (via the Cachegrind profiler). Hit rates per access were nearly identical: 0.755 vs 0.769 for the L1 instruction cache, 0.472 vs 0.452 for L1 data, and 0.982 vs 0.997 for L2.
- **Execution time estimates:** I ran 11 algorithms (neural network training, Dijkstra, matrix multiplication, and more), 100 times per parameter, and compared the estimates against measurements.
  - Adding instruction decoding improved accuracy significantly, and adding the memory hierarchy brought estimates to the **same order of magnitude** as the measured WCET.
  - Within a single algorithm, 10 of 11 had a Pearson correlation above 0.9.
- **Impact on simulation:** A trajectory-following controller drove smoothly without emulation, but with emulation turned on the trajectory oscillated because of hardware delays, showing that ignoring those delays makes simulations overly optimistic.

## Limitations

- When algorithms are mixed, the correlation drops to 0.757 for WCET and 0.736 for mean execution time; some operations are modeled less accurately than others.
- Absolute cache event counts differed from Cachegrind by roughly a factor of two, so the comparison uses rates normalized by access count, likely due to differences in the execution environment.
- Validation covered only one hardware platform (AMD Ryzen 5 3600) in a single-core, single-thread setup.
- Estimates do not match measurements exactly; they provide approximations good enough for developers to account for hardware delays when building vehicle software.
