import React from "react";
import LogoutButton from "../../components/admin/Users/LogoutButton";
import BotController from "@/components/bot/BotController";
export default function BotPage() {
  return (
    <div>
      <BotController />
      <LogoutButton />
    </div>
  );
}
