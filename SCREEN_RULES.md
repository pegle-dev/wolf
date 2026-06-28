# Wolf Screen Rules

Wolf의 모든 passage는 아래 화면 규칙을 따른다.

이 문서는 Codex가 새 passage를 만들거나 기존 passage를 수정할 때 참고하는 공통 화면 규칙이다.

핵심 원칙:

- 한 화면에 너무 많은 UI를 섞지 않는다.
- 긴 나레이션과 선택지는 같은 화면에 두지 않는다.
- 대화창과 선택지는 같은 화면에 두지 않는다.
- 선택지 화면에는 짧은 상황문만 둔다.
- 진행용 문구는 선택지로 만들지 않고 `계속.`으로 처리한다.
- 선택지는 선택의 의미가 있을 때만 사용한다.
- 화면 타입을 섞지 않는다.
- 화면 규칙이 흔들리면 새 내용을 추가하기 전에 구조를 먼저 고친다.

배경 규칙:
- 실제 장소 장면은 해당 장소 배경을 사용한다.
- 이벤트 후 감상/여운은 시간대 공용 배경을 사용한다.
- 오후/밤 직전 감상은 `BeforeNight.png`를 사용한다.
- 밤/밤정찰은 `Night.png`를 사용한다.
- 새벽/귀환은 `Dawn.png`를 사용한다.

---

## 1. 나레이션 화면

나레이션 화면은 긴 문장, 분위기, 상황 설명을 보여주는 화면이다.

### 역할

- 긴 서술
- 분위기
- 사건의 전개
- 선택 전의 긴장
- 선택 결과의 여운
- 꿈, 회상, 위험의 전조

### 기본 구조

```twee
<div class="narration-screen">
  <div class="narration narration-block">
    나레이션 본문
  </div>
</div>

<<continueTo "NextPassage">>
```

### 규칙

- 긴 나레이션만 둔다.
- 선택지를 같이 두지 않는다.
- 대화창을 같이 두지 않는다.
- 진행은 공통 `<<continueTo>>`를 사용한다.
- `계속.`은 우하단 공통 버튼으로 표시된다.
- 나레이션 위치는 상단 중앙 기준으로 통일한다.
- 나레이션 텍스트는 너무 밝은 흰색보다 바랜 회색 계열을 사용한다.
- 나레이션이 길어질수록 선택지는 반드시 다음 화면으로 분리한다.

### 금지 구조

```twee
<div class="narration-screen">
  <div class="narration narration-block">
    긴 나레이션...
  </div>

  <div class="global-choice-layer">
    선택지...
  </div>
</div>
```

긴 나레이션과 선택지는 한 화면에 같이 두지 않는다.

---

## 2. 대화 화면

대화 화면은 캐릭터 대사만 보여주는 화면이다.

### 역할

- 캐릭터의 말
- 대화 리듬
- 인물의 감정 표현
- 말투와 침묵
- 관계의 온도

### 기본 구조

```twee
<div class="dialogue-screen">
  <div class="dialogue-box">
    대화 내용
  </div>
</div>

<<continueTo "ChoiceOrNextPassage">>
```

### 규칙

- 대화창 화면에는 선택지를 넣지 않는다.
- 대화창 아래에 선택지를 붙이지 않는다.
- 대화는 대화만 보여준다.
- 선택이 필요하면 다음 passage로 분리한다.
- 대화창 한 번에 1~3줄을 권장한다.
- 4줄 이상이면 문장을 나누거나 다음 대화 passage로 넘긴다.
- 늑대의 대사는 짧게 유지한다.
- 캐릭터 대사 뒤에 선택지가 필요하면 `Dialogue -> Choice` 구조로 나눈다.

### 나쁜 구조

```twee
<div class="dialogue-screen">
  <div class="dialogue-box">
    한베:
    왜 그러는가?
    그런 얼굴 하고.
  </div>
</div>

<div class="global-choice-layer">
  <div class="global-choice-box">
    <<choiceTo "다시 자세를 잡는다" "TargetA">>
    <<choiceTo "괜찮나 보다" "TargetB">>
    <<choiceTo "아무 말도 하지 않는다" "TargetC">>
  </div>
</div>
```

### 좋은 구조

```twee
:: Hanbei_Concern

<div class="dialogue-screen">
  <div class="dialogue-box">
    한베:
    왜 그러는가?
    그런 얼굴 하고.
  </div>
</div>

<<continueTo "Hanbei_Concern_Choice">>
```

```twee
:: Hanbei_Concern_Choice

<div class="choice-screen">
  <div class="choice-prompt">
    한베가 늑대를 바라보고 있다.
  </div>

  <div class="global-choice-layer">
    <div class="global-choice-box">
      <<choiceTo "다시 자세를 잡는다" "TargetA">>
      <<choiceTo "괜찮나 보다" "TargetB">>
      <<choiceTo "아무 말도 하지 않는다" "TargetC">>
    </div>
  </div>
</div>
```

---

## 3. 선택지 화면

선택지 화면은 플레이어가 선택하는 화면이다.

### 역할

- 판단
- 선택
- 관계 변화
- 위험 회피
- 갈등 선택
- 플레이어가 늑대의 반응을 정하는 순간

### 기본 구조

```twee
<div class="choice-screen">
  <div class="choice-prompt">
    짧은 상황문 1~2줄
  </div>

  <div class="global-choice-layer">
    <div class="global-choice-box">
      <<choiceTo "선택지 1" "TargetA">>
      <<choiceTo "선택지 2" "TargetB">>
    </div>
  </div>
</div>
```

### 규칙

- 선택지 화면에는 긴 나레이션을 넣지 않는다.
- `choice-prompt`는 1~2줄만 사용한다.
- `choice-prompt`는 상단 문장만 담당한다. 선택지 선, 배경, 테두리를 담당하지 않는다.
- 직전 나레이션의 핵심 상황만 짧게 다시 보여준다.
- 선택지는 화면 하단 중앙에 둔다.
- 선택지는 `choice-prompt`보다 충분히 아래에 둔다. 일반 선택지는 화면 하단에서 약 64px, 시간제 선택지는 타이머바 공간을 포함해 약 88px 위를 기준으로 한다.
- `choice-prompt`가 2줄이 되어도 선택지 묶음과 닿지 않아야 한다.
- 선택지와 prompt가 겹치면 안 된다.
- `global-choice-layer`는 위치만 담당한다. 배경, 선, 테두리, 그림자를 갖지 않는다.
- `global-choice-box`는 실제 선택지 묶음만 감싸는 작은 박스다.
- 선택지 위/아래 선은 `global-choice-box`에만 표시한다.
- 선택지 뒤에는 박스 배경을 만들지 않는다.
- 선택지 앞 삼각형은 유지한다.
- 선택지 묶음의 가장 위와 가장 아래에만 선을 둔다.
- 선택지 사이에는 선을 두지 않는다.
- 선택지 hover 시 글자와 삼각형만 밝아진다.
- 선택지 선은 hover 시 색이 바뀌지 않는다.

### 좋은 choice-prompt 예시

```text
쿠로가 기둥 아래에 있다.
```

```text
한베가 늑대를 바라보고 있다.
```

```text
성 밑의 통로에 무언가 남아 있다.
```

```text
화살이 날아온다.
```

### 나쁜 choice-prompt 예시

```text
벽은 젖어 있었고,
발소리는 오래 머물렀다.

늑대는 숨을 죽였다.
습관처럼.
```

이런 긴 문장은 선택지 화면이 아니라 나레이션 화면에 둔다.

---

## 4. 시간제 선택지 화면

시간제 선택지 화면은 위험한 순간, 즉각적인 반응, 죽음 가능성이 있는 선택에 사용한다.

### 역할

- 긴박한 선택
- 위험 회피
- 죽음 가능성
- 원작처럼 순간적인 반응이 필요한 장면

### 기본 구조

```twee
<div class="choice-screen timed-choice-screen danger-scene">
  <div class="choice-prompt">
    짧은 위험 상황문
  </div>

  <div class="global-choice-layer">
    <div class="timed-choice-stack">

      <div class="timed-choice-bar-ui">
        <div class="timed-choice-bar-track">
          <div class="timed-choice-bar-fill first-death-tension-fill"></div>
        </div>
      </div>

      <div class="global-choice-box">
        <<choiceTo "선택지 1" "TargetA">>
        <<choiceTo "선택지 2" "TargetB">>
      </div>

    </div>
  </div>
</div>
```

### 규칙

- 시간제 선택지 화면에는 `계속.`이 나오면 안 된다.
- prompt는 짧게 쓴다.
- 타이머바는 선택지 묶음 바로 위에 둔다.
- 타이머바와 선택지는 하나의 UI 묶음처럼 보여야 한다.
- 타이머 선택지가 뜨는 위험한 순간에는 `Danger.png` 배경을 사용한다.
- 타이머바는 양쪽에서 가운데로 줄어드는 연출을 유지한다.
- shake 연출이 필요하면 위치를 잡는 요소에 직접 적용하지 않는다.
- shake는 내부 wrapper에만 적용한다.
- `choice-prompt`나 `global-choice-layer`의 `transform`을 animation으로 덮어쓰지 않는다.

### shake 안전 구조

```twee
<div class="choice-prompt">
  <div class="urgent-shake-inner">
    기둥이 무너진다.<br>
    쿠로가 그 아래에 있다.
  </div>
</div>

<div class="global-choice-layer">
  <div class="urgent-shake-inner">
    <div class="timed-choice-stack">
      ...
    </div>
  </div>
</div>
```

### 사용 예시

- `FirstDeath_Choices`
- `Genichiro_ArrowChoice`
- 앞으로 추가될 위험한 순간의 선택지

---

## 5. 엔딩 화면

엔딩 화면은 결말 나레이션과 엔딩 제목을 보여주는 화면이다.

### 역할

- 결말의 여운
- 엔딩 분류 표시
- 기록장에 남을 사건의 확정

### 기본 구조

```twee
<div class="badend-screen scene-bg-badend">
  <div class="badend-narration">
    엔딩 나레이션
  </div>

  <div class="badend-title">
    [Bad End. 제목]
  </div>
</div>

<<continueTo "NextPassage">>
```

### 규칙

- 엔딩 나레이션과 엔딩 제목이 겹치면 안 된다.
- 엔딩 나레이션은 화면 위쪽에 둔다.
- 엔딩 제목은 나레이션 아래에 둔다.
- 엔딩 제목은 나레이션보다 크게 표시한다.
- 엔딩 제목은 우하단 `계속.` 버튼보다 위에 있어야 한다.
- 기본 Bad End에는 `BadEnd.png` 배경을 사용한다.
- 텍스트가 배경에 묻히지 않도록 어두운 overlay를 사용할 수 있다.

### 첫 번째 죽음 예시

```text
늑대는 쿠로를 구했다.

그리고,
그 자리에서 죽었다.


[Bad End. 익숙한 죽음]
```

---

## 6. 진행용 문구 규칙

아래 문구는 선택지가 아니라 진행 버튼으로 처리한다.

- 돌아간다
- 절로 돌아간다
- 황폐한 절로 돌아간다
- 눈을 뜬다
- 다음으로
- 계속한다

이런 문구는 `<<continueTo "Target">>`로 바꾼다.

### 예시

나쁜 구조:

```twee
<<choiceTo "눈을 뜬다" "Temple">>
```

좋은 구조:

```twee
<<continueTo "Temple">>
```

### 예외

아래는 의미 있는 선택지일 수 있으므로 자동으로 바꾸지 않는다.

- 돌아본다
- 고개를 돌린다
- 뒤돌아본다
- 다가간다
- 기다린다
- 잠든다
- 밤 정찰을 나선다
- 검을 뽑는다

---

## 7. 기록장 화면

기록장은 정식 UI overlay다.

### 규칙

- 기록장은 overlay형만 사용한다.
- legacy `RecordBook_*` passage로 직접 이동하지 않는다.
- 기록장 열림 중에는 `계속.` 버튼이 보이지 않아야 한다.
- 기록장 overlay는 다른 UI보다 위에 떠야 한다.
- 기록장 내부는 `white-space: normal`이어야 한다.
- 기록장 내부에 실제 빈 줄, 빈 `<p>`, 빈 `<div>`, `<br>`가 남지 않게 한다.
- 기록장 스크롤은 `.recordbook-content`가 담당한다.
- `.recordbook-panel` 전체가 스크롤되면 안 된다.

---

## 8. 수치 변화 / 기록 알림

수치 변화와 기록장 알림은 본문 중앙에 띄우지 않는다.

### 위치

- 기록장 버튼 아래쪽
- 화면 오른쪽 상단 계열
- 본문/대화/선택지와 겹치지 않는 곳

### 예시 문구

```text
기록장에 새로운 흔적이 남았다.
늑대는 위험한 예감을 느낀다...
한베 애정 +1
겐이치로 갈등 +1
```

### 규칙

- 작고 조용하게 fade in/out한다.
- 기록장 overlay가 열려 있을 때는 표시하지 않는다.
- 무채색/바랜 회색 계열을 사용한다.
- 알림은 본문 정보가 아니라 상태 정보다.

---

## 9. 배경 규칙

배경은 scene type에 따라 관리한다.

### black

사용:
- 인트로 꿈
- 첫 쿠로 구출 전까지
- 일부 암전 장면

### danger

사용:
- 타이머 선택지가 뜨는 위험한 순간
- `Danger.png`

예:
- `FirstDeath_Choices`
- `Genichiro_ArrowChoice`

### badend

사용:
- 기본 Bad End
- `BadEnd.png`

### temple

사용:
- 낮의 황폐한 절
- `Temple`

### night

사용:
- 밤 선택 라우터
- `Night02.png`

예:
- `Temple_Return`

---

## 10. 낮 / 밤 / 귀환 화면 규칙

### Temple

- 낮의 황폐한 절 허브
- `$timeOfDay = "day"`
- 인물 선택 / 낮 이벤트
- `밤 정찰을 나선다`, `잠든다`는 직접 나오지 않는다.

### Temple_Return

- 밤 행동 선택 라우터
- `$timeOfDay = "night"`
- 배경은 `Night02.png`
- 선택지:
  - 밤 정찰을 나선다
  - 잠든다
  - 절에 머문다

### NightPatrol / NightRisk

- 밤 이벤트
- 위험 / 고독 / 수라 / 죽음 가능성

### Temple_AfterNight

- 밤 행동 후 완충 화면
- `$timeOfDay = "dawn"`

### ReturnEvent_Router

- 귀환 이벤트
- 밤 행동 후 다음 낮으로 돌아가기 전의 짧은 관찰 컷
- 변수 변화는 거의 주지 않는다.

---

## 11. Codex 작업 시 우선순위

Codex가 passage를 수정할 때는 아래 순서로 판단한다.

1. 이 화면은 어떤 화면 타입인가?
   - 나레이션
   - 대화
   - 선택지
   - 시간제 선택지
   - 엔딩
   - 기록장
2. 화면 타입이 섞여 있는가?
3. 긴 문장과 선택지가 같이 있는가?
4. 대화창과 선택지가 같이 있는가?
5. 진행용 문구가 선택지로 남아 있는가?
6. 선택지가 나레이션과 겹치는가?
7. 기록장/알림/계속 버튼이 서로 겹치는가?

화면 타입이 섞여 있다면 새 내용을 추가하기 전에 먼저 분리한다.
