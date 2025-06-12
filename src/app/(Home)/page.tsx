import Navbar from './utils/NavUtil';
import Card from '../Components/Cards/card1';
import Card2 from '../Components/Cards/card2';

export default function Landing() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center text-center bg-[#ffffff] border-2 border-black p-8 max-width-screen-lg mx-auto">
        <div>
          <h1 className='text-4xl md:text-6xl font-bold text-black mb-4'>Welcome to glucoTrack</h1>
          <p className='text-lg md:text-xl text-gray-700 mb-8'>Your one-stop solution for all your needs.</p>
          <button className="text-4xl cursor-pointer bg-[#4CAF50] text-black font-semibold py-5 px-15 border-3 border-black rounded hover:bg-[#45a049] transition-colors hover:shadow-[4px_4px_0px_0px_rgba(0,0,1)] duration-300">
            Get Started
          </button>
        </div>
      </div>
      <div className="flex flex-col min-h-screen items-center bg-[#f5eddf] p-8">
        <div className="flex flex-row flex-wrap justify-center gap-8 mb-8">
          <Card 
          img="https://placehold.co/600x400"
          title="Quick Logging"
          description="fastest logging in da land"
          link=""
          features={["Mealtime Blood Sugar Readings", "Extra Stuff"]}/>
          <Card 
          img="https://placehold.co/600x400"
          title="Quick Logging"
          description="fastest logging in da land"
          link=""
          features={["lorem", "ipsum"]}/>
          <Card 
          img="https://placehold.co/600x400"
          title="Quick Logging"
          description="fastest logging in da land"
          link=""
          features={["Lorem", "Ipsem"]}/>
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
            title="About Us"
            description="We are committed to providing the best service possible. Our team works tirelessly to ensure your satisfaction." />
          <Card2
            title="Contact Us"
            description="Have questions? Reach out to us anytime. We are here to help you with any inquiries you may have." />
          <Card2
            title="Support"
            description="Need assistance? Our support team is available 24/7 to help you with any issues you may encounter." />
          <Card2
            title="Feedback"
            description="We value your feedback. Let us know how we can improve our services to better meet your needs." />
          <Card2
            title="Community"
            description="Join our community to connect with like-minded individuals and share your experiences." />
          <Card2
            title="Resources"
            description="Explore our resources for tips, guides, and information to help you make the most of our services." />
        </div>
      </div>
    </>
  )
}



