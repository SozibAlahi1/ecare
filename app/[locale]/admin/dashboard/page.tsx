import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import { Blog, Team, Testimonial, Portfolio, Contact } from "@/lib/models";
import SeedButton from "./seed-button";
import { BookOpen, Users, MessageSquare, Briefcase, Mail, CheckCircle2 } from "lucide-react";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  if (session !== "session_token_value_ok") {
    redirect("/admin/login");
  }

  let stats = { blogs: 0, team: 0, testimonials: 0, portfolios: 0, contacts: 0 };
  let dbStatus = "Connected";
  try {
    await dbConnect();
    stats.blogs = await Blog.countDocuments();
    stats.team = await Team.countDocuments();
    stats.testimonials = await Testimonial.countDocuments();
    stats.portfolios = await Portfolio.countDocuments();
    stats.contacts = await Contact.countDocuments({ status: "unread" });
  } catch (err: any) {
    dbStatus = "Error: " + err.message;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your digital agency content dynamically from this panel.
        </p>
      </div>



      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Blogs */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">{stats.blogs}</div>
            <div className="text-xs font-semibold text-slate-400">Total Blogs</div>
          </div>
        </div>

        {/* Team */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">{stats.team}</div>
            <div className="text-xs font-semibold text-slate-400">Team Members</div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">{stats.testimonials}</div>
            <div className="text-xs font-semibold text-slate-400">Testimonials</div>
          </div>
        </div>

        {/* Portfolios */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">{stats.portfolios}</div>
            <div className="text-xs font-semibold text-slate-400">Portfolio Items</div>
          </div>
        </div>

        {/* Unread Contacts */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white">{stats.contacts}</div>
            <div className="text-xs font-semibold text-slate-400">Unread Messages</div>
          </div>
        </div>
      </div>

      {/* Database Seeder Section */}
      <div className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Database Initialization / Seed</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Click the button below to pre-populate your MongoDB database with default placeholder dynamic entries (blogs, team members, testimonials, portfolio items, and about/privacy page content) if it is currently empty.
          </p>
        </div>
        <SeedButton />
      </div>
    </div>
  );
}
