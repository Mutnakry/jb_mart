function BackgroundArrow() {
  return (
    <div className="flex animate-fade-up animate-duration-2000 animate-ease-in-out">
      <div
        className="w-0 h-0 
            border-l-[11px] border-l-transparent
            border-t-[15px] border-t-white
            border-r-[11px] border-r-transparent"
      ></div>
    </div>
  );
}

function BackgroundArrowsLoop() {
  const arrows = Array.from({ length: 47 });

  return (
    <div className="flex ">
      {arrows.map((_, index) => (
        <BackgroundArrow key={index} />
      ))}
    </div>
  );
}

export default BackgroundArrowsLoop;
