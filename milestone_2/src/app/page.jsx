import ContinueOption from "../components/ContinueOption";
import { usersOptions } from "../../constants/index";
import Header from "@/components/Header";
import Copyright from "@/components/Copyright";

export default function Home() {
  return (
    <div className="kontainer">
      <div className="row">
        <div className="main">
          <div className="flex flex-col gap-0">
            <Header 
              text="Continue As" 
              className="continue-text w-fit" 
              isFullWidth={true} 
              size="4xl"
            />
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
        <Copyright />
      </div>
    </div>
  );
}