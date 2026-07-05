import { NavBar } from "@/components/ui/NavBar";
import { Footer } from "@/components/ui/Footer";
import { Hero } from "@/components/hero/Hero";
import { InsightFlow } from "@/components/insight-flow/InsightFlow";
import { DashboardPreview } from "@/components/dashboard/DashboardPreview";
import { SignatureInteraction } from "@/components/signature/SignatureInteraction";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex min-w-0 flex-1 flex-col">
        <Hero />
        <InsightFlow />
        <DashboardPreview />
        <SignatureInteraction />
      </main>
      <Footer />
    </>
  );
}
