import React from "react";
import { createRoot } from "react-dom/client";
import { GameApp } from "@luggage-tycoon/game-ui";
import "@luggage-tycoon/game-ui/styles.css";

createRoot(document.getElementById("root")).render(
  <div className="app-shell">
    <GameApp />
  </div>,
);