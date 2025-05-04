import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      className="fixed md:absolute z-30 top-4 left-4 md:top-8 md:left-8 bg-white/80 hover:bg-metallica-blue-100 text-metallica-blue-700 shadow-md rounded-full p-3 transition-colors duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-metallica-blue-off-charts"
      onClick={() => router.back()}
      aria-label="Go back"
    >
      <FontAwesomeIcon icon={faArrowLeft} className="w-5 h-5" />
    </button>
  );
}