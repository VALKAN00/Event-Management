import UpComingCard from "./UpComingCard";

const icon1 = "/assets/dashboard/Upcoming/1.svg";
const icon2 = "/assets/dashboard/Upcoming/2.svg";
const icon3 = "/assets/dashboard/Upcoming/3.svg";
const icon4 = "/assets/dashboard/Upcoming/4.svg";
const icon5 = "/assets/dashboard/Upcoming/5.svg";

export default function UpComing() {
  return (
    <div
      className="NormalCard bg-white flex-col justify-start items-start gap-7 p-5 space-y-5"
      style={{
        width: "256px",
        height: "436px",
        borderRadius: "15px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="flex justify-between items-center gap-6">
        <h2
          className="text-xl text-black"
          style={{
            fontSize: "18px",
            color: "#4F4F4F",
            fontFamily: "Poppins",
            fontWeight: 800,
          }}
        >
          Upcoming Events
        </h2>
        <img src="/assets/dashboard/Upcoming/Arrow.svg" alt="Upcoming Event" />
      </div>
      {/* Add your upcoming events content here */}
      <div className="flex-col space-y-2">
        <UpComingCard
          icon={icon1}
          eventName="Cynosure Festival"
          date="24 March 2025"
        />
        <UpComingCard
          icon={icon2}
          eventName="Tech Conference"
          date="15 April 2025"
        />
        <UpComingCard
          icon={icon3}
          eventName="Art Exhibition"
          date="30 May 2025"
        />
        <UpComingCard
          icon={icon4}
          eventName="Music Festival"
          date="12 June 2025"
        />
        <UpComingCard icon={icon5} eventName="Food Fair" date="25 July 2025" />
      </div>
      <div className="flex justify-end">
        <a href="#" className="text-black underline">
          See All
        </a>
      </div>
    </div>
  );
}
