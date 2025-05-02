import ContinueOption from "../components/ContinueOption";
import { usersOptions } from "../../constants/index";
import Header from "@/components/Header";
import Copyright from "@/components/Copyright";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col kontainer">
      {/* Main content */}
      <div className="flex-grow">
        <div className="row h-full">
          <div className="main">
            {/* Center content vertically */}
            <div className="flex flex-col items-center justify-center flex-grow">
              {/* Header */}
              <div className="w-full flex justify-center mb-8">
                <Header
                  text="Continue As"
                  className="continue-text"
                  isFullWidth={true}
                  size="4xl"
                />
              </div>

              {/* Continue Options */}
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

              {/* Motivational Text */}
              <div className="motivational-text font-ibm-plex-sans">
                Tailored experience for every role.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto">
        <Copyright />
      </footer>
    </div>
  );
}