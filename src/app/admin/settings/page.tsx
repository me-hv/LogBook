import { getSettings } from "../actions";
import { SettingsManager } from "./SettingsManager";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return <SettingsManager initialSettings={settings} />;
}
