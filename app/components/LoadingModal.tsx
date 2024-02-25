import {ClipLoader} from "react-spinners";

export default function LoadingModal() {
    return (
        <div className="z-50 fixed min-h-full inset-0 flex justify-center items-center bg-gray-100 opacity-80 sweet-loading">
            <div className="loading loading-spinner loading-lg text-accent"></div>

        </div>
    );
}