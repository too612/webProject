import { useState } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import OfficialIndexPopup from "../src/official/index/officialIndexPopup";
import type { BannerItem } from "../src/official/index/officialIndexModel";
import "../src/styles/global.css";
import "../src/styles/layouts/shared.css";

const query = new URLSearchParams(location.search);
const ratios = (query.get("ratios") || "16:9,3:4,1:3").split(",");
const options = (query.get("options") || "DAY,HOURS_4,WEEK").split(",");
const initial: BannerItem[] = ratios.map((ratio, index) => ({
  id: `banner-${index}`,
  title: `공지 ${index + 1}`,
  imageUrl: `/popup-test-image/${ratio.replace(":", "-")}.svg`,
  dismissOption: options[index] || "DAY",
  linkUrl: index === 0 ? "/external-test" : undefined,
}));

function Fixture() {
  const [popups, setPopups] = useState<BannerItem[]>([]);
  return (
    <>
      <header className="header" style={{ height: 128 }}>
        <nav>고정 사이트 네비게이션</nav>
        <button onClick={() => setPopups(initial)}>공지 열기</button>
        <button onClick={() => setPopups((previous) => [...previous].reverse())}>순서 변경</button>
      </header>
      <div style={{ height: 1800 }}>배경 콘텐츠</div>
      <OfficialIndexPopup popups={popups} />
      <Toaster />
    </>
  );
}

createRoot(document.getElementById("root")!).render(<Fixture />);
