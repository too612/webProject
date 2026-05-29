import { useEffect, useState } from 'react';
import { communityFacilitiesCalendarApi } from './calendarApi';
import { COMMUNITY_FACILITIES_CALENDAR_EMPTY, type CommunityFacilitiesCalendarEvent } from './calendarModel';

export function useCommunityFacilitiesCalendarPage() {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [events, setEvents] = useState<CommunityFacilitiesCalendarEvent[]>(COMMUNITY_FACILITIES_CALENDAR_EMPTY);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setError('');

        communityFacilitiesCalendarApi.getCalendar(String(year), String(month))
            .then((items) => {
                if (!mounted) return;
                setEvents(items);
            })
            .catch((e) => {
                if (!mounted) return;
                const message = e instanceof Error ? e.message : '시설 일정 데이터를 불러오지 못했습니다.';
                setError(message);
                setEvents(COMMUNITY_FACILITIES_CALENDAR_EMPTY);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [year, month]);

    const prevMonth = () => {
        if (month === 1) {
            setYear((value) => value - 1);
            setMonth(12);
            return;
        }

        setMonth((value) => value - 1);
    };

    const nextMonth = () => {
        if (month === 12) {
            setYear((value) => value + 1);
            setMonth(1);
            return;
        }

        setMonth((value) => value + 1);
    };

    return {
        year,
        month,
        events,
        loading,
        error,
        prevMonth,
        nextMonth,
    };
}