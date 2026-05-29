import { useEffect, useState } from 'react';
import { mypageInquiryApi } from './inquiryApi';
import { EMPTY_MYPAGE_INQUIRIES, type MypageInquiryItem } from './inquiryModel';

export function useMypageInquiryPage() {
  const [items, setItems] = useState<MypageInquiryItem[]>(EMPTY_MYPAGE_INQUIRIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');

    mypageInquiryApi
      .getInquiryList()
      .then((result) => {
        if (!mounted) return;
        setItems(result);
      })
      .catch((e) => {
        if (!mounted) return;
        const message = e instanceof Error ? e.message : '내 문의 내역을 불러오지 못했습니다.';
        setError(message);
        setItems(EMPTY_MYPAGE_INQUIRIES);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return {
    items,
    loading,
    error,
  };
}
