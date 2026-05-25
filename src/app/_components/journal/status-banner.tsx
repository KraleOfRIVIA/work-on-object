type StatusBannerProps = {
  status: string;
};

export function StatusBanner({ status }: StatusBannerProps) {
  if (!status) {
    return null;
  }

  return (
    <div className="border-b border-[#e4ded2] bg-[#f8f6f1] px-4 py-3 text-sm text-[#505348]">
      {status}
    </div>
  );
}
