import { MOCK_COMPANY_EVALUATIONS } from "../../../../../../constants/mockData";
import EvaluationsDashboard from "@/components/EvaluationsDashboard";

export default function CompanyMyEvaluationsPage() {
  return (
    <div className="min-h-screen bg-[#f4fafd] py-10 px-4">
      <EvaluationsDashboard evaluations={MOCK_COMPANY_EVALUATIONS} stakeholder={"company"} />
    </div>
  );
}
