import type { Dict } from './es';

/** 한국어 텍스트. es.ts와 정확히 같은 구조를 따릅니다. */
export const ko: Dict = {
  meta: { description: '이키케에서 수입 차량을 쉽고 빠르고 안전하게 사고파세요.' },
  nav: { main: '메인', home: '홈', vehicles: '차량', accessories: '액세서리', services: '서비스', info: '정보', contact: '문의' },
  header: { changeLang: '언어 변경:' },
  hero: {
    title1: '당신의',
    title2: '다음',
    title3: '자동차를 찾아보세요',
    subtitle1: '차량을 사고파는 일을',
    subtitle2: '쉽고, 빠르고, 안전하게.',
    searchLabel: '차량 검색',
    searchPlaceholder: '브랜드, 모델, 연식으로 차량 검색...',
    searchButton: '검색',
    filters: [
      { label: '브랜드', options: ['브랜드', 'KIA', 'Hyundai', 'Chevrolet'] },
      { label: '연식', options: ['연식', '2022', '2021', '2020', '2019'] },
      { label: '가격', options: ['가격', '$8.000.000 이하', '$15.000.000 이하', '$15.000.000 이상'] },
      { label: '카테고리', options: ['카테고리', '자동', '수동', '디젤', '가솔린'] },
    ],
  },
  stats: {
    aria: 'G9 Auto Traders 주요 수치',
    items: [
      { value: '+200', label: '보유 재고 차량' },
      { value: '+100', label: '응대한 고객' },
      { value: '29일', label: '차량 교체 기간' },
      { value: '24시간', label: '문의 답변 시간' },
      { value: '법률 20.422', label: '포용 및 접근성' },
    ],
  },
  notice: { strong: '$30.000 페소로 차량을 예약하세요.', soft: '차량이 마음에 들지 않으면 환불됩니다.' },
  catalog: {
    title: '카탈로그',
    subtitle: '수입 차량 및 정품 액세서리',
    perksAria: '혜택',
    perks: ['직접 금융 지원', '즉시 인도', '문 앞까지 배송', '검증된 재고'],
    filterAria: '차체 유형별 필터',
    all: '전체 보기',
    loading: '차량을 불러오는 중…',
    empty: '현재 이 카테고리에는 차량이 없습니다. 문의해 주시면 입고되는 대로 알려드리겠습니다.',
  },
  card: { special: '특별 할인', fav: '즐겨찾기에 저장', compare: '비교하기', more: '자세히 보기', share: '공유' },
  brands: {
    title: '이키케에서 취급하는 브랜드',
    select: '브랜드를 선택하면 구매 가능한 모델을 볼 수 있습니다',
    available: '구매 가능한 {brand} 차량',
    soon: '곧 {brand} 차량을 만나보실 수 있습니다.',
  },
  importBanner: {
    eyebrow: '맞춤형 서비스',
    title: '한국 직수입 (20만 대 이상의 차량)',
    text: '차량 검색, 구매, 운송, 통관까지 모두 저희가 맡아 처리하며, 칠레 현지 조율과 인도 전 기술 점검을 제공합니다.',
    button: '자세히 알아보기',
  },
  testimonials: {
    title: 'G9 Auto Traders의 실제 고객 후기',
    subtitle: '이키케와 각 지역에서 저희를 통해 차량을 구매하신 고객들의 이야기입니다.',
    rating: '별 5개 평점',
    photoOf: '사진:',
    samples: [
      { title: '훌륭한 회사입니다', quote: '이키케를 떠나지 않고 KIA 쏘렌토를 구매했습니다. 금융 절차를 단계별로 설명해 주셨고, 차량도 약속한 날짜에 도착했습니다.', name: 'Miguel Á. C.' },
      { title: '흠잡을 데 없는 응대', quote: '첫 통화부터 인내심을 갖고 대해 주셨습니다. 계약 전에 차량 이력을 확인하고 모든 세부 사항을 보여주셨습니다.', name: 'Carolina R.' },
      { title: '모든 것에 감사드립니다', quote: '아들과 함께 가족용 미니밴을 보러 갔습니다. 차량과 서류 준비는 물론, 보증 내용도 서면으로 명확하게 받고 나왔습니다.', name: 'Patricia M.' },
      { title: '강력 추천합니다', quote: '모든 절차를 포함해 한국에서 차량을 수입해 주셨습니다. 처음부터 끝까지 투명했습니다.', name: 'Andrea L.' },
    ],
  },
  benefits: {
    aria: '혜택',
    items: [
      { title: '칠레 전역 배송', text: '전국 모든 지역으로 배송해 드립니다.' },
      { title: '영업 시간', text: '월~금 9:00–19:00, 토요일 10:00–14:00.' },
      { title: '투명성', text: '모든 차량의 정비 보고서와 이력을 제공합니다.' },
      { title: '안전한 구매', text: '공증 계약서와 서면 보증을 제공합니다.' },
    ],
  },
  contact: {
    title1: '궁금한 점이 있으신가요? 망설이지 마시고,',
    title2: '문의해 주세요!',
    text: '메시지나 전화로 연락 주세요. 가격, 금융, 실제 재고 여부를 안내해 드립니다.',
    hours: '월~금 9:00–19:00 · 토요일 10:00–14:00',
    mapTitle: '이키케 G9 Auto Traders 지도',
    visit: '매장으로 방문해 주세요',
    openMaps: '구글 지도에서 열기',
  },
  footer: {
    about: '이키케에서 수입 차량 및 중고차를 판매하며, 보증, 금융 지원, 칠레 전역 배송을 제공합니다.',
    columns: [
      { title: '차량', links: ['SUV', '세단', '트럭', '미니밴', '픽업트럭'] },
      { title: '회사', links: ['회사 소개', '채용 안내', '자주 묻는 질문', '문의'] },
      { title: '서비스', links: ['금융 지원', '내 차 시세 평가', '보증', '사후 관리'] },
    ],
    rights: '© 2026 G9 Auto Traders Iquique. 모든 권리 보유.',
    admin: '관리자',
  },
  pagination: { aria: '페이지 이동', prev: '이전', next: '다음', page: '페이지', of: '/' },
  whatsapp: {
    help: '도움이 필요하신가요?',
    aria: 'WhatsApp으로 견적 문의',
    message: '안녕하세요 G9 Auto Traders, 차량 견적을 받고 싶습니다.',
  },
  loadingPage: '불러오는 중…',
  /** 데이터베이스(Supabase)에서 오는 값. 여기에 없는 값은 그대로 표시됩니다. */
  values: {
    etiquetas: {},
    tipos: {},
    combustibles: {},
    transmisiones: {},
  },
};
