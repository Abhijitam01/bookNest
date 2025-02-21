import { HomeIcon, BookOpenIcon, CogIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-200 dark:bg-gray-800 p-6">
      <nav>
        <ul className="space-y-4">
          <li><Link to="/" className="flex items-center gap-2 text-lg dark:text-white"><HomeIcon className="w-5 h-5" /> Home</Link></li>
          <li><Link to="/dashboard" className="flex items-center gap-2 text-lg dark:text-white"><BookOpenIcon className="w-5 h-5" /> Library</Link></li>
          <li><Link to="/settings" className="flex items-center gap-2 text-lg dark:text-white"><CogIcon className="w-5 h-5" /> Settings</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
