import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="empty">
      <span className="eyebrow">404 / EONVE</span>
      <h1>잠시 길을 잃었네요.</h1>
      <p>요청하신 페이지를 찾을 수 없습니다.</p>
      <Link href="/" className="button">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
