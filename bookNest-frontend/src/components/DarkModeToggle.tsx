import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import useTheme from "../hooks/useTheme";

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button onClick={toggleDarkMode} className="p-2 rounded-md bg-gray-200 dark:bg-gray-800">
      {darkMode ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-gray-600" />}
    </button>
  );
};

export default DarkModeToggle;
