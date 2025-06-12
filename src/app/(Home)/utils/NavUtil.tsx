import SignUp from "@/app/Components/Buttons/sign-up"
import Login from "@/app/Components/Buttons/login"

export default function Navbar() {
  return (
      <nav className="w-full bg-white  p-4 shadow-md border-2 b border-black stroke-200 ">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-lg text-black font-semibold">glucoTrack</span>
          </div>
          <div className="flex flex-row space-x-6">
            <SignUp />
            <Login />
          </div>
        </div>
      </nav>
  )
}