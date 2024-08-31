import Link from "next/link";

export function AppBar() {
    return (
        <div className="bg-gray-900 bg-opacity-50 backdrop-blur-sm flex justify-between items-center p-4 h-16 rounded-lg shadow-md">
            <div className="text-white font-semibold text-2xl">
                PayChat
            </div>
            <Link href={"/login"}>
                <button className="bg-blue-600 text-white py-2 px-4 rounded-full shadow-md hover:bg-blue-700 transition duration-300">
                    Login
                </button>
            </Link>
        </div>
    );
}
