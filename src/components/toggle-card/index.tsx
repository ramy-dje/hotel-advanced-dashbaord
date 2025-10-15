import { HiOutlineCheck } from "react-icons/hi";
import { FaCheckCircle } from "react-icons/fa";
const ToggleCard: React.FC<{
  title: string;
  subtitle: string;
  selected: boolean;
  onToggle: () => void;
}> = ({ title, subtitle, selected, onToggle }) => (
  <div
    onClick={onToggle}
    className={`
      relative cursor-pointer rounded-lg border 
      p-4 transition-colors
      ${selected ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"}
      hover:border-blue-400
    `}
  >
    {selected && (
      <FaCheckCircle className="absolute top-2 right-2 text-blue-500" />
    )}
    <h4 className="font-medium">{title}</h4>
    <p className="text-sm text-gray-600">{subtitle}</p>
  </div>
);
export default ToggleCard;