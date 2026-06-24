# Wolf Ending Table

Wolf의 엔딩 메타데이터 관리표.

이 문서는 엔딩이 늘어나도 기록장, 2회차 해금, 엔딩 분류, 캐릭터별 루트가 꼬이지 않도록 기준을 맞추기 위한 문서다.

코드에 엔딩을 추가하거나 기존 엔딩을 수정할 때는 `WOLF_CONTEXT.md`, `SCREEN_RULES.md`, `EVENT_TABLE.md`와 함께 이 문서를 먼저 확인한다.

---

## 0. 작업 원칙

- `index.html`은 직접 수정하지 않는다.
- 엔딩 추가/수정은 `src` 원본에서만 한다.
- `tools/tweego` 폴더는 수정/삭제/이동하지 않는다.
- 엔딩 passage를 추가하면 이 문서와 기록장 엔딩 탭을 함께 갱신한다.
- 엔딩 seen 변수는 `StoryInit` 또는 세이브 호환 helper에도 기본값을 보장한다.
- 기록장 엔딩 카운트와 실제 seen 변수 카운트가 어긋나지 않게 한다.
- 2회차 해금에 포함되는 엔딩은 `qualifiedCharacterEnding "character"` 호출 여부를 반드시 확인한다.

---

## 1. 엔딩 분류 기준

### End

조용하고 씁쓸한 결말.

늑대가 아직 자기 자신으로 남아 있다.

요약:

```text
남아 있다.
```

현재 UI에서는 기존 명칭 호환 때문에 `Day End`로 표시되는 항목이 있다. 문서상 분류는 `End`로 관리하되, 플레이어 표시명이 `Day End`인 경우 비고에 남긴다.

### True End

갈등이 폭발한 뒤 깊어지는 결말.

늑대가 선택한다.

관계가 더 진짜가 된다.

요약:

```text
선택한다.
```

### Bad End

늑대가 외부의 힘에 의해 완전히 규정되는 결말.

늑대가 끝내 거부하지 못하고 선택당한다.

도구, 칼, 그림자, 희생물로 굳어진다.

요약:

```text
선택당한다.
```

### Broken End

늑대가 완전히 파괴되는 결말.

능동적으로든 수동적으로든 늑대가 더는 온전한 형태로 남지 못한다.

요약:

```text
부서진다.
```

### Shura End

모두를 끊어내는 결말.

늑대가 선택하지만, 그 선택은 관계를 끊는 쪽이다.

요약:

```text
베어낸다.
```

---

## 2. 메타데이터 형식

각 엔딩은 아래 정보를 가진다.

```text
id:
title:
type:
character:
seenVar:
qualified:
recordbook:
recordDesc:
background:
nextTarget:
notes:
```

필드 기준:

- `id`: 대표 passage id 또는 기록장 관리 id.
- `title`: 플레이어에게 보이는 엔딩명.
- `type`: `End`, `True End`, `Bad End`, `Broken End`, `Shura End`.
- `character`: 관련 캐릭터. 공통 엔딩은 `common`.
- `seenVar`: 엔딩 획득 여부를 나타내는 SugarCube 변수.
- `qualified`: 2회차 해금에 포함되는 qualified character ending 여부.
- `recordbook`: 기록장 엔딩 탭 표시 여부.
- `recordDesc`: 기록장에 표시되는 설명.
- `background`: 권장/사용 배경.
- `nextTarget`: 엔딩 후 이동 target.
- `notes`: 묶음 표시, 내부 변수명 호환, 미구현 여부 등.

---

## 3. 관리 규칙

### 3.1 기록장 반영

엔딩을 기록장에 남기는 경우:

```twee
<<set $recordBookNewEnding = true>>
<<recordNotice "ending">>
```

기록장 엔딩 탭의 `_seen` 계산과 항목 표시 조건도 같이 갱신한다.

### 3.2 2회차 해금

캐릭터 루트의 유효 엔딩은 아래 호출을 포함한다.

```twee
<<qualifiedCharacterEnding "hanbei">>
<<qualifiedCharacterEnding "kuro">>
<<qualifiedCharacterEnding "genichiro">>
```

튜토리얼 Bad End, 공통 Bad End, 위험 이벤트 실패 Bad End는 qualified ending으로 처리하지 않는다.

### 3.3 내부 변수명 호환

현재 일부 내부 변수명은 과거 명칭인 `Worst`를 유지한다.

예:

```text
$endingHanbeiWorstSeen
$endingKuroWorstSeen
$endingGenichiroWorstSeen
```

플레이어 표시명은 `Broken End`로 정리되어 있다. 대규모 rename이 필요할 때는 세이브 호환 계획을 먼저 세운다.

### 3.4 배경 기준

- `Bad End`, `Broken End`: `BadEnd.png` 또는 `scene-bg-badend` 계열 권장.
- 위험 타이머 실패로 이어지는 엔딩 전 화면: `Danger.png`는 타이머 선택지 화면에서 사용한다.
- `End`, `True End`: 루트별 배경 또는 기본 엔딩 배경을 사용한다.
- `Shura End`: 수라 전용 배경이 생기면 별도 지정한다.

---

## 4. 엔딩 목록

### Tutorial / Common

```text
id: BadEnd_FirstDeath
title: Bad End. 첫 번째 죽음
type: Bad End
character: common / kuro
seenVar: $badEndFirstDeathSeen
qualified: false
recordbook: true
recordDesc: 쿠로를 구하려다 늑대는 처음으로 죽었다.
background: BadEnd.png / scene-bg-badend
nextTarget: FirstDeath_Record
notes: 초반 강제 위험 이벤트. 튜토리얼 Bad End이므로 2회차 해금 qualified ending에 포함하지 않는다.
```

```text
id: BadEnd_MissingNight
title: Bad End. 돌아오지 않는 밤
type: Bad End
character: common
seenVar: $badMissingNightSeen
qualified: false
recordbook: true
recordDesc: 고립과 위험이 늑대의 길을 덮었다.
background: BadEnd.png / scene-bg-badend
nextTarget: Ending_ReturnToStart
notes: 기록장에서는 [Bad End. 공통 실패의 흔적] 묶음에 포함된다.
```

```text
id: BadEnd_EmptyScabbard
title: Bad End. 빈 칼집
type: Bad End
character: common
seenVar: $badEmptyScabbardSeen
qualified: false
recordbook: true
recordDesc: 고립과 위험이 늑대의 길을 덮었다.
background: BadEnd.png / scene-bg-badend
nextTarget: Ending_ReturnToStart
notes: 기록장에서는 [Bad End. 공통 실패의 흔적] 묶음에 포함된다.
```

```text
id: BadEnd_TamedWolf
title: Bad End. 길들여진 늑대
type: Bad End
character: common
seenVar: $badTamedWolfSeen
qualified: false
recordbook: true
recordDesc: 고립과 위험이 늑대의 길을 덮었다.
background: BadEnd.png / scene-bg-badend
nextTarget: Ending_ReturnToStart
notes: 기록장에서는 [Bad End. 공통 실패의 흔적] 묶음에 포함된다.
```

```text
id: BadEnd_OwlWolf
title: Bad End. 올빼미의 늑대
type: Bad End
character: common
seenVar: $badOwlWolfSeen
qualified: false
recordbook: true
recordDesc: 고립과 위험이 늑대의 길을 덮었다.
background: BadEnd.png / scene-bg-badend
nextTarget: Ending_ReturnToStart
notes: 기록장에서는 [Bad End. 공통 실패의 흔적] 묶음에 포함된다.
```

```text
id: Hidden_Rebirth / hidden revival route
title: Day End. 돌아갈 길
type: End
character: common
seenVar: $hiddenRevivalDone
qualified: false
recordbook: true
recordDesc: 검 없이도 걸어갈 수 있는 길이 남았다.
background: route/default
nextTarget: TBD
notes: 현재 기록장 표시명은 Day End. 실제 대표 passage는 별도 확인 필요.
```

### Hanbei

```text
id: Hanbei_End_QuietDay
title: Day End. 그냥 온 날
type: End
character: hanbei
seenVar: $endingHanbeiQuietDaySeen
qualified: true
recordbook: true
recordDesc: 한베와 검을 뽑지 않은 시간을 보냈다.
background: route/default
nextTarget: Temple_Return
notes: 1회차 샘플 루트의 대표 엔딩. 현재 UI 표시명은 Day End.
```

```text
id: Hanbei_Good_QuietDay / Hanbei_Good_SittingSilence
title: Day End. 그냥 온 날 / Day End. 곁에 앉은 침묵
type: End
character: hanbei
seenVar: $hanbeiGoodEndingSeen
qualified: true
recordbook: true
recordDesc: 한베와 검을 뽑지 않는 시간을 남겼다.
background: route/default
nextTarget: TBD
notes: 기록장 카운트에서 2개로 계산되는 묶음 항목. 실제 passage 분리 여부를 정리할 필요가 있다.
```

```text
id: Hanbei_MercyEnding
title: Bad End. 끝나는 대련
type: Bad End
character: hanbei
seenVar: $hanbeiMercyEndingSeen
qualified: false
recordbook: true
recordDesc: 끝을 바라는 약속을 받아들였다.
background: BadEnd.png / scene-bg-badend
nextTarget: TBD
notes: 한베 관련 Bad End. qualified ending으로 처리하지 않는다.
```

```text
id: Hanbei_SwordBadEnding
title: Bad End. 불사를 베는 연습
type: Bad End
character: hanbei
seenVar: $hanbeiSwordBadEndingSeen
qualified: false
recordbook: true
recordDesc: 대련은 끝까지 대련으로 남았다.
background: BadEnd.png / scene-bg-badend
nextTarget: TBD
notes: 한베 관련 Bad End. qualified ending으로 처리하지 않는다.
```

```text
id: Ending_Hanbei_True_LivingPractice
title: True End. 사는 연습
type: True End
character: hanbei
seenVar: $endingHanbeiTrueSeen
qualified: true
recordbook: true
recordDesc: 죽지 않는 법이 아니라 사는 법을 조금 배웠다.
background: route/default
nextTarget: Ending_ReturnToStart
notes: $recordEndingHanbeiTrue와 함께 관리된다.
```

```text
id: Ending_Hanbei_Worst_ImmortalWeapon
title: Broken End. 죽지 않는 무기
type: Broken End
character: hanbei
seenVar: $endingHanbeiWorstSeen
qualified: false
recordbook: true
recordDesc: 불사는 죽음을 아무렇지 않게 쓰는 힘이 되었다.
background: BadEnd.png / scene-bg-badend
nextTarget: Ending_ReturnToStart
notes: 내부 passage/변수명은 기존 호환을 위해 Worst를 유지하지만, 표시명과 분류는 Broken End다. $recordEndingHanbeiWorst와 함께 관리된다.
```

### Kuro

```text
id: Ending_Kuro_PathWithoutMaster
title: Day End. 주인 없는 길
type: End
character: kuro
seenVar: $kuroGoodEndingSeen
qualified: true
recordbook: true
recordDesc: 주군과 닌자라는 이름 너머의 길을 보았다.
background: route/default
nextTarget: Ending_ReturnToStart
notes: 현재 UI 표시명은 Day End.
```

```text
id: BadEnd_Kuro_LastOrder
title: Bad End. 마지막 명령
type: Bad End
character: kuro
seenVar: $kuroBadLastOrderSeen
qualified: false
recordbook: true
recordDesc: 명령과 약속 사이에서 돌아오지 못한 길.
background: BadEnd.png / scene-bg-badend
nextTarget: Ending_ReturnToStart
notes: 기록장에서는 [Bad End. 쿠로의 그림자] 묶음에 포함된다.
```

```text
id: BadEnd_Kuro_UnreachableTeahouse
title: Bad End. 닿지 않는 찻집
type: Bad End
character: kuro
seenVar: $kuroBadTeahouseSeen
qualified: false
recordbook: true
recordDesc: 명령과 약속 사이에서 돌아오지 못한 길.
background: BadEnd.png / scene-bg-badend
nextTarget: Ending_ReturnToStart
notes: 기록장에서는 [Bad End. 쿠로의 그림자] 묶음에 포함된다.
```

```text
id: Ending_Kuro_True_NotCommand
title: True End. 명령이 아닌 곁
type: True End
character: kuro
seenVar: $endingKuroTrueSeen
qualified: true
recordbook: true
recordDesc: 명령을 기다리지 않고 쿠로의 곁에 섰다.
background: route/default
nextTarget: Ending_ReturnToStart
notes: $recordEndingKuroTrue와 함께 관리된다.
```

```text
id: Ending_Kuro_Worst_CommandlessBurden
title: Broken End. 무거운 명령
type: Broken End
character: kuro
seenVar: $endingKuroWorstSeen
qualified: false
recordbook: true
recordDesc: 쿠로는 늑대의 삶까지 손에 올려 받았다.
background: BadEnd.png / scene-bg-badend
nextTarget: Ending_ReturnToStart
notes: 내부 passage/변수명은 기존 호환을 위해 Worst를 유지하지만, 표시명과 분류는 Broken End다. $recordEndingKuroWorst와 함께 관리된다.
```

### Genichiro

```text
id: Ending_Genichiro_SettingMoonCastle
title: Day End. 달이 지는 성
type: End
character: genichiro
seenVar: $genichiroGoodEndingSeen
qualified: true
recordbook: true
recordDesc: 겐이치로와 같은 성, 같은 달 아래에 섰다.
background: route/default
nextTarget: Ending_ReturnToStart
notes: 기록장에서는 [Day End. 아시나의 달] 묶음에 포함된다.
```

```text
id: Ending_Genichiro_SameMoon
title: Day End. 같은 달을 등지고
type: End
character: genichiro
seenVar: $endingGenichiroSameMoonSeen
qualified: true
recordbook: true
recordDesc: 겐이치로와 같은 성, 같은 달 아래에 섰다.
background: route/default
nextTarget: Ending_ReturnToStart
notes: 기록장에서는 [Day End. 아시나의 달] 묶음에 포함된다.
```

```text
id: Ending_Genichiro_Footprints
title: Day End. 성에 남은 발자국
type: End
character: genichiro
seenVar: $endingGenichiroFootprintsSeen
qualified: true
recordbook: true
recordDesc: 겐이치로와 같은 성, 같은 달 아래에 섰다.
background: route/default
nextTarget: Ending_ReturnToStart
notes: 기록장에서는 [Day End. 아시나의 달] 묶음에 포함된다.
```

```text
id: BadEnd_GenichiroArrow
title: Bad End. 성문 앞의 화살
type: Bad End
character: genichiro
seenVar: $badEndGenichiroArrowSeen
qualified: false
recordbook: true
recordDesc: 성문 앞에서 늑대는 움직이지 못했다.
background: BadEnd.png / scene-bg-badend
nextTarget: Temple
notes: 성문 화살 타이머 선택지 실패 엔딩. 타이머 선택지 화면은 Danger.png를 사용한다.
```

```text
id: BadEnd_Genichiro_SinkingCastle
title: Bad End. 함께 가라앉는 성
type: Bad End
character: genichiro
seenVar: $badEndGenichiroSinkingCastleSeen
qualified: false
recordbook: true
recordDesc: 성은 무너졌고, 검은 다른 이름으로 남았다.
background: BadEnd.png / scene-bg-badend
nextTarget: Ending_ReturnToStart
notes: 기록장에서는 [Bad End. 꺾이지 않는 성] 묶음에 포함된다.
```

```text
id: BadEnd_Genichiro_LightningWolf
title: Bad End. 번개를 삼킨 늑대
type: Bad End
character: genichiro
seenVar: $badEndGenichiroLightningWolfSeen
qualified: false
recordbook: true
recordDesc: 성은 무너졌고, 검은 다른 이름으로 남았다.
background: BadEnd.png / scene-bg-badend
nextTarget: Ending_ReturnToStart
notes: 기록장에서는 [Bad End. 꺾이지 않는 성] 묶음에 포함된다.
```

```text
id: BadEnd_Genichiro_KneelingCastle
title: Bad End. 무릎 꿇은 성
type: Bad End
character: genichiro
seenVar: $badEndGenichiroKneelingCastleSeen
qualified: false
recordbook: true
recordDesc: 성은 무너졌고, 검은 다른 이름으로 남았다.
background: BadEnd.png / scene-bg-badend
nextTarget: Ending_ReturnToStart
notes: 기록장에서는 [Bad End. 꺾이지 않는 성] 묶음에 포함된다.
```

```text
id: Ending_Genichiro_True_MirrorSide
title: True End. 거울의 반대편
type: True End
character: genichiro
seenVar: $endingGenichiroTrueSeen
qualified: true
recordbook: true
recordDesc: 닮았음을 인정했지만 같은 길에 갇히지 않았다.
background: route/default
nextTarget: Ending_ReturnToStart
notes: $recordEndingGenichiroTrue와 함께 관리된다.
```

```text
id: Ending_Genichiro_Worst_IronGuard
title: Broken End. 철의 호위
type: Broken End
character: genichiro
seenVar: $endingGenichiroWorstSeen
qualified: false
recordbook: true
recordDesc: 지킨다는 명분이 쿠로의 뜻마저 가두었다.
background: BadEnd.png / scene-bg-badend
nextTarget: Ending_ReturnToStart
notes: 내부 passage/변수명은 기존 호환을 위해 Worst를 유지하지만, 표시명과 분류는 Broken End다. $recordEndingGenichiroWorst와 함께 관리된다.
```

### Sculptor

```text
id: Ending_Sculptor_LeftBehindBuddha
title: Day End. 남겨진 불상
type: End
character: sculptor
seenVar: $sculptorGoodEndingSeen
qualified: true
recordbook: true
recordDesc: 불상 곁에 남은 것은 벌이 아니라 기억이었다.
background: route/default
nextTarget: Ending_ReturnToStart
notes: 현재 UI 표시명은 Day End.
```

```text
id: BadEnd_Sculptor_UncarvedFace
title: Bad End. 깎이지 않는 얼굴
type: Bad End
character: sculptor
seenVar: $sculptorBadFaceSeen
qualified: false
recordbook: true
recordDesc: TBD
background: BadEnd.png / scene-bg-badend
nextTarget: Ending_ReturnToStart
notes: 기록장 별도 항목 추가 여부를 점검해야 한다.
```

```text
id: BadEnd_Sculptor_SpreadingEmber
title: Bad End. 옮겨붙은 불씨
type: Bad End
character: sculptor
seenVar: $sculptorBadFireSeen
qualified: false
recordbook: true
recordDesc: TBD
background: BadEnd.png / scene-bg-badend
nextTarget: Ending_ReturnToStart
notes: 기록장 별도 항목 추가 여부를 점검해야 한다.
```

### Isshin

```text
id: Ending_Isshin_ReedSake
title: Day End. 갈대밭의 술자리
type: End
character: isshin
seenVar: $isshinGoodEndingSeen
qualified: true
recordbook: true
recordDesc: 검 대신 술잔을 든 밤이 있었다.
background: route/default
nextTarget: Ending_ReturnToStart
notes: 현재 UI 표시명은 Day End.
```

```text
id: BadEnd_Isshin_EmptyCup
title: Bad End. 빈 술잔
type: Bad End
character: isshin
seenVar: $isshinBadEmptyCupSeen
qualified: false
recordbook: true
recordDesc: TBD
background: BadEnd.png / scene-bg-badend
nextTarget: Ending_ReturnToStart
notes: 기록장 별도 항목 추가 여부를 점검해야 한다.
```

```text
id: BadEnd_Isshin_SwordDemonLaugh
title: Bad End. 검귀의 웃음
type: Bad End
character: isshin
seenVar: $isshinBadSwordLaughSeen
qualified: false
recordbook: true
recordDesc: TBD
background: BadEnd.png / scene-bg-badend
nextTarget: Ending_ReturnToStart
notes: 기록장 별도 항목 추가 여부를 점검해야 한다.
```

### Shura

```text
id: Shura_Ending
title: Shura End. 수라
type: Shura End
character: shura
seenVar: $shuraEndingSeen
qualified: false
recordbook: true
recordDesc: 검이 사람을 삼킨 끝을 보았다.
background: shura/default
nextTarget: TBD
notes: 모두를 끊어내는 결말. 캐릭터 qualified ending으로 처리하지 않는다.
```

---

## 5. 기록장 묶음 항목 주의

현재 기록장 엔딩 탭에는 실제 엔딩 seen 변수와 표시 항목이 1:1이 아닌 묶음이 있다.

묶음 항목:

```text
$hanbeiGoodEndingSeen
= [Day End. 그냥 온 날] / [Day End. 곁에 앉은 침묵]
= 기록장 카운트 +2
```

```text
$kuroBadLastOrderSeen or $kuroBadTeahouseSeen
= [Bad End. 쿠로의 그림자]
```

```text
$genichiroGoodEndingSeen or $endingGenichiroSameMoonSeen or $endingGenichiroFootprintsSeen
= [Day End. 아시나의 달]
```

```text
$badEndGenichiroSinkingCastleSeen or $badEndGenichiroLightningWolfSeen or $badEndGenichiroKneelingCastleSeen
= [Bad End. 꺾이지 않는 성]
```

```text
$badMissingNightSeen or $badEmptyScabbardSeen or $badTamedWolfSeen or $badOwlWolfSeen
= [Bad End. 공통 실패의 흔적]
```

새 엔딩을 추가할 때는 묶음으로 유지할지, 별도 항목으로 분리할지 먼저 결정한다.

---

## 6. 새 엔딩 추가 체크리스트

1. 대표 passage id를 정한다.
2. `title`, `type`, `character`를 정한다.
3. `seenVar`를 만든다.
4. `StoryInit` 또는 세이브 호환 helper에 기본값을 추가한다.
5. 엔딩 passage에서 `seenVar`를 true로 설정한다.
6. 기록장에 남길 경우 `$recordBookNewEnding = true`와 `<<recordNotice "ending">>`를 넣는다.
7. qualified ending인지 결정한다.
8. qualified라면 `<<qualifiedCharacterEnding "character">>`를 호출한다.
9. 엔딩 배경을 지정한다.
10. 엔딩 후 `nextTarget`을 정한다.
11. `RecordBookOverlay_Endings`의 `_seen` 카운트와 항목을 갱신한다.
12. 이 문서에 메타데이터를 추가한다.
13. 빌드한다.

---

## 7. 현재 점검 필요 항목

- 기록장 엔딩 총수는 현재 `엔딩 / 34`로 표시된다. 새 엔딩 추가 시 총수와 `_seen` 계산을 함께 갱신해야 한다.
- `Worst` 내부 변수명은 현재 Broken End 표시명과 혼재한다. 세이브 호환 때문에 당장은 유지하되, 장기적으로 `Broken` 별칭 helper를 만들지 검토한다.
- 조각가/잇신 Bad End는 passage와 seen 변수는 있으나 기록장 표시가 묶음/별도 항목 중 어떤 기준인지 추가 점검이 필요하다.
- `End`와 `Day End` 명칭은 문서상 `End`, UI상 `Day End`로 혼재한다. 표시명 통일 여부를 별도 결정해야 한다.
