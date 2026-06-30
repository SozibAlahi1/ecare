import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function UserDashboardPage() {
  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col">
        <DashboardClient />
      </main>
      <Footer />
    </>
  );
}
