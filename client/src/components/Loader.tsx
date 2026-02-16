const Loader = () => {
  return (
    <>
      <div className="min-h-[100vh] flex ">
        <div className="w-12 h-12 mx-auto place-self-center border-4 border-gray-300 border-t-4 border-t-amber-600 rounded-full animate-spin"></div>
      </div>
    </>
  );
};

export default Loader;

interface SkeletonProps {
  className?: string;
  flex?: string;
  length?: number;
}

export const Skeleton = ({
  className = "skeleton",
  flex = "flex",
  length = 3,
}: SkeletonProps) => {
  const skeletonItem = Array.from({ length }, (_, idx) => (
    <div key={idx} className={className}></div>
  ));
  return <div className={flex}>{skeletonItem}</div>;
};
