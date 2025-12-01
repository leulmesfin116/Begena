// Short: If `FaSearch` isn't visible it's usually because it's not imported where used or its color matches the background (use text-white).
import podcast from "../assets/podcast.jpeg";
import newSong from "../assets/newSong.jpeg";
import playlist from "../assets/playlist.jpeg";
import Lofi from "../assets/Lofi.jpeg";
export function Home() {
  return (
    <>
      <div className="center m-10">
        <h1 className="font-bold text-6xl ">BEGENA</h1>
        <p className="text-2xl">christian song streaming website</p>
        {/* first catagory */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h2 className="font-bold text-2xl cenetr-">Artists</h2>
        </div>
        <div className=" card animate ">
          <img className="image" src={newSong} alt="new song" />
          <div className="">
            <h2 className="font-bold">new songs</h2>
            <p>plays recently released songs of this week.</p>
          </div>
          {/* second catagory */}
        </div>
        <div className=" card animate">
          <img className="image" src={podcast} alt="podcast" />
          {/* the text */}
          <div>
            <h2 className="font-bold">Podcast</h2>
            <p>
              stream,discover,connetct - your world of podcast, all in one
              place.
            </p>
          </div>
        </div>
        <div className=" card animate">
          <img className="image" src={playlist} alt="playlist" />
          <div>
            <h2 className="font-bold">Your playlist</h2>
            <p>Hear your most and recently played songs.</p>
          </div>
        </div>
        {/* the 4th div */}
        <div className="card animate">
          <img className="image" src={Lofi} alt="Lo-fi" />
          <div>
            <h2 className="font-bold">lofi</h2>
            <p>
              Unwind with soothing Christian lo-fi. Peaceful beats to inspire
              your soul. Focus, reflect, and find your calm in every note.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
