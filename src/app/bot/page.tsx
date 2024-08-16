import devLogo from "@/assets/logos/wahab-sharif-logo.svg";
import Logo from "@/assets/logos/zap-bot-logo-landscape-light.svg";
import BotController from "@/components/bot/BotController";
import Image from "next/image";
import LogoutButton from "../../components/admin/Users/LogoutButton";

export default function BotPage() {
  return (
    <div className="flex flex-col justify-between h-screen">
      <div className="flex-grow flex items-center justify-center">
        <BotController />
      </div>
      <div className="flex-grow flex items-center justify-center mb-4">
        <LogoutButton />
      </div>
      <div className="flex items-center p-4">
        <div className="flex items-center space-x-2">
          <Image src={Logo} alt="zap-bot-logo" width={100} height={100} />
          <p className="flex items-center text-sm text-gray-400">
            Designed and Developed With Passion By
          </p>
          <Image
            src={devLogo}
            alt="dev-logo"
            width={32}
            height={32}
            className=""
          />
          <p className="flex items-center text-md text-[#0d9488]">
            wahabsharif.me
          </p>
        </div>
      </div>
    </div>
  );
}
