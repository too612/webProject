import { useCallback, useState } from 'react';
import { missionApi } from './missionApi';
import type { MissionContent } from './missionModel';

export function useMissionContent() {
  const [missionContent, setMissionContent] = useState<MissionContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMissionContent = useCallback(async () => {
    setLoading(true); setError(null);
    try { const data = await missionApi.getMissionContent(); setMissionContent(data); }
    catch (e) { setError(e instanceof Error ? e.message : '조회 중 오류가 발생했습니다.'); }
    finally { setLoading(false); }
  }, []);

  return { missionContent, loading, error, loadMissionContent };
}