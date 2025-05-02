import Image from "next/image";

export default function CompanyDetailsB({version, companyName, companyEmail, companyLogo, industry, size, documentation }) {
  return (
    <div id={version} className="company-details">
     <div className="tab">Company Details</div>
     <div className="company-content">
      <div className="row-one">
        <div className="comp-cont profile-info">
        <div className="image-container">
          <Image
            className="company-logo"
            alt="Company Logo"
            src={companyLogo}
            width={100}
            height={100}
          />
        </div>
        <div className="company-name">{companyName}</div>
        <div className="company-email">{companyEmail}</div>
        </div>
        <div className="notepad">
          <div className="note">Note Pad</div>
          <div className="comp-cont note-container">
            <input
              type="text"
              className="note-input"
              placeholder="" ></input>
               <input
              type="text"
              className="note-input"
              placeholder="" ></input>
               <input
              type="text"
              className="note-input"
              placeholder="" ></input>
          </div>
        </div>
      </div>
      <div className="row-two">
        <div className="comp-cont documentations"></div>
        <div className="comp-cont industry"></div>
        <div className=" comp-cont company-size"></div>
      </div>
     </div>
     <div className="verdict">
      <div className="accept">Accept</div>
      <div className="reject">Reject</div>
     </div>
    </div>
  );
}