export default function NormalCard({ title, counter, text, icon, color }) {
  return (
    <div
      className="NormalCard bg-white flex justify-start items-center gap-7 p-5"
      style={{
        width: "256px",
        height: "107px",
        borderRadius: "15px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <img src={icon} alt={title} style={{ width: "55px", height: "55px" }} />
      <div>
        <h2
          className="text-xl"
          style={{ color: "rgba(0, 0, 0, 0.69)", fontSize: "14px" }}
        >
          {title}
        </h2>
        <div className="flex">
          <p style={{ color: color, fontSize: "24px", fontWeight: "bold" }}>
            {counter}
          </p>
          <p style={{ color: color, fontSize: "24px", fontWeight: "bold" }}>
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
