---
title: Better Together (iOS 멀티플레이어 게임)
org: rwth-aachen
start: 2020-10
end: 2021-02
summary: 기기를 기울여 캐릭터를 움직이는 협동 iOS 어드벤처 게임입니다. 프레임레이트를 2배로 개선했고, 우수 프로젝트로 선정되었습니다.
stack: [Swift, SceneKit, MultipeerConnectivity]
links:
  - { label: "RWTH Aachen 프로젝트 소개", href: "https://hci.rwth-aachen.de/ios20-better-together" }
images:
  - { src: "/images/projects/ios-multiplayer-game/header.webp", alt: "Better Together 타이틀 화면" }
  - { src: "/images/projects/ios-multiplayer-game/screen-1.webp", alt: "게임 모드 선택 화면: 튜토리얼, 싱글 플레이, 팀 플레이" }
  - { src: "/images/projects/ios-multiplayer-game/screen-2.webp", alt: "캐릭터 꾸미기 화면" }
  - { src: "/images/projects/ios-multiplayer-game/screen-3.webp", alt: "눈 덮인 겨울 스테이지 플레이 화면" }
  - { src: "/images/projects/ios-multiplayer-game/screen-4.webp", alt: "정글 스테이지 플레이 화면" }
---

RWTH Aachen의 iOS App Development 2020/21 수업에서 3명이 함께 만든 협동 어드벤처 게임입니다. SceneKit과 MultipeerConnectivity로 구현했습니다.

- 기기를 기울여 가속도 센서로 캐릭터를 움직이고, 화면 왼쪽·오른쪽을 탭해 각 손으로 장애물이나 다른 플레이어를 잡습니다.
- 튜토리얼, 싱글 플레이, 팀 플레이 세 가지 모드가 있고, 팀 플레이에서는 근처 기기의 플레이어를 초대해 함께 플레이합니다.
- 잡기에 성공하면 햅틱과 사운드 피드백을 주고, 캐릭터의 몸과 손을 꾸밀 수 있습니다.
