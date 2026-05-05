import type { BoardDto } from '../../types';

type BoardListProps = {
    items: BoardDto[];
    emptyMessage?: string;
};

export default function BoardList({ items, emptyMessage = '등록된 게시물이 없습니다.' }: BoardListProps) {
    if (items.length === 0) {
        return <p>{emptyMessage}</p>;
    }

    return (
        <div className="space-y-3">
            {items.map((item) => (
                <article key={item.boardId} className="bg-white rounded-panel shadow-panel p-5 border border-gray-100">
                    <h3 className="text-base font-semibold text-brand-dark mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.content}</p>
                    <small className="text-xs text-gray-400">
                        {item.author} · {item.createdAt}
                    </small>
                </article>
            ))}
        </div>
    );
}