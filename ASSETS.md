# 이미지 제작 및 검수

내장 ImageGen으로 메인 화보 1장과 상품 착용컷 24장을 생성했습니다. 원본은 `public/images/hero.png`, `w01.png`–`w12.png`, `m01.png`–`m12.png`에 복사했습니다. 외부 기본 저장 위치에만 의존하지 않습니다.

## 공통 프롬프트

> Use case: product-mockup. A single vertical premium editorial ecommerce catalogue photograph for fictional contemporary clothing brand EONVE. One adult Korean [woman/man] model wearing [garment], garment fully visible and accurately represented, minimal complementary clothing, standing naturally in warm ivory studio on pale stone floor. Full length portrait, neutral face, realistic cloth texture, soft daylight, muted warm neutrals, timeless contemporary fashion. No text, no labels, no watermark, no logos. Portrait 1024x1536.

| 파일 | 프롬프트의 의류                           | 검수 색상 |
| ---- | ----------------------------------------- | --------- |
| w01  | sand double-breasted wool coat            | Sand      |
| w02  | ink black cropped leather jacket          | Ink       |
| w03  | olive oversized trench coat               | Olive     |
| w04  | ivory cotton poplin shirt                 | Ivory     |
| w05  | wine burgundy draped blouse               | Wine      |
| w06  | warm white ribbed long-sleeve top         | Ivory     |
| w07  | charcoal wide-leg tailored trousers       | Charcoal  |
| w08  | sand pleated midi skirt                   | Sand      |
| w09  | indigo straight-leg jeans                 | Indigo    |
| w10  | ink black sleeveless long column dress    | Ink       |
| w11  | olive knit midi dress                     | Olive     |
| w12  | wine burgundy fluid long sleeve dress     | Wine      |
| m01  | sand wool tailored coat                   | Sand      |
| m02  | olive structured cotton overshirt jacket  | Olive     |
| m03  | charcoal cropped zip jacket               | Charcoal  |
| m04  | ivory cotton poplin shirt                 | Ivory     |
| m05  | ink black relaxed t-shirt                 | Ink       |
| m06  | wine burgundy long sleeve shirt           | Wine      |
| m07  | oatmeal sand chunky wool crewneck sweater | Sand      |
| m08  | olive fine-knit cardigan                  | Olive     |
| m09  | charcoal wool turtleneck                  | Charcoal  |
| m10  | ink black wide-leg tailored trousers      | Ink       |
| m11  | sand cotton straight-leg trousers         | Sand      |
| m12  | indigo relaxed denim jeans                | Indigo    |

24장 contact sheet를 육안으로 검수하여 위 색상과 상품 유형을 확인했습니다. 이미지가 실제 소재 성분을 증명하는 것은 아니며 소재·가격·옵션은 가상 상품 설정입니다.

## 메인 화보 프롬프트

> Use case: photorealistic-natural. Asset type: wide hero photograph for EONVE fictional contemporary clothing brand autumn collection. Two adult fashion models, Korean woman wearing a sculptural sand wool coat and ivory dress, Korean man wearing an olive overshirt and charcoal tailored trousers. Architectural warm beige concrete courtyard, quiet natural daylight, refined editorial fashion photography, subtle film grain, full length figures in right half of wide landscape composition with ample empty warm beige wall left for website headline. No text, no logos. 1536x1024 landscape.

## 로고와 폰트

`eonve-logo.png`는 사용자가 제공한 2172×724 투명 PNG 원본입니다. 재생성하거나 임의로 수정하지 않았습니다.

Pretendard Variable과 Cormorant Garamond는 공식 저장소에서 가져와 자체 호스팅합니다. SIL Open Font License 문서는 `public/fonts/`에 포함합니다.

- [Pretendard 공식 저장소](https://github.com/orioncactus/pretendard)
- [Google Fonts Cormorant Garamond](https://github.com/google/fonts/tree/main/ofl/cormorantgaramond)

착용컷 확대 보조 뷰는 CSS로 같은 원본을 확대합니다. 별도로 촬영하거나 생성한 후면 사진으로 표기하지 않습니다.
