import { Keyboard } from "@lucasmarkes/hairline/react";
import "../styles/globals.css"
export default function TerrainComponent() {
  return (
    <div className="figures flex w-auto text-[var(--hairline-plate)] h-full">
      <Keyboard 
       intensity={1}
        theme="--hairline-hi"
        label="Interactive terrain"
        play={true}
      />
    </div>
  );
}