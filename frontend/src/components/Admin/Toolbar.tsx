import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { FaLock, FaLockOpen, FaTrash } from "react-icons/fa6";

interface ToolbarProps {
  selectedIds: number[];
  onBlock: () => void;
  onUnblock: () => void;
  onDelete: () => void;
}

const Toolbar = ({ selectedIds, onBlock, onUnblock, onDelete }: ToolbarProps) => {
  const isDisabled = !selectedIds.length;

  return (
    <div className="flex space-x-2 mb-4">
      <TooltipProvider>
        {/* Block Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => onBlock()} disabled={isDisabled}>
              <FaLock />
              Block
            </Button>
          </TooltipTrigger>

          <TooltipContent>
            <p>Block users</p>
          </TooltipContent>
        </Tooltip>

        {/* Unblock Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={() => onUnblock()} disabled={isDisabled} className="btn-success cursor-pointer">
              <FaLockOpen />
            </Button>
          </TooltipTrigger>

          <TooltipContent>
            <p>Unblock Users</p>
          </TooltipContent>
        </Tooltip>

        {/* Delete Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={"destructive"} onClick={() => onDelete()} disabled={isDisabled} className="btn-warning  cursor-pointer">
              <FaTrash />
            </Button>
          </TooltipTrigger>

          <TooltipContent>
            <p>Delete Users</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default Toolbar;
