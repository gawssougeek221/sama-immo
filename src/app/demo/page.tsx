import { Component } from "@/components/ui/sterling-gate-kinetic-navigation";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#131313] flex flex-col items-center justify-center">
      <div className="w-full">
        <Component />
      </div>
      {/* Placeholder content behind the menu */}
      <div className="flex-1 flex items-center justify-center py-40">
        <p className="text-[#f5f5f5]/30 font-sans text-sm tracking-[0.3em] uppercase">
          Scroll content goes here
        </p>
      </div>
    </div>
  );
}
