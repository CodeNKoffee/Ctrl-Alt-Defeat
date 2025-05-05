import CompanyTable from "../../components/CompanyTable";
import { mockCompanies } from "../../components/CompanyTable";

export default function HomePage() {
  return (
    <main className="kontainer">
      <div className="row">
        <CompanyTable companies={mockCompanies} />
      </div>
    </main>
  );
}