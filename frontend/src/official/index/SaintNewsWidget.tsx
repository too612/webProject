/**
 * File Name   : SaintNewsWidget
 * Description : 성도소식 위젯 (경조사 게시판 데이터 준비 중)
 * - 백엔드 community/saint 미구현 상태로, 데이터 연동 전까지 빈 상태를 노출한다.
 */
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function SaintNewsWidget() {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-bold text-brand-dark">
          <Heart className="h-4 w-4 text-brand-primary" /> 성도소식
        </h3>
        <Link
          to="/community/saint/family"
          className="text-base font-bold text-brand-primary hover:underline"
        >
          + 더보기
        </Link>
      </div>
      <div className="mt-3 flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
        <Heart className="h-6 w-6 text-slate-300" />
        <p className="text-sm text-gray-400">등록된 성도소식이 없습니다.</p>
        <p className="text-xs text-gray-300">경조사 게시판 준비 중입니다.</p>
      </div>
    </div>
  );
}
