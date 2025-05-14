import { MOCK_EVALUATIONS } from "../../../../../../constants/mockData";
import EvaluationsDashboard from "@/components/EvaluationsDashboard";

export default function MyEvaluationsPage() {
  return (
    <div className="min-h-screen bg-[#f4fafd] py-10 px-4">
      <EvaluationsDashboard evaluations={MOCK_EVALUATIONS} stakeholder={"student"} />
    </div>
  );
}
