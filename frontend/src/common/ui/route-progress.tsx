import { useEffect, useState } from "react";
import { useNavigation } from "react-router-dom";

export function RouteProgress() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    let t1: number, t2: number, t3: number, tHide: number;

    if (isLoading) {
      setVisible(true);
      setWidth(12);
      t1 = window.setTimeout(() => setWidth(45), 120);
      t2 = window.setTimeout(() => setWidth(72), 420);
      t3 = window.setTimeout(() => setWidth(92), 900);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      setWidth(100);
      tHide = window.setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 260);
      return () => clearTimeout(tHide);
    }
  }, [isLoading]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[3px] bg-transparent">
      <div
        className="h-full rounded-r-full bg-primary shadow-[0_0_12px_rgba(92,107,192,0.6)] transition-[width] duration-300 ease-out"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
