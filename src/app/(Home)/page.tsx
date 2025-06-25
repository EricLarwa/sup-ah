import Navbar from './utils/NavUtil';
import Card from '../Components/Cards/card1';
import Card2 from '../Components/Cards/card2';
import {GetStarted} from '../Components/Buttons/GetStarted';

export default function Landing() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center text-center bg-[#ffffff] border-2 border-black p-8 max-width-screen-lg mx-auto">
        <div>
          <h1 className='text-4xl md:text-6xl font-bold text-black mb-4'>Welcome to glucoTrack</h1>
          <p className='text-lg md:text-xl text-gray-700 mb-8'>Your one-stop solution for all your needs.</p>
          <GetStarted />
        </div>
      </div>
      <div className="flex flex-col min-h-screen items-center bg-[#f5eddf] p-8">
        <div className="flex flex-row flex-wrap justify-center gap-8 mb-8">
          <Card 
          img="Tracking.png"
          title="Quick and Easy Tracking"
          description="Track your glucose readings and reconds current trends with ease."
          link=""
          features={["Mealtime Blood Sugar Readings", "View your trends in real-time", "Keep your blood sugar in your control"]}/>
          <Card 
          img="stats.png"
          title="Understanding Your Stats Is Easy"
          description="View your glucose readings in a simple and easy to understand way."
          link=""
          features={["View your time in range", "understand when you have highs", "keep track of your blood sugar conditions"]}/>
          <Card 
          img="logging.png"
          title="Quick and Simple Logging"
          description="fast and easy logging of your glucose readings, with no hassle."
          link=""
          features={["Log your blood sugar effeciently", "Quick add methods", "Adjust logging to the time of day", "adjusts to MG/DL and MMOL/L"]}/>
        </div>
      </div>
      {/* Splitter Section */}
      <section className="bg-[#ffffff] border-2 border-[#000000] p-8">
        <div className="flex flex-col items-center text-black w-full max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            <div className=" rounded-lg p-6 flex flex-col items-center">
              <h3 className="text-2xl font-semibold mb-2">2 Min</h3>
              <p className="text-lg">Average Log Time</p>
            </div>
            <div className=" rounded-lg p-6 flex flex-col items-center">
              <h3 className="text-2xl font-semibold mb-2">Infinite</h3>
              <p className="text-lg">Storage Capacity</p>
            </div>
            <div className=" rounded-lg p-6 flex flex-col items-center">
              <h3 className="text-2xl font-semibold mb-2">24/7</h3>
              <p className="text-lg">Monitoring Ready</p>
            </div>
            <div className=" rounded-lg p-6 flex flex-col items-center">
              <h3 className="text-2xl font-semibold mb-2">100%</h3>
              <p className="text-lg">Data Privacy</p>
            </div>
          </div>
        </div>
      </section>
      <div className="flex flex-col min-h-screen items-center bg-[#f5eddf] p-8">
        <div className="flex flex-row flex-wrap justify-center gap-8 mb-8">
          <Card2
            title="How It Works"
            description="Easily log your glucose readings, view trends, and manage your health data all in one place." />
          <Card2
            title="Key Features"
            description="Real-time analytics, customizable reminders, and seamless device integration help you stay on track." />
          <Card2
            title="Data Security"
            description="Your health data is encrypted and stored securely, ensuring your privacy at all times." />
          <Card2
            title="Get Started"
            description="Sign up in minutes and begin tracking your glucose with our intuitive, user-friendly interface." />
          <Card2
            title="User Stories"
            description="See how glucoTrack has helped others manage their health and improve their daily routines." />
          <Card2
            title="Help & FAQ"
            description="Find answers to common questions and get support whenever you need it." />
        </div>
      </div>
    </>
  )
}



