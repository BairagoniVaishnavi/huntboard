import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, TrendingUp, Briefcase, MessageSquare, Trophy, XCircle } from "lucide-react";
import useAppStore from "../store/useAppStore";
import Topbar from "../components/layout/Topbar";
import StatsCard from "../components/dashboard/StatsCard";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import ProgressChart from "../components/dashboard/ProgressChart";
import AddJobModal from "../components/modals/AddJobModal";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const jobs = useAppStore((s) => s.jobs);
  const activities = useAppStore((s) => s.activities);

  const applied = jobs.filter((j) => j.status === "applied").length;
  const interviews = jobs.filter((j) => j.status === "interview").length;
  const offers = jobs.filter((j) => j.status === "offer").length;
  const rejected = jobs.filter((j) => j.status === "rejected").length;
  const rejectionRate = jobs.length > 0 ? Math.round((rejected / jobs.length) * 100) : 0;

  return (
    <div className="page-enter">
      <Topbar title="Dashboard" onAddJob={() => setShowModal(true)} />
      <div className="p-6 space-y-6">
        {/* Welcome */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-sora font-bold text-2xl text-gray-900">
              {getGreeting()} 👋
            </h2>
            <p className="text-gray-400 mt-1 text-sm">Here's your job hunt overview</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="hidden sm:flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            <Plus size={16} />
            Add Application
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="Total Applied" value={jobs.length} icon="📋" color="blue" sub={`+${applied} active`} />
          <StatsCard label="Interviews" value={interviews} icon="🗣️" color="amber" sub="Scheduled" />
          <StatsCard label="Offers" value={offers} icon="🎉" color="green" sub="Received" />
          <StatsCard label="Rejection Rate" value={`${rejectionRate}%`} icon="📊" color="rose" sub={`${rejected} total`} />
        </div>

        {/* Chart + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-sora font-bold text-base text-gray-900 mb-5">Pipeline Overview</h3>
            <ProgressChart jobs={jobs} />
          </div>

          {/* Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-sora font-bold text-base text-gray-900">Recent Activity</h3>
              <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                Last {Math.min(activities.length, 8)} actions
              </span>
            </div>
            <ActivityFeed activities={activities} />
          </div>
        </div>

        {/* Quick tips */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-5 text-white">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
              💡
            </div>
            <div>
              <h3 className="font-sora font-bold text-base mb-1">Pro tip</h3>
              <p className="text-sm text-sky-100">
                Following up within 5–7 days of applying increases response rates by up to 40%.
                Don't wait — reach out to your recruiter!
              </p>
            </div>
          </div>
        </div>
      </div>

      {showModal && <AddJobModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
