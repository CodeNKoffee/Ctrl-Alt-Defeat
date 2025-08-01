import { getCurrentYear } from "../../utils";
import { useTranslation } from 'react-i18next';
import { createSafeT } from '@/lib/translationUtils';

export default function Copyright() {
  const { t, ready } = useTranslation();
  const safeT = createSafeT(t, ready);

  return (
    <div className="w-full py-1 text-center text-sm text-gray-500">
      {safeT('footer.copyright', { year: getCurrentYear() })}
    </div>
  );
}