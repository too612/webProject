import { useEffect, useState } from 'react';
import { boardApi } from '../api/boardApi';
import type { BoardDto } from '../types';

type UseBoardOptions = {
    listPath: string;
};

export function useBoard({ listPath }: UseBoardOptions) {
    const [items, setItems] = useState<BoardDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await boardApi.getBoardList(listPath);
                setItems(data.items);
            } catch (loadError) {
                setError(loadError instanceof Error ? loadError.message : '게시판 데이터를 불러오지 못했습니다.');
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, [listPath]);

    return {
        items,
        loading,
        error,
    };
}