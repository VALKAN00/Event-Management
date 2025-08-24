import NormalCard from "../components/dashboard/NormalCard";
import UpComing from "../components/dashboard/UpComing";
import NetSalesChart from "../components/dashboard/LineChart";
import CustomerEngagementChart from "../components/dashboard/DonutChart";
import Notifications from "../components/dashboard/Notifications";
import LatestEventHeatMap from "../components/dashboard/HeatMap";

const icon1 = "/assets/dashboard/Dancing.svg";
const icon2 = "/assets/dashboard/Movie Ticket.svg";
const icon3 = "/assets/dashboard/Transaction.svg";

export default function Dashboard() {
  return (
    <div className="Dashboard ml-8">
      {/* Main Grid Container */}
      <div className="grid grid-cols-12 gap-4 h-full mb-4">
        
        {/* Left Content Area - spans 9 columns */}
        <div className="col-span-9">
          
          {/* Top Row - Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <NormalCard
              icon={icon1}
              title="EVENTS"
              counter={28}
              text="Events"
              color="#1968AF"
            />
            <NormalCard
              icon={icon2}
              title="BOOKINGS"
              counter={2598}
              color="#F29D38"
            />
            <NormalCard
              icon={icon3}
              title="REVENUE"
              counter={623500}
              text="LKR"
              color="#197920"
            />
          </div>

          {/* Middle Row - Charts */}
          <div className="grid grid-cols-5 gap-4 mb-4">
            {/* Net Sales Chart - spans 3 columns */}
            <div className="col-span-3">
              <NetSalesChart />
            </div>
            
            {/* Customer Engagement Chart - spans 2 columns */}
            <div className="col-span-2">
              <CustomerEngagementChart />
            </div>
          </div>

          {/* Bottom Row - Latest Event */}
          <div className="grid grid-cols-1">
            <LatestEventHeatMap />
          </div>
          
        </div>

        {/* Right Sidebar - spans 3 columns */}
        <div className="col-span-3">
          <div className="space-y-4">
            <UpComing />
            <Notifications />
          </div>
        </div>
        
      </div>
    </div>
  );
}
