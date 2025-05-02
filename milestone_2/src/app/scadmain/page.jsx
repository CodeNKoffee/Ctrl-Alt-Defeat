import CompanyDetailsB from "@/components/CompanyDetailsBig";
import CompanyDetailsS from "@/components/CompanyDetailsSmall";
export default function ScadMain() {
  return (
    <div className="kontainer">
      <div className="row h-full">
      <CompanyDetailsS
      version="small"
      companyName="Tawabiry"
      companyEmail="contact-us@tawabiry.com"
      companyLogo="/images/company.png"
      industry="Food and Beverages"
      /> 
      </div>
    </div>
  );
}
// CompanyDetailsB => version:"big"
// CompanyDetailsS => version:"small"