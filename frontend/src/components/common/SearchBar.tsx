import { FormEvent, useState } from 'react';

type SearchBarProps = {
  initialKeyword?: string;
  onSearch: (keyword: string) => void;
};

export default function SearchBar({ initialKeyword = '', onSearch }: SearchBarProps) {
  const [keyword, setKeyword] = useState(initialKeyword);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(keyword.trim());
  };

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <input
        value={keyword}
        onChange={(event) => setKeyword(event.target.value)}
        placeholder="검색어를 입력하세요"
        className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
      />
      <button
        type="submit"
        className="inline-flex items-center gap-1 bg-brand-primary text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-[#4e5caf] transition-colors"
      >
        검색
      </button>
    </form>
  );
}
