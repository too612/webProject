import OfficialEventPage from './eventPageBase';
import { DEFAULT_EVENT_ITEMS } from './eventModel';

export default function EventPage() {
    return <OfficialEventPage title="행사안내" events={DEFAULT_EVENT_ITEMS} />;
}


