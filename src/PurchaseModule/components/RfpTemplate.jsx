import React from 'react';

// Try to import both logo variants
const SoftTrailsLogo = () => {
  try {
    return <img src={require('../../assests/SoftTrails.png')} alt="Soft Trails" className="h-9 z-10" />;
  } catch {
    try {
      return <img src={require('../../assests/softtrailslogo.svg')} alt="Soft Trails" className="h-9 z-10" />;
    } catch {
      return <div className="h-9 text-xl font-bold text-center">SOFT TRAILS</div>;
    }
  }
};

const RfpTemplate = ({
  rfpId = "ERY000012",
  companyName = "Higher India Private Limited",
  addressLines = ["2/1 Raipur road ,Survey Chowk,", "Dehradun. 248001"],
  issueDate = "25 May 2025",
  title = "Your title",
  summary = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type .",
  openDate = "25 may 2025",
  endDate = "25 june 2025"
}) => {
  return (
    <div className="relative w-[563px] h-[807px] bg-white border border-[#4B4646]/100 [border-width:0.5px] overflow-hidden rounded-lg">
      {/* Background angled bars */}
      <div 
        className="absolute bg-[#83B4B9] w-[133.1155px] h-[900.9576px] z-0"
        style={{ 
          transform: "rotate(-10.66deg)",
          top: "-78px",
          left: "362px"
        }}
      />
      <div 
        className="absolute bg-[#838383] w-[46.5898px] h-[900.9576px] rounded-b-[30px] z-0"
        style={{ 
          transform: "rotate(-10.66deg)",
          top: "-624px",
          left: "350px"
        }}
      />
      <div 
        className="absolute bg-[#838383] w-[46.5898px] h-[900.9576px] rounded-b-[30px] z-0"
        style={{ 
          transform: "rotate(-10.66deg)",
          top: "-489px",
          left: "382.03px"
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* RFP ID */}
        <div className="absolute text-[13px] font-medium text-black" style={{ top: "28px", left: "31px" }}>
          RFP ID : {rfpId}
        </div>

        {/* Logo */}
        <div className="absolute w-full flex justify-center" style={{ top: "54px" }}>
          <SoftTrailsLogo />
        </div>

        {/* Company Address Block */}
        <div className="absolute text-[15px] font-medium text-black leading-[1.3]" style={{ top: "150px", left: "31px" }}>
          <div>{companyName}</div>
          {addressLines.map((line, index) => (
            <div key={index}>{line}</div>
          ))}
          <div>{issueDate}</div>
        </div>

        {/* Title */}
        <div className="absolute font-bold text-[32px] leading-none text-black" style={{ top: "327px", left: "31px" }}>
          Request for Proposal
        </div>
        <div className="absolute font-bold text-[32px] leading-none text-black" style={{ top: "372px", left: "31px" }}>
          (RFP)
        </div>

        {/* Subtitle */}
        <div className="absolute font-bold text-[20px] text-black" style={{ top: "450px", left: "31px" }}>
          {title}
        </div>

        {/* Body Paragraph */}
        <div 
          className="absolute w-[327px] text-[14px] font-medium text-[#525252] leading-[1.4]" 
          style={{ top: "483px", left: "31px" }}
        >
          {summary}
        </div>

        {/* Footer Dates */}
        <div className="absolute bottom-6 left-[31px] text-[14px] font-medium text-black space-y-1">
          <div>RFP open date : {openDate}</div>
          <div>RFP end date : {endDate}</div>
        </div>

        {/* Optional Gray Bar */}
        <div 
          className="absolute w-[204px] h-[38px] bg-[#525252]" 
          style={{ top: "701px", left: "31px" }}
        />
      </div>
    </div>
  );
};

export default RfpTemplate;