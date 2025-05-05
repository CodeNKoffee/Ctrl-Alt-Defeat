import { getCurrentYear } from "../../utils";

export default function Copyright() {
  return (
    <div className="w-full py-1 text-center text-sm text-gray-500">
      &copy; {getCurrentYear()} German University in Cairo. All rights reserved.
    </div>
  );
}