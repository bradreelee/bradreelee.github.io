---
title: Migrating to React Native with AI
description: How I rebuilt a native app that took three engineers eight months, alone in 40 days with React Native, and built an incremental harness and parallel dev environment that keep AI within the project's conventions.
pubDate: 2026-11-19
tags: [Software Factory, Incremental Harness, AI-Native Development, RN Migration, Parallel Development]
project: amoring-v2-rebuild
---

<div class="tldr">

**TL;DR**

- With AI, I rebuilt alone in 40 days a native app that took three engineers eight months, this time in React Native.
- A top-down approach, turning the old app into a spec and handing it all to AI at once, failed.
- Switching to a bottom-up approach, turning every correction of AI's mistakes into a rule, cut corrections from 8.3 to 1.5 per 100 prompts.
- Isolating resources per worktree and switching to Go and Rust tooling cut parallel environment setup from 1–2 minutes to 11.5 seconds.
- I now verify through videos the AI records and by using the app, not by reading the code.

</div>

I run a dating app called Amoring ([Google Play](https://play.google.com/store/apps/details?id=com.socialpoint.amoring2&hl=en), [App Store](https://apps.apple.com/kr/app/%EC%95%84%EB%AA%A8%EB%A7%81-amoring/id6504471622)). It's a side project that started around November 2025, and as of November 16, 2026 it has about 330 users.

When the side project started, there were three developers including me: I handled the backend and coordinated development overall, and there was one iOS and one Android developer.

For various reasons, the native app developers left the project. I had never built native iOS or Android apps, so after thinking about how to keep the project going, I decided to move the app to React Native (RN), which I was already comfortable with.

This post covers the software factory I built while migrating the native app to RN, and how I optimized the development environment for that factory.

From here on, I'll call the app before the RN migration the V1 app, and the app after it the V2 app.

## Visible results of the RN migration

The migration to RN was done entirely with AI, which made me far more productive than when building the V1 app. V1 was built not only to ship a service but also to learn, so we didn't use generative AI much, and that also contributes to the gap in productivity between V1 and V2.

The V1 app took three engineers about eight months of focused work. Even so, we had to fix about 300 bugs in the issue tracker, and at the planned release date the app still behaved differently across platforms. The V2 app, by contrast, was rebuilt from scratch by one developer in 40 days. And because RN is cross-platform, behavior stayed consistent across platforms.

<figure>
  <img src="/images/blog/ai-rn-migration/en/v1-v2-table.webp" alt="Comparison of team size, duration, and bug count between the V1 and V2 apps" loading="lazy" decoding="async" />
  <figcaption>Productivity of the V1 and V2 apps</figcaption>
</figure>

Beyond these visible results, what helped running the project even more was building "Amoring's own software factory."

## Building a software factory

I started building the V2 app with a software factory in mind from day one. By software factory I mean a set of harnesses that, when using AI to build new features and maintain the app, keep the AI from drifting, make it write code that follows the conventions of the existing code, and make it increasingly likely that no human intervention is needed.

### The top-down approach

My first attempt was top-down. A top-down approach starts by defining, before real development begins, every spec and harness that might help keep AI from drifting. Once those harnesses are in place, you hand the AI the spec and let it build everything from start to finish. In other words, you define up front the lint rules, testing approach, and code conventions a "typical" project needs, then delegate the development.

When I started moving Amoring to RN, the V1 source code already existed, and I thought I could treat it as the single source of truth (SSOT). On top of that, all the tacit knowledge from building V1 was in my head, so I expected that if I could turn it into a proper spec, a one-line prompt like "rebuild Amoring in RN" would finish the migration.

To that end, I worked with AI to turn the V1 app's characteristics into a spec:

- The list of screens in the app (from Figma and the source code)
- A navigation map between screens
- The data each screen needs and when it is fetched
- Concurrency control

and so on, extracting what would go into the user stories.

#### Problems with the top-down approach

But writing the spec this way surfaced several problems.

First, the V1 source code was not actually an SSOT. The app had gone through 300 bug tickets and shipped to the App Store, but it was still full of bugs. The iOS and Android apps also behaved differently in many places, from small loading UI to when navigation and data fetching happened. I had expected writing the spec to be straightforward, but analyzing native apps that other developers had written and then left behind turned up many specs that had to be defined from scratch. The very premise of the top-down approach, using the V1 app as the SSOT, fell apart.

The top-down approach was also good for defining specs but bad for building harnesses. Even with a perfectly detailed spec, what AI produces from it is rarely what you want. Whether the reason is your own taste in code or your design philosophy, building a harness that fits a project requires you to "want the AI to make mistakes," because the harness takes shape as you correct them. So trying to know every rule a project will need up front, just like writing every spec up front, is not only inefficient but unrealistic. Code patterns differ with the problems each project solves, so the realistic path is to start with basic rules known as best practices and gradually build up the project's own conventions during development.

### Adopting a bottom-up approach

To solve these problems, I decided to build the software factory bottom-up. In a bottom-up approach, you start from an empty folder with AI, build features one by one, fix the code AI writes, and turn those fixes into harnesses. There's a lot of human intervention at first, but as the codebase grows you end up with a software factory that fits that project exactly.

I call this approach an incremental harness:

<figure>
  <img src="/images/blog/ai-rn-migration/en/incremental-harness.webp" alt="Diagram of the incremental harness concept" loading="lazy" decoding="async" />
  <figcaption>Incremental harness: a harness, literally a set of reins, matures through a bottom-up approach and lets the LLM perform better within the project's constraints.</figcaption>
</figure>

#### How the incremental harness was built

I built the incremental harness in two broad ways. (For the reasons above I couldn't use the V1 app as an SSOT, so I extracted the spec again as well.)

##### 1. Active building

Ways to actively strengthen the harness step by step:

- Find well-known lint rules (e.g. [Lint](https://awesome-nestjs.com/components-and-libraries/lint.html)) and apply them
- Look at AI output I didn't like and create rules that prevent it
  - e.g. custom lint rules, a hook that runs tsc/lint after AI edits a file
- [Remove unnecessary comments](https://www.inven.co.kr/webzine/news/?news=318963) and build a [shared understanding with AI](https://github.com/mattpocock/skills/blob/main/skills/engineering/grill-with-docs/SKILL.md)

In this mode, a person corrects the AI's output by hand.

<figure>
  <img src="/images/blog/ai-rn-migration/en/active-harness.webp" alt="Flow where a person reviews output and turns recurring problems into lint rules, hooks, and docs so the AI writes the next code within those rules" loading="lazy" decoding="async" />
  <figcaption>The active building flow</figcaption>
</figure>

##### 2. Passive building

The goal of a software factory is to steadily reduce human intervention. Active building, which centers on human feedback, doesn't fit that goal very well.

Passive building isn't anything special: it automates what active building does, using an LLM.

At first I connected the LLM to Obsidian and had it record any prompt of mine that it judged to be a correction or a complaint, then periodically turn those records into skills and `CLAUDE.md` files.

Later, once I learned that Claude stores conversation history internally, I did the same thing without the Obsidian integration.

<figure>
  <img src="/images/blog/ai-rn-migration/en/passive-harness.webp" alt="Flow that extracts correction candidates from Claude conversation history, classifies them, and proposes fixes, with only the items a person approves applied to lint, hooks, skills, and CLAUDE.md" loading="lazy" decoding="async" />
  <figcaption>The passive building flow</figcaption>
</figure>

### Impact of the bottom-up approach

The goal of the bottom-up approach is to gradually reduce human intervention. I measured it as the frequency of code corrections, and over the development period that number dropped to about one fifth.

<figure>
  <img src="/images/blog/ai-rn-migration/en/corrections-dumbbell.webp" alt="Chart comparing code convention corrections by type before and after 09-25" loading="lazy" decoding="async" />
  <figcaption>Code convention corrections by type, before and after 09-25</figcaption>
</figure>

## Improving the multi-worktree parallel development environment

With the bottom-up factory in place, Amoring's development speed went up dramatically, and building several features in parallel became possible. Having multiple agents each develop in an isolated git worktree is now a common practice.

### Problems with parallel development across worktrees

But simply creating worktrees with no extra setup caused a few problems:

#### Shared DB, API server, Redis, and more

Applying DB migrations while building a feature happens all the time. But if several agents share one DB and each applies its own migrations, the others have to wait until one agent finishes. You set out to develop in parallel and end up working sequentially.

#### CPU load

An inefficient hook setup ran `tsc` and lint every time a file changed. Amoring's frontend and backend are both written in TypeScript, and as of 2026.11.17, ESLint does not support the Go-based TypeScript. On top of that, every lint command spawned a new process. With a hook that type-checked and linted on every file change, many agents running countless `tsc` and lint commands put a huge load on the CPU.

#### Emulator load

Amoring is a mobile app, so verifying on emulators is essential. But if every agent runs its own iOS/Android emulator, that also puts heavy pressure on memory.

### Solutions

#### Introducing slots

I changed each agent to start the API server on its own assigned port when its worktree is created. The port number follows the slot the agent is assigned. The DB is also cloned per slot number. Local DBs are small, so cloning them wasn't much overhead.

To avoid duplicating node_modules by installing dependencies in every worktree, I used the `clone` command so that different worktrees share the same blobs on disk, with only the changes kept separately per worktree.

<figure>
  <img src="/images/blog/ai-rn-migration/en/worktree-topology.webp" alt="Diagram of API server ports, databases, and Redis instances isolated per slot" loading="lazy" decoding="async" />
  <figcaption>Resources per slot (based on the worktree script; the worktree names for slots 1 and 2 are examples)</figcaption>
</figure>

#### Switching dev tools

Running the NestJS API server in watch mode, and the CLIs that run `tsc` and lint on changed source files, were all implemented in JavaScript. To improve this dramatically, I replaced them with tools written in faster languages such as Go and Rust.

[TypeScript 7.0 or later, written in Go](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/), was essential for the speedup. But 7.0 doesn't support the JS API (the [7.1 beta](https://devblogs.microsoft.com/typescript/announcing-typescript-7-1-beta/), which does, has been released), so improving the NestJS build, `tsc`, and lint, which depend on the JS API, required another approach.

First, to speed up linting, I adopted [the Rust-based oxlint](https://oxc.rs/docs/guide/usage/linter). Its plugins are compatible with ESLint rules, so migrating with AI went without major issues.

To speed up the NestJS build, I built the TypeScript code directly with `tsc` instead of `nest build`, then verified the migration by comparing the decorator metadata and generated GraphQL schema in the build output against what `nest build` produced.

#### Optimizing the simulator

[simslim](https://github.com/MobAI-App/simslim) reduces CPU and memory load on the host machine by keeping unnecessary background services such as Siri from running in the iOS simulator. I used it to cut the performance cost of running iOS simulators. Android emulators, however, allocate memory when they start, so this kind of optimization is limited there. I therefore do most verification on iOS and use Android only in E2E tests.

I also changed the dev server port the RN app points to, at launch and while running, per worktree, which avoids rebuilding the app for every worktree unless necessary.

### Results

<figure>
  <img src="/images/blog/ai-rn-migration/en/tool-speed.webp" alt="Chart comparing time taken per task before and after the improvements" loading="lazy" decoding="async" />
  <figcaption>Time taken before and after the improvements (seconds)</figcaption>
</figure>

### Limitations

There's still more to improve in the worktree setup. Android emulators still take up a lot of memory, and lint still spawns a separate process every time. Each worktree is assigned a slot, and every slot gets its own new DB and API server.

Frontier labs such as [OpenAI](https://openai.com/ko-KR/index/scaling-git-at-openai/) and [Anthropic](https://www.anthropic.com/research/redesigning-source-control) run huge numbers of agents in parallel and are building their own version control systems to get past the bottlenecks of existing infrastructure like Git. Amoring, too, keeps improving its development environment for the factory in line with this trend and need. Despite the remaining issues above, AI-driven development has become common enough that I felt the need to optimize the environment for it, and doing so paid off.

## How much, and how, do I trust AI-written code?

The incremental harness built bottom-up and the faster per-worktree environment dramatically sped up Amoring's development. But the question of how to trust AI-written code remains.

### Humans are still in the loop

Human intervention has decreased, but it hasn't disappeared. Amoring's factory opens a PR when a task is done:

<div class="not-prose grid gap-3 sm:grid-cols-2">
  <img src="/images/blog/ai-rn-migration/pr-1.webp" alt="PR description written by the factory: what changed and why" loading="lazy" decoding="async" class="w-full rounded-lg border border-stone-200 dark:border-stone-800" />
  <img src="/images/blog/ai-rn-migration/pr-2.webp" alt="Simulator evidence screens attached to the PR by the factory" loading="lazy" decoding="async" class="w-full rounded-lg border border-stone-200 dark:border-stone-800" />
</div>

But the incremental harness has become strong, and because I watched it grow stronger step by step, I can now nod through most of the changes in AI-made PRs. Anything that needs fixing gets turned into a harness again. Early in building the factory, active building meant deciding after every AI response whether to add a harness; now I only need to review when a feature is finished.

As a result, the Amoring codebase now has a ***scale and structure*** I can trust.

With many features implemented, certain features follow certain patterns (e.g. cache expiration policy, when data is fetched). Even new features tend to extend earlier ones or follow similar patterns. In other words, ***structure*** has emerged in the project's directories, its code conventions, and the patterns used to implement features.

A codebase that has grown in ***scale*** by repeating a clear structure acts, together with the harnesses I built, as another strong harness and context for the LLM.

### What gets verified has changed

Once I trusted the scale and structure, the time spent verifying the code itself dropped sharply. Reading the LLM boast in a PR, at length, about "how well I implemented the spec you gave me" gets tiring. So verification naturally moved to the evidence videos the LLM records and to using the app myself.

If I had tried to remove human intervention from the start, it would have been hard to trust the output this much. Because I reduced intervention gradually, I came to trust the quality of Amoring's factory over time.

## Conclusion and limitations

The bottom-up approach Amoring took lines up with much of what's been presented at recent AI Engineer conferences, which reassured me it was the right direction:

- [All Code Is Slop (Except Mine) — Lauren Tan, SpaceXSI](https://www.youtube.com/watch?v=O_zcc6Xl12g)
  - The speaker's claim that [*"Codebase is one of the largest inputs"*](https://youtu.be/O_zcc6Xl12g?t=191) means the same thing as the ***importance of structure and scale*** I described above.
- [How to Build a Software Factory That Improves Itself - Zach Lloyd, Warp](https://www.youtube.com/watch?v=nKjPBAw_N_0)
  - The self-improvement loop the speaker describes is similar to how Amoring built its incremental harness from Obsidian and Claude conversation history.
  - The difference is that Amoring measured the result as correction frequency.

The [improvement numbers above](#impact-of-the-bottom-up-approach) also confirm that human intervention in development went down.

### Limitations

There are limitations, though.

First, Amoring is run by a single developer. When I started the full rebuild with AI, all the know-how from building the V1 app was already in my head. It has not yet been shown that the Amoring factory's methodology scales to a team or a larger organization.

Second, the damage AI mistakes can cause at Amoring is small. With fewer than 1,000 total sign-ups, the impact of an outage is far smaller than for services that people rely on every day.

Finally, quantitative evidence is lacking. Apart from the drop in AI corrections and my own growing trust in AI, there are few metrics for measuring what the factory has achieved.

Still, the experience of identifying and fixing these problems gave me the fundamentals to tackle problems at a larger scale.
