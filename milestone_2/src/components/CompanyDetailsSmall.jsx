import Image from "next/image";

export default function CompanyDetailsS({version, companyName, companyEmail, companyLogo, industry, size, documentation }) {
  return (
    <div className="company-cont">
  <div id={version} className="company-details">
    <div className="tab">Company Details</div>
     <div className="company-content">
      <div className="row-one">
        <div className="comp-cont profile-info">
          <div className="image-container">
            <Image className="company-logo"
              src={companyLogo}
              alt="Company Logo"
              width={80}
              height={80}
            />
          </div>
          <div className="profile-text">
          <div className="company-name">{companyName}</div>
          <div className="company-email">{companyEmail}</div>
          </div>
        </div>
        <div className="comp-cont industry">
          <h3 className="industry-name">Industry</h3>
          <Image className="company-logo"
              src={companyLogo}
              alt="Industry Logo"
              width={60}
              height={100}
            />
          <p>{industry}</p>
          <p>registered on the 1st of May 2024</p>
        </div>
        </div>
        <div className="row-two">
        <div className="comp-cont company-size">
          <h3>Company Size</h3>
          <p>{size}</p>
          <div className="scale">
         
          </div>
        </div>
        </div>
        <div className="row-three">
          <div className="documentations"></div>
          <div className="verdict">
            <button className="accept">Accept</button>
            <button className="reject">Reject</button>
          </div>
        </div>
     </div>
    </div>
    </div>
  );
}