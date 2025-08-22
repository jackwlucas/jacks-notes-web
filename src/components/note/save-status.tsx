import {
  CheckIcon,
  CircleAlertIcon,
  CloudCheck,
  DotIcon,
  SaveIcon,
  SaveOffIcon,
} from "lucide-react";

interface NoteSaveStatusProps {
  isPending: boolean;
  isDirty: boolean;
  isError: boolean;
}

export default function NoteSaveStatus({
  isPending,
  isDirty,
  isError,
}: NoteSaveStatusProps) {
  if (isPending) {
    return (
      <div className="mt-1.5 flex items-center gap-1 text-sm text-emerald-600/50">
        <SaveIcon className="h-4 w-4 animate-spin" />
        <p>Saving</p>
      </div>
    );
  } else if (isDirty) {
    return (
      <div className="mt-1.5 flex items-center gap-1 text-sm text-stone-400">
        <SaveOffIcon className="h-4 w-4" />
        <p>Unsaved Changes...</p>
      </div>
    );
  } else if (isError) {
    return (
      <div className="mt-1.5 flex items-center gap-1 text-sm text-red-600/50">
        <CircleAlertIcon className="h-4 w-4" />
        <p>Error</p>
      </div>
    );
  } else {
    return (
      <div className="mt-1.5 flex items-center gap-1 text-sm text-stone-400">
        <CheckIcon className="h-4 w-4" />
        <p>Saved</p>
      </div>
    );
  }
}
