import AttendeeCard from "../components/Attendee_Insights/AttendeeCard";
import BarChart from "../components/Attendee_Insights/BarChart";
import PieChart from "../components/Attendee_Insights/PieChart";
import AttendeeAges from "../components/Attendee_Insights/AttendeeAges";

export default function AttendeeInsights() {
  return (
    <div className="bg-[#F2F2F2] min-h-screen">
      {/* Header */}
      <div className="bg-white flex items-center justify-between p-6 border-b border-gray-200 mr-6 ml-6 mt-5 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-600"
            >
              <path
                d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            All Attendee Insights
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Attendees Count */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-500">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-600"
            >
              <path
                d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                fill="currentColor"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Attendees: 7523
            </span>
          </div>

          {/* Filter Button */}
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-500 rounded-lg bg-white hover:bg-gray-50 transition-colors">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-600"
            >
              <path
                d="M3 6H21L18 12V18L15 21V12L3 6Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-gray-700 font-medium">Filter</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-400"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-64 text-black border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="absolute left-3 top-3 text-gray-400"
            >
              <circle
                cx="11"
                cy="11"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M21 21L16.65 16.65"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Main Content - Left Cards and Right Graphs */}
        <div className="flex gap-6 h-[800px]">
          {/* Left Section - Stats Cards */}
          <div className="w-80 h-full flex flex-col justify-between">
            <AttendeeCard
              icon="/assets/dashboard/Transaction.svg"
              title="ATTENDEE AGE"
              value="18 -24 Years"
              trend="increase"
              trendValue="30%"
              numberValue="2345"
            />
            <AttendeeCard
              icon="/assets/dashboard/Transaction.svg"
              title="ATTENDEE GENDER"
              value="Male"
              trend="increase"
              trendValue="18%"
              numberValue="3345"
            />
            <AttendeeCard
              icon="/assets/dashboard/Transaction.svg"
              title="ATTENDEE LOCATION"
              value="Colombo"
              trend="decrease"
              trendValue="15%"
              numberValue="845"
            />
            <AttendeeCard
              icon="/assets/dashboard/Transaction.svg"
              title="ATTENDEE INTERESTS"
              value="EDM Music"
              trend="increase"
              trendValue="53%"
              numberValue="123"
            />
            <AttendeeCard
              icon="/assets/dashboard/Transaction.svg"
              title="TOTAL ENGAGEMENT"
              value="FaceBook ADS"
              trend="decrease"
              trendValue="21%"
              numberValue="21"
            />
          </div>

          {/* Right Section - Charts */}
          <div className="flex-1 flex flex-col gap-6 h-full">
            {/* Bar Chart - Takes 60% of height */}
            <div className="flex-[3]">
              <BarChart />
            </div>

            {/* Bottom Charts Row - Takes 40% of height */}
            <div className="flex-[2] grid grid-cols-2 gap-6">
              {/* Attendee Interests Donut Chart */}
              <div className="h-full">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 w-full h-full flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                    ATTENDEE INTERESTS
                  </h3>
                  <div className="flex-1 min-h-0">
                    <AttendeeAges />
                  </div>
                </div>
              </div>
              {/* Attendee Ages Pie Chart */}
              <div className="h-full">
                <PieChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
