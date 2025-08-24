export default function UpComingCard({icon, eventName, date }) {
  return (
    <div className="UpComingCard flex justify-start items-center gap-2 bg-white p-4 rounded-lg shadow-lg" style={{ width: "220px", height: "56px" }}>
      <img src={icon} alt={eventName} />
      <div className="flex flex-col">
        <span className=" text-black"style={{ fontSize: "12px", fontWeight: 700 }}>Event: {eventName}</span>
        <span className=" text-black" style={{ fontSize: "12px", fontWeight: 600 }}>Date: {date}</span>
      </div>
    </div>
  );
}
