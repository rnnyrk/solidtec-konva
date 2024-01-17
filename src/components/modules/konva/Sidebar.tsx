import { Layers } from './Layers';
import { Settings } from './Settings';

export function Sidebar() {
  return (
    <aside className="flex flex-col justify-between h-screen pt-28 pb-8 px-8 bg-solidtecBlack">
      <Layers />
      <Settings />
    </aside>
  );
}
