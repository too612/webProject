import { useEffect, useState } from 'react';
import { useMissionContent } from './missionHook';
import { DEFAULT_MISSION_CONTENT } from './missionModel';

export default function MissionPage() {
  const { missionContent, loading, error, loadMissionContent } = useMissionContent();
  const [expandedLetterId, setExpandedLetterId] = useState<number | null>(null);

  useEffect(() => { loadMissionContent(); }, [loadMissionContent]);

  const content = { ...DEFAULT_MISSION_CONTENT, ...(missionContent ?? {}) };

  const toggleLetter = (id: number) => {
    setExpandedLetterId((prev) => (prev === id ? null : id));
  };

  return (
    <section className='space-y-5'>
      {loading && <div className='text-sm text-slate-500 py-4 text-center'>불러오는 중입니다.</div>}
      {error && <div className='text-sm text-red-700 bg-red-50 border border-red-100 px-4 py-3'>{error}</div>}

      {!loading && !error && (
        <>
          <div className='rounded-none border border-slate-200 bg-white shadow-panel p-6 md:p-7 space-y-5'>
            <div className='space-y-2 border-l-4 border-brand-primary pl-4 md:pl-5'>
              <h2 className='text-xl md:text-2xl font-bold text-brand-dark'>{content.headline}</h2>
              <p className='text-sm text-gray-600 leading-relaxed max-w-3xl'>{content.summary}</p>
            </div>

            <div>
              <h3 className='text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3'>
                선교사 현황 (총 {content.missionaries.length}가정)
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
                {content.missionaries.map((m) => (
                  <div
                    key={m.country}
                    className='border border-slate-200 rounded-lg bg-slate-50 p-4 space-y-2 hover:border-brand-primary/30 transition-colors'
                  >
                    <div className='flex items-center gap-2'>
                      <span className='text-xl'>{m.countryFlag}</span>
                      <h4 className='font-bold text-brand-dark text-sm'>{m.country}</h4>
                    </div>
                    <p className='text-xs text-gray-700'>{m.missionaryName}</p>
                    <div className='flex items-center gap-2 text-xs text-slate-400'>
                      <span>파송 {m.sentYear}년</span>
                    </div>
                    <p className='text-xs text-gray-500 leading-relaxed'>{m.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='rounded-none border border-slate-200 bg-white shadow-panel overflow-hidden'>
            <div className='border-b border-slate-200 px-6 md:px-8 py-4'>
              <h3 className='font-bold text-brand-dark'>기도편지 및 선교지 소식</h3>
            </div>
            <div className='divide-y divide-slate-100'>
              {content.letters.map((letter) => (
                <article key={letter.id}>
                  <button
                    type='button'
                    onClick={() => toggleLetter(letter.id)}
                    className='w-full text-left px-6 md:px-8 py-4 hover:bg-slate-50 transition-colors border-0 bg-transparent cursor-pointer'
                  >
                    <div className='flex items-start justify-between gap-4'>
                      <div className='space-y-1 min-w-0'>
                        <div className='flex items-center gap-2'>
                          <span className='text-xs font-semibold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded'>
                            {letter.country}
                          </span>
                          <span className='text-xs text-slate-400'>{letter.date}</span>
                        </div>
                        <h4 className='font-semibold text-brand-dark text-sm'>{letter.title}</h4>
                        <p className='text-xs text-gray-500 truncate'>{letter.preview}</p>
                      </div>
                      <svg
                        className={`w-5 h-5 text-slate-300 shrink-0 mt-1 transition-transform ${expandedLetterId === letter.id ? 'rotate-180' : 'rotate-0'}`}
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                      </svg>
                    </div>
                  </button>
                  {expandedLetterId === letter.id && (
                    <div className='px-6 md:px-8 pb-5'>
                      <div className='bg-slate-50 rounded-lg p-5 border border-slate-100'>
                        <p className='text-sm text-gray-700 leading-relaxed whitespace-pre-line'>{letter.content}</p>
                        <p className='text-xs text-slate-400 mt-4 text-right'>- {letter.author}</p>
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  );
}