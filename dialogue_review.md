# Intro

## Intro_01

나레이션:
전란의 시대였다.

늑대가 처음으로 ‘생’을 느낀 것은,
어릴 적 양부의 검날을 붙잡았을 때였다.

손바닥을 찢고 흐르던 뜨거운 피.

그 순간 깨달았다.

그 전까지의 자신은,
그저 숨 쉬는 망령에 불과했다는 것을.

선택지:
* 계속한다 -> Intro_02

## Intro_02

나레이션:
주군을 모시게 된 뒤에는,
비로소 ‘인’이라는 것을 알게 되었다.

소년의 담담한 눈을 바라볼 때면,
도구로만 살아왔던 자신도
조금은 인간다워진 것 같았다.

하지만 결국 도구는 도구.

늑대는 ‘임무’라는 이름 아래
수많은 목숨을 베어 왔다.

선택지:
* 계속한다 -> Intro_03

## Intro_03

나레이션:
하지만 언젠가.

이곳, 시공의 샛길로 빠진 아시나에서
새로운 길을 찾아낼 수 있을까.

누군가의 곁에 남을 수 있을까.

누구의 손을 붙잡을 수 있을까.

아직은 알 수 없다.

그는 아직,
길을 잃은 들개에 불과하니까.

선택지:
* 계속 떠돈다... -> Temple

# Temple

## Temple

나레이션:
<<if $isolation <= -1>>
황폐한 절이다.

적적하지만 어쩐지 편안한 곳이다.
갈 곳 없는 이, 잠시 쉬어가는 이,
고뇌를 깎는 이들이 모여있다.
<<elseif $isolation == 0>>
황폐한 절이다.

사실.
그렇게 황폐하지만은 않다.
<<elseif $isolation <= 2>>
황폐한 절이다.

낡은 불상과 무너진 처마 사이로,
차가운 바람이 지나간다.
<<elseif $isolation <= 4>>
황폐한 절이다.

눈을 감고 있으면 많은 소리가 들린다.
한때나마 사람들의 기원이 모여있던 곳이기에 그런지도.
아니, 그 기원은 지금까지도 내려져 오고 있는지도 모른다.
기억해주는 이만 있다면.
<<elseif $isolation <= 6>>
황폐한 절이다.

이제는 아무 소리도 들리지 않는다.
<<elseif $isolation <= 8>>
황폐한 절이다.

지옥을 앞에 둔 망령들이 모여있다.
<<else>>
황폐한 절이다.

…
<</if>>

나레이션:
늑대는 어디로 향하나?

선택지:
* 죽지 않는 무사에게 다가간다 -> Hanbei01

선택지:
* 한베에게 간다 -> Hanbei02

선택지:
* 한베에게 간다 -> Hanbei03_Beat

선택지:
* 한베와 이야기한다 -> Hanbei_Loop

선택지:
* 주군에게로 간다 -> Kuro01

선택지:
* 쿠로님에게로 간다 -> Kuro

선택지:
* 아시나 성의 대장군에게 간다 -> Genichiro01

선택지:
* 겐이치로 공에게 간다 -> Genichiro

## Temple_AfterNight

선택지:
* 돌아간다 -> Temple

## Temple_Return

나레이션:
밤이 깊어간다…

늑대는 잠시 걸음을 멈췄다.

오늘 밤, 무엇을 할까.

선택지:
* 밤 정찰을 떠난다 -> NightPatrol_Random
* 잠시 쉰다 -> NightRest

나레이션:
밤이 깊어간다.

선택지:
* 돌아간다 -> Temple

## Temple_Return_Bad

나레이션:
밤이 깊어간다.

늑대는 돌아왔다.

돌아왔다는 사실만이,
간신히 확실했다.

선택지:
* 돌아간다 -> Temple

## Temple_Return_Shura

나레이션:
손에 묻은 피가 마르지 않는다.

# Hanbei

## Hanbei01

나레이션:
훈련장.

황폐한 절에서 조금 떨어진 공터.

흙바닥에는 수없이 많은 발자국이 남아 있다.

그리고.

예상했던 사람이 있었다.

선택지:
* 계속 -> Hanbei01_2_Beat

## Hanbei01_2_Beat

나레이션:
그는 검을 어깨에 걸친 채 손을 흔들었다.

마치 오래된 친구를 맞이하는 것처럼.

선택지:
* 계속 -> Hanbei01_2

## Hanbei01_2

[한베]
오.

왔나?

선택지:
* 계속 -> Hanbei01_3

## Hanbei01_3

[늑대]
...

선택지:
* 계속 -> Hanbei01_3_ui2

## Hanbei01_3_ui2

[한베]
뭐야.

그 얼굴.

오늘도 날 베러 온 거 맞구만.

선택지:
* 계속 -> Hanbei01_4_Beat

## Hanbei01_4_Beat

나레이션:
한베는 하하 웃으며 검을 뽑았다.

익숙한 소리.

익숙한 자세.

익숙한 거리.

선택지:
* 계속 -> Hanbei01_4

## Hanbei01_4

[한베]
좋아.

그럼 어디 한번 해보자고.

선택지:
* 대련하러 왔다 -> Hanbei01_Spar
* 그냥 왔다 -> Hanbei01_Just
* 돌아간다 -> Temple_Return

## Hanbei01_End_Beat

나레이션:
짧은 대련이 끝났다.

선택지:
* 계속 -> Hanbei01_End

## Hanbei01_End

[한베]
음.

조금 빨라졌네.

선택지:
* 계속 -> Hanbei01_End_ui2

## Hanbei01_End_2

[한베]
칭찬이라구.

선택지:
* 계속 -> Hanbei01_End_2_ui2

## Hanbei01_End_2_ui2

[늑대]
...

선택지:
* 계속 -> Hanbei01_End_2_ui3

## Hanbei01_End_2_ui3

[한베]
정말 반응이 없구만.

선택지:
* 계속 -> Hanbei01_End_2_ui4

## Hanbei01_End_2_ui4

나레이션:
한베는 검을 거두었다.

선택지:
* 계속 -> Hanbei01_End_3

## Hanbei01_End_3

[한베]
다음에도 오게.

아직, 뒷 마무리가 허술해.

인살할 기회를 자꾸 놓치지 않나.

그리고, 어차피 난 여기 있으니까 말이네.

선택지:
* 계속 -> Hanbei01_End_4

## Hanbei01_End_4

나레이션:
늑대는 잠시 그를 바라보았다.

늘 그 자리에 있는 사람.

늘 같은 자리에 있는 사람.

이상하게도.

그 사실이 당연하게 느껴졌다.

선택지:
* 계속 -> Hanbei01_End_5

## Hanbei01_End_5

[한베]
무슨 일인가.

그 얼굴.

설마 걱정이라도 해주는 건가?

선택지:
* 계속 -> Hanbei01_End_5_ui2

## Hanbei01_End_5_ui2

[늑대]
...

선택지:
* 계속 -> Hanbei01_End_6

## Hanbei01_End_6

[한베]
하하하!

됐다네.

자네의 그런 표정이면 충분하니.

선택지:
* 돌아간다 -> Temple_Return

## Hanbei01_End_ui2

[늑대]
...

선택지:
* 계속 -> Hanbei01_End_2

## Hanbei01_Just

[늑대]
...

선택지:
* 계속 -> Hanbei01_Just_ui2

## Hanbei01_Just_2

[한베]
그냥...?

선택지:
* 계속 -> Hanbei01_Just_2_ui2

## Hanbei01_Just_2_ui2

[늑대]
그렇다.

선택지:
* 계속 -> Hanbei01_Just_2_ui3

## Hanbei01_Just_2_ui3

나레이션:
잠시 침묵.

선택지:
* 계속 -> Hanbei01_Just_3_Beat

## Hanbei01_Just_3_Beat

나레이션:
한베는 검을 바닥에 내려놓았다.

선택지:
* 계속 -> Hanbei01_Just_3

## Hanbei01_Just_3

[한베]
하하하!

그것도 좋네.

매번 검만 휘두르는 것도 질리거든.

선택지:
* 계속 -> Hanbei01_Just_4_Beat

## Hanbei01_Just_4_Beat

나레이션:
그는 웃으며 말했다.

그런데.

그 말은 이상하게도.

조금 외롭게 들렸다.

선택지:
* 계속 -> Hanbei01_Just_4

## Hanbei01_Just_4

[한베]
그럼 잠깐 쉬었다 가게나.

어차피 난 여기 있으니까.

선택지:
* 계속 -> Hanbei01_End_Beat

## Hanbei01_Just_ui2

[한베]
...

선택지:
* 계속 -> Hanbei01_Just_2

## Hanbei01_Spar

[늑대]
한수 부탁하지.

선택지:
* 계속 -> Hanbei01_Spar_ui2

## Hanbei01_Spar_2_Beat

나레이션:
한베는 검을 한 바퀴 돌렸다.

선택지:
* 계속 -> Hanbei01_Spar_2

## Hanbei01_Spar_2

[한베]
솔직히 말하면.

난 자네가 말 거는 것보다 이게 편하더군.

선택지:
* 계속 -> Hanbei01_Spar_2_ui2

## Hanbei01_Spar_2_ui2

[늑대]
...

선택지:
* 계속 -> Hanbei01_Spar_3

## Hanbei01_Spar_3

[한베]
하하하!

그런 눈 하지 마.

나도 안다.

네가 말 없는 거.

선택지:
* 계속 -> Hanbei01_Spar_4

## Hanbei01_Spar_4

[한베]
근데 검은 거짓말을 하지 않지 않나?

선택지:
* 계속 -> Hanbei01_Spar_4_ui2_Beat

## Hanbei01_Spar_4_ui2_Beat

나레이션:
잠시 바람이 분다.

선택지:
* 계속 -> Hanbei01_Spar_4_ui2

## Hanbei01_Spar_4_ui2

[한베]
그 점은 좋더군.

선택지:
* 계속 -> Hanbei01_End_Beat

## Hanbei01_Spar_ui2

[한베]
그래.

그게 제일 당신답다.

선택지:
* 계속 -> Hanbei01_Spar_2_Beat

## Hanbei02

나레이션:
훈련장.

검이 부딪친다.

몇 번이고.

몇 번이고.

선택지:
* 계속 -> Hanbei02_2_Beat

## Hanbei02_2_Beat

나레이션:
한베는 늘 그랬듯 쓰러졌다.

그리고.

늘 그랬듯 다시 일어났다.

선택지:
* 계속 -> Hanbei02_2

## Hanbei02_2

[한베]
음.

이번 건 좀 괜찮았는데.

선택지:
* 계속 -> Hanbei02_3_Beat

## Hanbei02_3_Beat

나레이션:
그는 옷에 묻은 흙을 털었다.

선택지:
* 계속 -> Hanbei02_3

## Hanbei02_3

[한베]
하마터면 넘어갈 뻔했네.

선택지:
* 계속 -> Hanbei02_3_ui2

## Hanbei02_3_ui2

[늑대]
...

선택지:
* 계속 -> Hanbei02_3_ui3

## Hanbei02_3_ui3

[한베]
왜 그러는가?

그런 얼굴 하고.

선택지:
* 다시 자세를 잡는다 -> Hanbei02_Fight_Beat
* 괜찮나 본다 -> Hanbei02_Worry_Beat
* 아무 말도 하지 않는다 -> Hanbei02_Silent

## Hanbei02_End_Beat

나레이션:
바람이 분다.

훈련장에 떨어진 낙엽이 굴러간다.

한베는 검을 어깨에 걸쳤다.

선택지:
* 계속 -> Hanbei02_End

## Hanbei02_End

[한베]
있지.

선택지:
* 계속 -> Hanbei02_End_2

## Hanbei02_End_2

[한베]
사람들은 불사면 좋겠다고 하더군.

선택지:
* 계속 -> Hanbei02_End_2_ui2_Beat

## Hanbei02_End_2_ui2_Beat

나레이션:
그는 웃었다.

선택지:
* 계속 -> Hanbei02_End_2_ui2

## Hanbei02_End_2_ui2

[한베]
뭐.

하루 이틀쯤은 좋을지도 모르겠다만.

선택지:
* 계속 -> Hanbei02_End_3

## Hanbei02_End_3

[한베]
근데 이렇게 오래 되면 질리더군.

선택지:
* 계속 -> Hanbei02_End_3_ui2

## Hanbei02_End_3_ui2

[늑대]
...

선택지:
* 계속 -> Hanbei02_End_3_ui3

## Hanbei02_End_3_ui3

[한베]
하하하!

농담이야.

선택지:
* 계속 -> Hanbei02_End_3_ui4

## Hanbei02_End_3_ui4

나레이션:
그렇게 말했지만.

정말 농담이었는지는 알 수 없었다.

선택지:
* 황폐한 절로 돌아간다 -> Temple_Return

## Hanbei02_Fight_Beat

나레이션:
늑대는 다시 검을 들었다.

선택지:
* 계속 -> Hanbei02_Fight

## Hanbei02_Fight

[한베]
오.

좋아.

그렇게 나와야지.

선택지:
* 계속 -> Hanbei02_Fight_2_Beat

## Hanbei02_Fight_2_Beat

나레이션:
한베도 검을 들었다.

선택지:
* 계속 -> Hanbei02_Fight_2

## Hanbei02_Fight_2

[한베]
근데 잠깐만.

선택지:
* 계속 -> Hanbei02_Fight_2_ui2_Beat

## Hanbei02_Fight_2_ui2_Beat

나레이션:
그가 어깨를 돌린다.

선택지:
* 계속 -> Hanbei02_Fight_2_ui2

## Hanbei02_Fight_2_ui2

[한베]
으.

아프네.

선택지:
* 계속 -> Hanbei02_Fight_3_Beat

## Hanbei02_Fight_3_Beat

나레이션:
잠시 침묵.

선택지:
* 계속 -> Hanbei02_Fight_3

## Hanbei02_Fight_3

[한베]
하하하.

그런 얼굴 하지 마.

죽지 않으니.

선택지:
* 계속 -> Hanbei02_End_Beat

## Hanbei02_Silent

[늑대]
...

선택지:
* 계속 -> Hanbei02_Silent_ui2

## Hanbei02_Silent_2

[한베]
아무 말도 안 하는 건 원래 그렇지만.

오늘은 더 심하네.

선택지:
* 계속 -> Hanbei02_Silent_2_ui2_Beat

## Hanbei02_Silent_2_ui2_Beat

나레이션:
그는 웃으며 일어섰다.

선택지:
* 계속 -> Hanbei02_Silent_2_ui2

## Hanbei02_Silent_2_ui2

[한베]
됐어.

안 죽는다니까.

선택지:
* 계속 -> Hanbei02_Silent_3_Beat

## Hanbei02_Silent_3_Beat

나레이션:
그 말은.

마치 걱정해주기를 바라는 것처럼 들렸다.

선택지:
* 계속 -> Hanbei02_Silent_3

## Hanbei02_Silent_3

[한베]
걱정할 필요 없어.

선택지:
* 계속 -> Hanbei02_End_Beat

## Hanbei02_Silent_ui2

[한베]
...

뭐냐.

선택지:
* 계속 -> Hanbei02_Silent_2

## Hanbei02_Worry_Beat

나레이션:
늑대는 한베의 팔을 바라보았다.

옷이 조금 찢어져 있었다.

상처도 있다.

이미 아물기 시작하고 있었지만.

선택지:
* 계속 -> Hanbei02_Worry

## Hanbei02_Worry

[늑대]
...

선택지:
* 계속 -> Hanbei02_Worry_2

## Hanbei02_Worry_2

[한베]
아.

이거?

선택지:
* 계속 -> Hanbei02_Worry_2_ui2_Beat

## Hanbei02_Worry_2_ui2_Beat

나레이션:
그는 웃었다.

선택지:
* 계속 -> Hanbei02_Worry_2_ui2

## Hanbei02_Worry_2_ui2

[한베]
괜찮아.

익숙하거든.

선택지:
* 계속 -> Hanbei02_Worry_3

## Hanbei02_Worry_3

[한베]
베이는 것도.

부러지는 것도.

죽는 것도.

선택지:
* 계속 -> Hanbei02_Worry_3_ui2_Beat

## Hanbei02_Worry_3_ui2_Beat

나레이션:
그는 아무렇지도 않게 말했다.

선택지:
* 계속 -> Hanbei02_Worry_3_ui2

## Hanbei02_Worry_3_ui2

[한베]
근데.

아프긴 하다.

선택지:
* 계속 -> Hanbei02_Worry_3_ui3

## Hanbei02_Worry_3_ui3

나레이션:
그 말이 이상하게 남았다.

선택지:
* 계속 -> Hanbei02_End_Beat

## Hanbei03_Beat

나레이션:
훈련장.

익숙한 길.

익숙한 공터.

그리고.

익숙한 사람.

선택지:
* 계속 -> Hanbei03

## Hanbei03

[한베]
오.

왔나?

선택지:
* 계속 -> Hanbei03_2_Beat

## Hanbei03_2_Beat

나레이션:
한베는 언제나처럼 검을 들고 있었다.

선택지:
* 계속 -> Hanbei03_2

## Hanbei03_2

[한베]
좋아.

오늘은 몇 번이나 날 날려버릴 생각인가?

선택지:
* 계속 -> Hanbei03_2_ui2

## Hanbei03_2_ui2

[늑대]
...

선택지:
* 계속 -> Hanbei03_3_Beat

## Hanbei03_3_Beat

나레이션:
늑대는 검집에 손을 얹은 채 가만히 서 있었다.

선택지:
* 계속 -> Hanbei03_3

## Hanbei03_3

[한베]
...?

왜 그러나?

설마 다쳤나?

선택지:
* 계속 -> Hanbei03_3_ui2

## Hanbei03_3_ui2

[늑대]
아니다.

선택지:
* 계속 -> Hanbei03_4

## Hanbei03_4

[한베]
그럼.

오늘은 안 베나?

선택지:
* 계속 -> Hanbei03_4_ui2_Beat

## Hanbei03_4_ui2_Beat

나레이션:
잠시 침묵.

선택지:
* 계속 -> Hanbei03_4_ui2

## Hanbei03_4_ui2

[늑대]
그냥 왔다.

선택지:
* 계속 -> Hanbei03_5_Beat

## Hanbei03_5_Beat

나레이션:
바람이 분다.

선택지:
* 계속 -> Hanbei03_5

## Hanbei03_5

[한베]
...

뭐?

선택지:
* 계속 -> Hanbei03_5_ui2

## Hanbei03_5_ui2

[늑대]
그냥.

선택지:
* 계속 -> Hanbei03_5_ui3

## Hanbei03_5_ui3

나레이션:
잠시.

정말 잠시.

한베가 말을 잃는다.

선택지:
* 계속 -> Hanbei03_6

## Hanbei03_6

[한베]
하하하하하!

그게 뭔가!

그냥?

진짜 그냥 왔단 말인가?

선택지:
* 계속 -> Hanbei03_6_ui2

## Hanbei03_6_ui2

[늑대]
그렇다.

선택지:
* 계속 -> Hanbei03_7_Beat

## Hanbei03_7_Beat

나레이션:
한베는 검을 거두었다.

선택지:
* 계속 -> Hanbei03_7

## Hanbei03_7

[한베]
이야.

살다 보니 별일이 다 있군.

난 또 오늘도 맞으러 온 줄 알았는데.

선택지:
* 계속 -> Hanbei03_8

## Hanbei03_8

[한베]
좋아.

그럼 오늘은 쉬자.

앉게.

가끔은 이런 날도 있어야 하지 않겠나.

선택지:
* 대련하자고 한다 -> Hanbei03_Fight
* 그냥 앉아 있는다 -> Hanbei03_Sit_Beat
* 떠난다 -> Hanbei03_Leave

## Hanbei03_Fight

[늑대]
한 수 더 부탁하지.

선택지:
* 계속 -> Hanbei03_Fight_ui2

## Hanbei03_Fight_ui2

[한베]
하하.

역시 그럴 줄 알았네.

좋아.

그럼 조금만 봐주게.

솔직히 어제 것도 아직 아프거든.

선택지:
* 황폐한 절로 돌아간다 -> Temple_Return

## Hanbei03_Leave

[늑대]
가보겠다.

선택지:
* 계속 -> Hanbei03_Leave_ui2

## Hanbei03_Leave_ui2

[한베]
어이.

뭔가 그건.

앉으라니까 가버리는 건 또 처음이군.

하하하.

다음엔 좀 더 있다 가게.

선택지:
* 황폐한 절로 돌아간다 -> Temple_Return

## Hanbei03_Sit_Beat

나레이션:
늑대는 말없이 그의 곁에 앉았다.

선택지:
* 계속 -> Hanbei03_Sit

## Hanbei03_Sit

[한베]
...

이거 좀 신기하군.

선택지:
* 계속 -> Hanbei03_Sit_ui2

## Hanbei03_Sit_2_Beat

나레이션:
잠시 침묵.

바람 소리만 들린다.

선택지:
* 계속 -> Hanbei03_Sit_2

## Hanbei03_Sit_2

[한베]
자네와 이렇게 있는 거 말일세.

생각보다 나쁘지 않더군.

선택지:
* 계속 -> Hanbei03_Sit_3_Beat

## Hanbei03_Sit_3_Beat

나레이션:
그는 웃었다.

하지만.

그 웃음은 평소보다 조금 조용했다.

선택지:
* 계속 -> Hanbei03_Sit_3

## Hanbei03_Sit_3

[한베]
아.

오해는 하지 말게.

대련 안 해서 좋다는 말이야.

선택지:
* 황폐한 절로 돌아간다 -> Temple_Return

## Hanbei03_Sit_ui2

[늑대]
뭐가?

선택지:
* 계속 -> Hanbei03_Sit_2_Beat

## Hanbei_Loop

선택지:
* 계속 -> Hanbei_Loop_Talk

## Hanbei_Loop_Talk

[한베]
어이, 늑대.

오늘도 날은 잘 드는가?

선택지:
* 함께 마시겠나...? -> Hanbei_Sake
* 대련한다. -> Hanbei_Training
* 그냥 돌아간다. -> Temple_Return

## Hanbei_Sake

[늑대]
…함께 마시겠나.

선택지:
* 계속 -> Hanbei_Sake_반응_Beat

## Hanbei_Sake_반응_Beat

나레이션:
한베는 잠시 술병을 바라보다가,
조용히 받아들었다.

선택지:
* 계속 -> Hanbei_Sake_반응

## Hanbei_Sake_반응

[한베]
허어.

자네가 그런 말을 할 줄은 몰랐군.

선택지:
* 황폐한 절로 돌아간다 -> Temple_Return

## Hanbei_Training

선택지:
* 계속 -> Hanbei_Training_반응

## Hanbei_Training_반응

[한베]
좋아. 그 감각이다.

선택지:
* 황폐한 절로 돌아간다 -> Temple_Return

# Kuro

## Kuro

선택지:
* 황폐한 절로 돌아간다 -> Temple_Return

# Genichiro

## Genichiro

선택지:
* 황폐한 절로 돌아간다 -> Temple_Return

# NightPatrol

## NightPatrol_Random

나레이션:
어둠이 내려앉은 심야다.

하지만 늑대는 아시나 병사들의 공격을 피해
한참 지붕 위를 내달리고 있다.

아슬아슬하게 불화살이 뺨을 스친다.

휴식은 멀었다.

나레이션:
밤길 끝에서, 이름 모를 노파가 늑대를 불러 세웠다.

그녀는 늑대가 누구인지도 묻지 않고,
작은 부적 하나를 손에 쥐여주었다.

혼자가 아닌 밤도 있다.

나레이션:
어둠 속에서 발소리가 따라붙었다.

늑대는 뒤돌아보지 않았다.

뒤돌아보면,
무언가가 시작될 것 같았다.

나레이션:
낡은 처마 밑에서 술병 하나를 주웠다.

아직 조금 남아 있다.

나레이션:
멀리서 종소리가 들렸다.

누군가 죽었거나,
누군가 살아남았거나.

그 둘의 차이는
이 밤엔 그리 크지 않았다.

나레이션:
칼집 안쪽에서,
검이 아주 작게 떨렸다.

늑대는 그것을 모른 척했다.

선택지:
* 황폐한 절로 돌아간다 -> Temple_AfterNight

# Other

## NightRest

나레이션:
늑대는 잠시 눈을 감았다.

휴식이라 부르기엔 짧고,
잠이라 부르기엔 얕았다.

그래도 검을 쥔 손의 떨림은
조금 가라앉았다.

선택지:
* 황폐한 절로 돌아간다 -> Temple

## Start

선택지:
* 처음부터 -> Intro_01
