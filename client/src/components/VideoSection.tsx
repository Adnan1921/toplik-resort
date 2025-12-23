import { useState } from "react";
import { Play } from "lucide-react";
import videoPlaceholder from "@/assets/video-placeholder.png";

const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Replace this with your actual YouTube video ID
  const videoId = "dQw4w9WgXcQ";

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <section className="relative w-full aspect-video max-h-[80vh]">
      {!isPlaying ? (
        <div className="relative w-full h-full">
          {/* Placeholder Image */}
          <img
            src={videoPlaceholder}
            alt="Toplik Village Resort aerial view"
            className="w-full h-full object-cover"
          />
          
          {/* Play Button Overlay */}
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center group"
            aria-label="Play video"
          >
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-white/80 flex items-center justify-center group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-lg">
              <Play className="w-8 h-8 lg:w-10 lg:h-10 text-primary ml-1" fill="currentColor" />
            </div>
          </button>
        </div>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title="Toplik Village Resort Video"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </section>
  );
};

export default VideoSection;
