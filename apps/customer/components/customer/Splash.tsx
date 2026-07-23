import { BrandMark } from '../BrandMark';
import { Icon } from '@jajanhub/ui';

/** Brief splash shown on QR entry before the landing screen. */
export function Splash({ warungName }: { warungName: string }) {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_0%,#FFA24D_0%,#FF7A1A_46%,#E4560A_100%)] flex flex-col items-center justify-center gap-6 text-white animate-screen-in">
      <div className="animate-floaty flex flex-col items-center gap-[18px]">
        <div className="w-[100px] h-[100px] rounded-[30px] bg-white/[.16] flex items-center justify-center shadow-[0_24px_44px_rgba(120,40,0,.28)]">
          <BrandMark size={54} />
        </div>
        <div className="font-display font-extrabold text-[46px] tracking-[-1.5px]">JajanHub</div>
      </div>
      <div className="text-center text-[15px] leading-[1.55] opacity-95">
        Kamu lagi ngantri di
        <br />
        <b className="text-[17px]">{warungName}</b>
      </div>
      <div className="flex gap-[7px] mt-1">
        <span className="w-[9px] h-[9px] rounded-full bg-white animate-dots" />
        <span className="w-[9px] h-[9px] rounded-full bg-white animate-dots [animation-delay:.18s]" />
        <span className="w-[9px] h-[9px] rounded-full bg-white animate-dots [animation-delay:.36s]" />
      </div>
      <div className="absolute bottom-[38px] text-xs opacity-80 flex items-center gap-1.5">
        <Icon name="check-circle" size={15} strokeWidth={2} />
        Gerobak terverifikasi
      </div>
    </div>
  );
}
