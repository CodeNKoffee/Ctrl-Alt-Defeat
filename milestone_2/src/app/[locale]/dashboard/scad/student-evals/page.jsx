import { MOCK_EVALUATIONS } from "../../../../../../constants/mockData";
import EvaluationsDashboard from "@/components/EvaluationsDashboard";

export default function MyEvaluationsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFB] py-10 px-4">
      <h1 className="text-3xl font-bold text-[#2A5F74] mb-8 text-center">My Evaluations</h1>
      <EvaluationsDashboard evaluations={MOCK_EVALUATIONS} stakeholder={"other"} />
    </div>
  );
}
