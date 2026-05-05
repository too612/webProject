import type { BoardDto } from '../../types';

type BoardViewProps = {
    item: BoardDto | null;
};

export default function BoardView({ item }: BoardViewProps) {
    if (!item) {
        return <p>게시물 정보를 찾을 수 없습니다.</p>;
    }

    return (
        <article className="bg-white rounded-panel shadow-panel border border-gray-100">
            <header className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-brand-dark">{item.title}</h2>
                <p className="text-xs text-gray-400 mt-1">
                    {item.author} · {item.createdAt}
                </p>
            </header>
            <div className="px-6 py-5 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{item.content}</div>
        </article>
    );
}