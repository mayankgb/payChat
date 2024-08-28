import { ChatIcon } from "./ChatsIcon"
import { SearchIcon } from "./SearchIcon"
import { TransactionIcon } from "./transactionIcon"

export function SideBar(){
    return(

        <div className="z-[10] bg-gray-800 h-screen w-fit pt-3 px-2 flex flex-col items-center ">
            <ChatIcon/>
            <SearchIcon/>
            <TransactionIcon/>
        </div>
    )
}