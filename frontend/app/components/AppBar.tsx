import { Button } from "./Button";

export function AppBar(){
    return(
        <div className="w-full flex justify-between items-center p-4 bg-red-400">
            <div className="">
                APPBAR
            </div>
            <div className="">
                <Button/>
            </div>
        </div>
    )
}