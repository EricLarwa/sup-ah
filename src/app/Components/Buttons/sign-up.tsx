import Link from 'next/link';
const SignUp = () => {
    return (
        <Link href="/auth">
            <button className="flex items-center justify-center border-black border-2 rounded-md bg-[#FFB8B8] hover:bg-[#FF7D7D] active:bg-[#FF4C4C] w-20 h-10 hover:shadow-[4px_4px_0px_0px_rgba(0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all text-black font-semibold cursor-pointer"
                onClick={() => <Link href="/auth" />}>
                Sign Up
            </button>
        </Link>
    )
}

export default SignUp;