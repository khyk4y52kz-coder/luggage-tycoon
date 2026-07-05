import BagBusinessTycoon from "../components/BagBusinessTycoon";
import { LanguageProvider } from "../components/LanguageProvider";

export default function Home() {
  return (
    <LanguageProvider>
      <BagBusinessTycoon />
    </LanguageProvider>
  );
}