import { useAuth } from "../context/AuthContext";
import { getCurrentDay, savePhoto } from "../lib/storage";
import PhotoUpload from "../components/PhotoUpload";
import Card from "../components/Card";
import Badge from "../components/Badge";

export default function Photos() {
  const { user, setUser } = useAuth();
  if (!user) return null;

  const currentDay = getCurrentDay(user);

  const handleUpload = (slot: "day1" | "day14" | "day28", dataUrl: string) => {
    setUser(savePhoto(user, slot, dataUrl));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <span className="mono-label text-xs text-op-orange">Visual Log</span>
      <h1 className="font-display text-3xl sm:text-4xl text-op-off-white mt-2 mb-3">Progress Photos</h1>
      <div className="flex items-start gap-3 mb-10">
        <Badge tone="neutral">Private by default</Badge>
        <p className="text-sm text-op-off-white-dim">
          Photos are private to your account unless you choose to share them.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-12">
        <PhotoUpload
          label="Day 1"
          sublabel="Baseline"
          photoDataUrl={user.photos.day1}
          onUpload={(url) => handleUpload("day1", url)}
        />
        <PhotoUpload
          label="Day 14"
          sublabel="Midpoint"
          photoDataUrl={user.photos.day14}
          onUpload={(url) => handleUpload("day14", url)}
          locked={currentDay < 14}
        />
        <PhotoUpload
          label="Day 28"
          sublabel="Final"
          photoDataUrl={user.photos.day28}
          onUpload={(url) => handleUpload("day28", url)}
          locked={currentDay < 28}
        />
      </div>

      <h2 className="font-display text-2xl text-op-off-white mb-4">Side by Side</h2>
      <Card variant="panel" className="p-6">
        {user.photos.day1 && user.photos.day28 ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mono-label text-xs text-op-off-white-dim mb-2">Day 1</p>
              <img src={user.photos.day1} alt="Day 1" className="w-full aspect-[3/4] object-cover" />
            </div>
            <div>
              <p className="mono-label text-xs text-op-off-white-dim mb-2">Day 28</p>
              <img src={user.photos.day28} alt="Day 28" className="w-full aspect-[3/4] object-cover" />
            </div>
          </div>
        ) : (
          <p className="text-sm text-op-off-white-dim text-center py-10">
            Upload your Day 1 and Day 28 photos to see a side by side comparison here.
          </p>
        )}
      </Card>
    </div>
  );
}
