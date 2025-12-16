import { Plus } from "lucide-react";

interface InviteMemberBtnProps {
  onClick: () => void;
}
export default function InviteMemberBtn({onClick}:InviteMemberBtnProps){

    return(
        <div>
            <button onClick={onClick} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors border border-gray-300 text-base">
                <Plus size={20} strokeWidth={2.5} />
                Add Member
              </button>
        </div>
    )
    
}