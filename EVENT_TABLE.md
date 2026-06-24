# Wolf Event Table

Wolf의 이벤트 조건표.

이 문서는 낮 이벤트, 밤 이벤트, 귀환 이벤트, 꿈 이벤트, 위험 이벤트, 캐릭터 이벤트를 구분하고, 각 이벤트의 등장 조건과 연결 흐름을 관리하기 위한 문서다.

Codex가 새 이벤트를 추가하거나 기존 이벤트를 수정할 때는 이 문서를 먼저 확인한다.

---

## 0. 기본 시간 구조

Wolf는 하루를 아래 흐름으로 관리한다.

```text
Temple
= 낮의 황폐한 절
= 인물 이벤트 / 낮 이벤트 선택

-> 인물 이벤트 또는 낮 이벤트

Temple_Return
= 밤이 왔다
= 밤 행동 선택 라우터

-> 밤 정찰 / 잠든다 / 절에 머문다

NightPatrol_Random / NightRest / Dream_Router
= 밤 행동

-> Temple_AfterNight

ReturnEvent_Router
= 귀환 이벤트
= 다음 낮으로 돌아가기 전 짧은 관찰 컷

-> ReturnToTempleNextDay 또는 Temple
= 다음 낮
```

---

## 1. 시간 변수

기본 변수:

```twee
$dayCount = 1
$timeOfDay = "day"
```

권장 timeOfDay 값:

```text
day
= 낮
= Temple / DayEvent_Router

night
= 밤
= Temple_Return / NightPatrol_Random / NightRisk_*

dream
= 꿈
= Dream_Router / Dream_*

dawn
= 새벽 또는 귀환
= Temple_AfterNight / ReturnEvent_Router
```

날짜 표시 권장:

```text
1일째 / 낮
1일째 / 밤
2일째 / 새벽
```

---

## 2. 이벤트 분류

### 낮 이벤트

낮 이벤트는 `Temple` 또는 `DayEvent_Router`에서 발생한다.

성격:

```text
인물의 일상
절의 상태
관계의 변화
조용한 관찰
낮의 대화
```

예:

```text
쿠로가 책을 읽는다
쿠로와 차를 마신다
한베가 검을 손본다
엠마가 절에 찾아온다
조각가가 불상을 깎는다
잇신의 기척이 들린다
```

낮 이벤트는 위험/죽음 가능성이 낮다.
수라/고독/위험이 직접 폭발하는 이벤트는 보통 밤 이벤트 또는 위험 이벤트로 보낸다.

---

### 밤 이벤트

밤 이벤트는 `Temple_Return` 이후 발생한다.

성격:

```text
밤 정찰
위험
고독
수라 전조
죽음 가능성
불길한 발견
```

예:

```text
NightPatrol_Random
NightRisk_Arrow
NightRisk_Cord
NightRisk_HandMoves
NightRisk_WrongName
NightRisk_BloodScent
```

밤 이벤트는 선택 실패 또는 시간초과로 Bad End에 연결될 수 있다.

---

### 귀환 이벤트

귀환 이벤트는 밤 행동 후, 다음 낮으로 돌아가기 전에 발생한다.

성격:

```text
짧은 일상 컷
절이 살아 있다는 느낌
보상 컷
관찰
정적 여운
```

예:

```text
ReturnEvent_WatchKuro
ReturnEvent_ReedField
ReturnEvent_Chicken
ReturnEvent_HanbeiPretendSleep
ReturnEvent_EmmaLamp
ReturnEvent_SilentTemple
ReturnEvent_None
```

귀환 이벤트는 원칙적으로 큰 변수 변화를 주지 않는다.

금지:

```text
인연도 큰 폭 증가
위험도 증가
엔딩 flag 설정
기록장 새 흔적 등록
```

귀환 이벤트는 분위기용이다.

---

### 꿈 이벤트

꿈 이벤트는 `NightRest` 또는 `Dream_Router` 이후 발생한다.

성격:

```text
늑대의 내면
전조
고독
수라
선택의 그림자
위험의 예감
```

예:

```text
Dream_NoSword
Dream_Cord
Dream_NoName
Dream_DefaultSleep
```

꿈 이벤트는 기록장 `꿈` 탭에 남을 수 있다.
꿈 이벤트는 직접 엔딩보다는 이후 위험 이벤트나 수라 전조로 이어지는 것이 좋다.

---

### 위험 이벤트

위험 이벤트는 죽음 가능성이 있는 이벤트다.

성격:

```text
타이머 선택지
즉각 반응
Bad End 가능
위험 수치 증가
수라/고독 전조
```

예:

```text
FirstDeath_Choices
Genichiro_ArrowChoice
NightRisk_Arrow
NightRisk_Cord
```

위험 이벤트의 화면 규칙:

```text
짧은 prompt
타이머바
선택지
Danger.png 배경
계속 버튼 없음
```

위험 이벤트 실패 시:

```text
BadEnd_* 로 연결 가능
```

---

### 캐릭터 이벤트

캐릭터 이벤트는 인물 루트의 주요 장면이다.

성격:

```text
인연 증가
애정 증가
갈등 증가
캐릭터별 루트 진행
엔딩 조건 누적
```

대상:

```text
한베
쿠로
겐이치로
조각가
잇신
엠마
내면의 수라
```

캐릭터 이벤트는 화면 규칙을 지킨다.

```text
대화 화면 = 대화만
선택지 화면 = 짧은 상황문 + 선택지만
긴 나레이션과 선택지 혼합 금지
```

---

## 3. 날짜별 추천 해금 기준

### 1일째

초반 튜토리얼과 기본 허브 안정화.

가능 이벤트:

```text
첫 꿈 인트로
첫 쿠로 구출
Bad End. 첫 번째 죽음
기록장 해금
Temple 진입
한베 초반 이벤트
첫 밤정찰
기본 꿈
ReturnEvent_None
ReturnEvent_SilentTemple
ReturnEvent_Chicken
```

피해야 할 이벤트:

```text
쿠로가 첫 죽음을 깊게 언급하는 이벤트
엠마 등장
조각가/잇신 등장
겐이치로 귀환
수라 전조
```

---

### 2일째 이후

첫 죽음 이후의 감정 후속 처리 가능.

추천 이벤트:

```text
Kuro_Tea
쿠로 차 이벤트
쿠로 책 읽는 시간
쿠로가 첫 죽음/기둥 사건을 언급
한베 술 이벤트
더 깊은 첫 인연 이벤트
```

예시 조건:

```twee
<<if ($dayCount || 1) >= 2 and not $kuroTeaSeen>>
```

---

### 3일째 이후

절의 세계가 넓어진다.

추천 이벤트:

```text
엠마 등장 가능
깊은 꿈 이벤트
조각가의 기척
위험 누적 이벤트
고독 관련 이벤트
```

예시 조건:

```twee
<<if ($dayCount || 1) >= 3 and $emmaEventUnlocked>>
```

---

### 5일째 이후

바깥 전황과 겐이치로의 존재감이 움직인다.

추천 이벤트:

```text
Genichiro_ReturnNotice
겐이치로 성문 화살 이벤트
아시나 대장군 부대 귀환 전조
잇신 관련 이벤트 일부
조각가/수라 전조 일부
```

예시 조건:

```twee
<<if ($dayCount || 1) >= 5>>
```

겐이치로 전조 예시:

```text
며칠째, 성 쪽의 바람이 달랐다.

먼 곳에서 돌아온 발소리들이
무너진 담과 길 위에 낮게 깔렸다.

전투를 끝낸 아시나의 대장군 부대가
성으로 돌아온 듯했다.

늑대는 성문 쪽을 보았다.
```

---

### 2회차 이후

1회차 엔딩 경험 이후 열리는 구조.

추천 이벤트:

```text
조각가 루트
잇신 루트
엠마 심화 이벤트
수라 전조
숨겨진 꿈
회생 관련 히든 구조
```

조건 예시:

```twee
<<if $secondLoopUnlocked>>
```

---

## 4. 주요 이벤트 표

아래 표는 현재/예정 이벤트를 관리하기 위한 기준표다.

| Event ID | Type | Time | Min Day | Conditions | Repeat | Result / Target | Notes |
| --- | --- | ---: | ---: | --- | --- | --- | --- |
| Intro_Dream_01 | Dream/Intro | dream | 1 | new game | once | Intro_Dream_01_Choice | 블랙 화면 유지 |
| FirstDeath_Event | Danger Intro | day/dreamlike | 1 | new game | once | FirstDeath_Choices | 아직 황폐한 절 배경 노출 전 |
| FirstDeath_Choices | Danger | danger | 1 | FirstDeath_Event seen | once | BadEnd_FirstDeath / result | Danger.png, timer |
| BadEnd_FirstDeath | Bad End | badend | 1 | FirstDeath_Choices | once | FirstDeath_Record | BadEnd.png |
| FirstDeath_Record | System | black | 1 | BadEnd_FirstDeath | once | Temple | 기록장 해금 |
| Hanbei_Start | Character | day | 1 | Temple | repeat/route | Hanbei_* | 한베 초반 루트 |
| Hanbei_Sake | Character | day | 1-2 | Hanbei progress | once | Hanbei_End_QuietDay | 술 이벤트 |
| Hanbei_End_QuietDay | Ending | day | 1+ | Hanbei route | once | Temple_Return | qualified ending |
| Kuro_Tea | Character | day | 2 | first death seen, not kuroTeaSeen | once | Kuro next / Temple_Return | 기둥 사건 감정 후속 |
| Kuro_Reading | DayEvent | day | 2 | kuro available | repeat/once | Temple_Return or Temple | 책을 읽는 시간 |
| Genichiro_ReturnNotice | Character Intro | day | 5 | genichiro not entered | once | Genichiro_ArrowIntro | 전황 변화 전조 |
| Genichiro_ArrowChoice | Danger | danger | 5 | Genichiro_ReturnNotice | repeat/once | Genichiro route / BadEnd | Danger.png, timer |
| BadEnd_GenichiroArrow | Bad End | badend | 5 | timeout/fail | once | Temple or record flow | qualified 아님 |
| DayEvent_None | DayEvent | day | 1 | fallback | repeat | Temple | 낮 이벤트 없음 |
| DayEvent_SilentTemple | DayEvent | day | 1 | fallback | repeat | Temple | 조용한 절 |
| NightPatrol_Random | NightEvent | night | 1 | Temple_Return | repeat | NightRisk_* / Quiet | 밤정찰 |
| NightRisk_Arrow | Risk | night | 1+ | random | repeat/once | Temple_AfterNight / BadEnd | 위험 |
| NightRisk_Cord | Risk/Dream seed | night | 1+ | random | once | Temple_AfterNight | Dream_Cord unlock 가능 |
| NightRisk_WrongName | Risk/Dream seed | night | 2+ | random | once | Temple_AfterNight | Dream_NoName unlock 가능 |
| NightRest | NightEvent | night | 1 | Temple_Return | repeat | Dream_Router | 잠든다 |
| Dream_Router | Dream | dream | 1 | NightRest | repeat | Dream_* | 꿈 라우터 |
| Dream_NoSword | Dream | dream | 1 | first dream | once | Temple_AfterNight | 검이 없는 꿈 |
| ReturnEvent_Router | Return | dawn | 1 | after night action | repeat | ReturnEvent_* | 귀환 컷 |
| ReturnEvent_None | Return | dawn | 1 | fallback | repeat | Temple/NextDay | 아무 일 없음 |
| ReturnEvent_SilentTemple | Return | dawn | 1 | fallback | repeat | Temple/NextDay | 조용한 귀환 |
| ReturnEvent_WatchKuro | Return | dawn | 2 | kuroAffection >= 1 | repeat/cooldown | Temple/NextDay | 쿠로를 지켜봄 |
| ReturnEvent_HanbeiPretendSleep | Return | dawn | 1 | hanbei met | repeat/cooldown | Temple/NextDay | 한베 일상 |
| ReturnEvent_EmmaLamp | Return | dawn | 3 | emmaEventUnlocked | repeat/cooldown | Temple/NextDay | 엠마 등불 |

---

## 5. 이벤트 작성 규칙

새 이벤트를 추가할 때는 반드시 아래 정보를 정한다.

```text
Event ID:
Type:
Time:
Min Day:
Conditions:
Repeat:
Sets:
Recordbook:
Next Target:
Screen Type:
Background:
```

예시:

```text
Event ID: Kuro_Tea
Type: Character
Time: day
Min Day: 2
Conditions: badEndFirstDeathSeen, not kuroTeaSeen
Repeat: once
Sets: kuroTeaSeen, kuroAffection +1, recordBookNewBond
Recordbook: 인연 기억 가능
Next Target: Temple_Return
Screen Type: dialogue
Background: temple
```

---

## 6. 반복 / 쿨다운 규칙

반복 가능한 이벤트는 쿨다운을 고려한다.

권장:

```text
ReturnEvent_Chicken
= 반복 가능
= 최근 2일 내 반복 금지 가능

ReturnEvent_WatchKuro
= 반복 가능
= kuroAffection 조건
= 최근 3일 내 반복 금지 가능

Genichiro_ReturnNotice
= 1회만

Kuro_Tea
= 1회만
```

쿨다운 변수 예시:

```twee
$lastSeen_ReturnEvent_Chicken = 3
$lastSeen_ReturnEvent_WatchKuro = 5
```

조건 예시:

```twee
<<if ($dayCount - ($lastSeen_ReturnEvent_Chicken || 0)) >= 2>>
```

지금 당장은 모든 이벤트에 쿨다운을 구현하지 않아도 된다.
하지만 반복 이벤트를 만들 때는 이 기준을 참고한다.

---

## 7. 기록장 연결 기준

기록장에 남길 이벤트와 남기지 않을 이벤트를 구분한다.

### 기록장에 남기는 것

```text
엔딩
꿈
중요 인연 기억
중요 흔적
첫 죽음
특정 위험의 첫 경험
```

### 기록장에 남기지 않는 것

```text
단순 귀환 이벤트
반복 일상 컷
ReturnEvent_None
변수 변화가 없는 짧은 분위기 컷
```

---

## 8. 화면 타입 기준

각 이벤트는 `SCREEN_RULES.md`를 따른다.

요약:

```text
긴 나레이션
= narration-screen
= 선택지 없음
= continue

대화
= dialogue-screen
= 선택지 없음
= continue

선택지
= choice-screen
= 짧은 prompt
= 선택지만

시간제 선택지
= timed-choice-screen
= 짧은 prompt
= timer
= 선택지만
= Danger.png

엔딩
= badend-screen / ending-screen
= 나레이션 + 엔딩 제목
= BadEnd.png 또는 ending bg
```

---

## 9. 작업 시 주의

Codex가 이벤트를 추가하거나 수정할 때 지켜야 할 것:

- 기존 passage를 삭제하지 않는다.
- 기존 target을 바꿀 때는 이유를 보고한다.
- 중복 passage 이름을 만들지 않는다.
- 긴 나레이션과 선택지를 같은 화면에 넣지 않는다.
- 대화창과 선택지를 같은 화면에 넣지 않는다.
- 진행용 문구는 선택지가 아니라 `continueTo`를 사용한다.
- `dayCount` 조건이 필요한 이벤트는 너무 빨리 뜨지 않게 한다.
- 수라 관련 정보는 해금 전 `???`로 숨긴다.
- ReturnEvent는 큰 변수 변화를 주지 않는다.
