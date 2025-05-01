import Image from "next/image";
import ContinueOption from "../components/ContinueOption";
import Copyright from "../components/Copyright";
import { usersOptions } from "../../constants/index";

export default function Home() {
  return (
    <div className="kontainer">
      <div className="row">
        <div className="main">
         <div className="flex flex-col gap-0">           
           <div className="continue-text font-ibm-plex-sans">Continue As</div>
           <div className="underline"></div>
         </div>
          <div className="continue_options">
            {usersOptions.map((option) => (
              <ContinueOption 
                key={option.value} 
                name={option.name} 
                imageUrl={option.imageUrl} 
                className={option.class} 
                width={option.dimension}
                height={option.dimension}
              />
            ))}
          </div>
          <div className="motivational-text font-ibm-plex-sans" >Tailored experience for every role.</div>
        </div>
        {/* <Copyright /> */}
      </div>
    </div>
  );
}