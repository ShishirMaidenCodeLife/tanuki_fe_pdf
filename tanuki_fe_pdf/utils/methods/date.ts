import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Load the plugin
dayjs.extend(relativeTime);

export function formatRelativeTime(timestamp: string): string {
  return dayjs(timestamp).fromNow();
}
