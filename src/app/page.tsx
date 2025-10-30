"use client"
import SignInForm from "@/components/home/sign-in-form";
import { useAuthRedirect } from "@/hooks/use-auth";


export default function LoginPage() {

    useAuthRedirect();


    return (
        <>
            <div className="flex w-full flex-col gap-6 p-5">


                <SignInForm />


            </div>
        </>
    );


}