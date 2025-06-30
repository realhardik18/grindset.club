'use client'
import { useUser, RedirectToSignIn } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidenav from '../../components/Sidenav'
import {
  CheckCircle,
  AlertTriangle,
  Calendar,
  Loader2,
  Info
} from "lucide-react"

export default function Progress() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn || !user) return;
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;
    if (!userEmail) return;
    setLoading(true);
    fetch(`/api/get-goals?user=${encodeURIComponent(userEmail)}`)
      .then(res => res.json())
      .then(data => setGoals(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [isSignedIn, user]);

  if (!isSignedIn) return <RedirectToSignIn />;

  return (
    <div className="flex min-h-screen">
      <Sidenav />
      <div className="flex-1 transition-all duration-300 ease-in-out" style={{ marginLeft: 'var(--sidenav-width, 16rem)', padding: '2rem' }}>
        <h1 className="text-3xl font-bold mb-8 text-white">Your Goals Progress</h1>
        {loading ? (
          <div className="flex justify-center items-center min-h-[40vh]">
            <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
          </div>
        ) : goals.length === 0 ? (
          <div className="text-zinc-400 text-lg text-center mt-16">No goals found.</div>
        ) : (
          <div className="flex flex-col gap-6">
            {goals.map(goal => {
              const createdDate = new Date(goal.created_at);
              const targetDate = new Date(createdDate.getTime() + goal.duration * 24 * 60 * 60 * 1000);
              const today = new Date();
              const daysLeft = Math.ceil((targetDate - today) / (1000 * 60 * 60 * 24));
              return (
                <div
                  key={goal._id}
                  className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 hover:border-blue-500 transition cursor-pointer flex items-center gap-6 group"
                  onClick={() => router.push(`/dashboard/goals/${goal._id}`)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={e => { if (e.key === "Enter") router.push(`/dashboard/goals/${goal._id}`) }}
                >
                  <div className="w-16 h-16 rounded-lg bg-zinc-800 flex items-center justify-center text-3xl border border-zinc-700 mr-4">
                    {goal.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-bold text-white">{goal.title}</h2>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border
                        ${goal.feasible
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                        }`
                      }>
                        {goal.feasible
                          ? <CheckCircle className="w-4 h-4" />
                          : <AlertTriangle className="w-4 h-4" />
                        }
                        {goal.feasible ? "Achievable" : "Needs Adjustment"}
                        {goal.feasibility_reason && (
                          <span className="relative group">
                            <Info className="w-3 h-3 ml-1 cursor-help" />
                            <span className="absolute left-0 top-full mt-2 z-10 bg-zinc-800 border border-zinc-700 rounded-lg p-2 w-64 text-xs text-zinc-300 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                              {goal.feasibility_reason}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-zinc-400 mb-2 line-clamp-2">{goal.description}</div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium border
                        ${daysLeft > 0
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                        }`
                      }>
                        {daysLeft > 0 ? `${daysLeft} days left` : `${Math.abs(daysLeft)} days overdue`}
                      </div>
                      <div className="flex items-center text-xs text-zinc-500">
                        <Calendar className="inline w-3 h-3 mr-1" />
                        {createdDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        {" - "}
                        {targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                    </div>
                  </div>
                  <div className="ml-6 opacity-0 group-hover:opacity-100 transition">
                    <span className="text-blue-400 font-bold text-lg">&rarr;</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}