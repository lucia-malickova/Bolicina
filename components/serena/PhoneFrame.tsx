export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[400px]">
      <div
        className="relative h-[820px] overflow-hidden rounded-[54px] border border-white/10 bg-night p-[10px]"
        style={{ boxShadow: "0 0 0 1px rgba(232,214,168,.18), 0 40px 120px rgba(0,0,0,.7), 0 0 80px rgba(232,214,168,.06)" }}
      >
        <div className="relative size-full overflow-hidden rounded-[44px] bg-night">
          <div aria-hidden className="absolute left-1/2 top-2.5 z-30 h-7 w-28 -translate-x-1/2 rounded-full bg-black" />
          {children}
        </div>
      </div>
    </div>
  );
}
