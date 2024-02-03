import logo from "@/public/images/logo.png";
import Image from "next/image";

export default function Home() {
    return (
        <div className="flex flex-col justify-center min-h-full bg-gray-100 py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Image src={logo} alt="Logo" width={48} height={48} className="mx-auto"/>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>
        </div>
    );
}
