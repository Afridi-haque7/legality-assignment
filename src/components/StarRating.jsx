function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1 text-sm">
      {/* Yellow stars are clipped to the rating's width over gray ones, so 4.5 shows half a star */}
      <div
        role="img"
        aria-label={`Rated ${rating.toFixed(1)} out of 5`}
        className="relative text-base leading-none text-gray-300"
      >
        ★★★★★
        <div
          className="absolute left-0 top-0 overflow-hidden whitespace-nowrap text-yellow-400"
          style={{ width: `${(rating / 5) * 100}%` }}
        >
          ★★★★★
        </div>
      </div>
      <span className="text-gray-600">({rating.toFixed(1)})</span>
    </div>
  );
}

export default StarRating;
