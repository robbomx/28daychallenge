import { useRef } from "react";

interface Props {
  label: string;
  sublabel: string;
  photoDataUrl?: string;
  onUpload: (dataUrl: string) => void;
  locked?: boolean;
}

export default function PhotoUpload({ label, sublabel, photoDataUrl, onUpload, locked = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onUpload(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="mono-label text-xs text-op-off-white">{label}</span>
        <span className="text-[11px] text-op-off-white-dim">{sublabel}</span>
      </div>
      <button
        type="button"
        disabled={locked}
        onClick={() => inputRef.current?.click()}
        className={`aspect-[3/4] w-full border border-dashed flex items-center justify-center overflow-hidden bg-op-charcoal ${
          locked ? "border-op-line/50 cursor-not-allowed opacity-50" : "border-op-line hover:border-op-orange"
        }`}
      >
        {photoDataUrl ? (
          <img src={photoDataUrl} alt={label} className="w-full h-full object-cover" />
        ) : (
          <span className="mono-label text-xs text-op-off-white-dim text-center px-4">
            {locked ? "Locked until this day" : "Tap to upload"}
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
