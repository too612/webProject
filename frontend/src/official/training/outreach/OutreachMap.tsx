import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { MapMarker, MapView } from "../../../common/map";
import type { OutreachActivity } from "./outreachModel";
import { hasOutreachCoordinates } from "./outreachModel";

type OutreachMapProps = Readonly<{
  activities: OutreachActivity[];
}>;

type MarkerGroup = Readonly<{
  latitude: number;
  longitude: number;
  activities: OutreachActivity[];
}>;

const MAP_CENTER_LONGITUDE = -160;

function groupByCoordinate(activities: OutreachActivity[]): MarkerGroup[] {
  const groups = new Map<string, MarkerGroup>();

  activities.filter(hasOutreachCoordinates).forEach((activity) => {
    const { latitude, longitude } = activity;
    const key = `${latitude.toFixed(6)}:${longitude.toFixed(6)}`;
    const existingGroup = groups.get(key);

    if (existingGroup) {
      groups.set(key, {
        ...existingGroup,
        activities: [...existingGroup.activities, activity],
      });
      return;
    }

    groups.set(key, { latitude, longitude, activities: [activity] });
  });

  return Array.from(groups.values());
}

function normalizeLongitude(longitude: number) {
  let normalizedLongitude = longitude;

  while (normalizedLongitude - MAP_CENTER_LONGITUDE > 180) {
    normalizedLongitude -= 360;
  }

  while (normalizedLongitude - MAP_CENTER_LONGITUDE < -180) {
    normalizedLongitude += 360;
  }

  return normalizedLongitude;
}

function getGroupKey(group: MarkerGroup) {
  return `${group.latitude.toFixed(6)}:${group.longitude.toFixed(6)}`;
}

function getActivityKey(activity: OutreachActivity) {
  return (
    activity.employeeNo ??
    `${activity.country}-${activity.city}-${activity.missionaryName}`
  );
}

function MissionaryBubble({
  activity,
  onDismiss,
}: Readonly<{ activity: OutreachActivity; onDismiss: () => void }>) {
  return (
    <button
      type="button"
      className="common-map-missionary-popup border-0 text-left"
      onClick={onDismiss}
      aria-label={`${activity.missionaryName} 선교사 정보 닫기`}
    >
      <p className="font-bold text-brand-dark">{activity.missionaryName}</p>
      <p className="mt-1 text-xs text-slate-600">
        {activity.country}
        {activity.city ? ` · ${activity.city}` : ""}
      </p>
      {activity.assignmentContent && (
        <p className="mt-2 text-xs leading-relaxed text-slate-700">
          {activity.assignmentContent}
        </p>
      )}
      {activity.sentYear > 0 && (
        <p className="mt-2 text-[11px] text-slate-400">
          파송 {activity.sentYear}년
        </p>
      )}
    </button>
  );
}

function MissionaryBubbles({ group }: Readonly<{ group: MarkerGroup }>) {
  const map = useMap();
  const [dismissedKeys, setDismissedKeys] = useState<Set<string>>(
    () => new Set(),
  );
  const [point, setPoint] = useState(() =>
    map.latLngToContainerPoint([
      group.latitude,
      normalizeLongitude(group.longitude),
    ]),
  );

  useEffect(() => {
    const updatePosition = () => {
      setPoint(
        map.latLngToContainerPoint([
          group.latitude,
          normalizeLongitude(group.longitude),
        ]),
      );
    };

    map.on("move zoom resize", updatePosition);
    updatePosition();
    return () => {
      map.off("move zoom resize", updatePosition);
    };
  }, [group.latitude, group.longitude, map]);

  const visibleActivities = group.activities.filter(
    (activity) => !dismissedKeys.has(getActivityKey(activity)),
  );

  if (visibleActivities.length === 0) {
    return null;
  }

  return (
    <div
      className="common-map-missionary-overlay"
      style={{ left: point.x, top: point.y }}
    >
      <div className="common-map-missionary-bubbles">
        {visibleActivities.map((activity) => (
          <MissionaryBubble
            key={getActivityKey(activity)}
            activity={activity}
            onDismiss={() =>
              setDismissedKeys((current) =>
                new Set(current).add(getActivityKey(activity)),
              )
            }
          />
        ))}
      </div>
    </div>
  );
}

export function OutreachMap({ activities }: OutreachMapProps) {
  const markerGroups = groupByCoordinate(activities);
  const [showGuide, setShowGuide] = useState(true);
  const [selectedGroupKey, setSelectedGroupKey] = useState<string | null>(null);
  const selectedGroup = markerGroups.find(
    (group) => getGroupKey(group) === selectedGroupKey,
  );

  return (
    <div className="relative overflow-hidden border border-slate-200 bg-slate-100">
      <MapView className="h-[380px] md:h-[460px]">
        {markerGroups.map((group) => {
          const groupKey = getGroupKey(group);
          return (
            <MapMarker
              key={groupKey}
              latitude={group.latitude}
              longitude={normalizeLongitude(group.longitude)}
              onClick={() =>
                setSelectedGroupKey((current) =>
                  current === groupKey ? null : groupKey,
                )
              }
            />
          );
        })}
        {selectedGroup && (
          <MissionaryBubbles key={selectedGroupKey} group={selectedGroup} />
        )}
      </MapView>

      {showGuide && (
        <button
          type="button"
          className="absolute bottom-4 right-4 z-[400] max-w-[min(90%,28rem)] bg-white/90 px-4 py-3 text-left text-xs leading-relaxed text-slate-600 shadow-panel backdrop-blur-sm transition-colors hover:bg-white"
          onClick={() => setShowGuide(false)}
          aria-label="지도 안내 닫기"
        >
          지도 위 마커에서 선교사별 사역 정보를 확인할 수 있습니다.
        </button>
      )}
    </div>
  );
}
