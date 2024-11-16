import { useTranslations } from "next-intl";
import Portal from "@mui/material/Portal/Portal";
import Rewards from "@/app/_assets/rewards-big.png";
import { Button } from "@/components/ui/button";

type WelcomeScreenProps = {
  onClose: () => void;
};

const WelcomeScreen = ({ onClose }: WelcomeScreenProps) => {
  const t = useTranslations("welcomeScreen");

  return (
    <Portal>
      <main className="fixed inset-0 bg-white z-[9999999] flex flex-col justify-end">
        <div className="px-2 mb-2 mx-auto">
          <img alt="Reward" src={Rewards.src} height={128} width={128} />
        </div>
        <div className="flex flex-col gap-6 px-8 mb-6">
          <h1 className="text-3xl text-gradient text-center">{t("title")}</h1>

          <div className="space-y-2">
            <p className="font-medium text-black">
              <span className="size-4">💪</span> {t("features.challengeFriends")}
            </p>
            <p className="font-medium text-black">
              <span className="size-4">🏆</span> {t("features.completeTasks")}
            </p>
            <p className="font-medium text-black">
              <span className="size-4">🌟</span> {t("features.joinCommunity")}
            </p>
          </div>

          <p className="font-light text-black">{t("futureNote")}</p>
        </div>
        <footer className="px-8 mb-12">
          <Button variant="secondary" className="w-full" onClick={onClose}>
            {t("startButton")}
          </Button>
        </footer>
      </main>
    </Portal>
  );
};

export default WelcomeScreen;
