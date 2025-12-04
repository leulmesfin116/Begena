// Short: If `FaSearch` isn't visible it's usually because it's not imported where used or its color matches the background (use text-white).
import podcast from "../assets/podcast.jpeg";
import newSong from "../assets/newSong.jpeg";
import playlist from "../assets/playlist.jpeg";
import Lofi from "../assets/Lofi.jpeg";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
export function Home() {
  const navigate = useNavigate();
  // handing click events
  function handleClick() {
    navigate("/newMusic");
  }
  function handlePod() {
    navigate("/Podcast");
  }
  return (
    <>
      <div className="center m-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 3, y: 0 }}
          transition={{ duration: 3 }}
          className="font-bold text-6xl "
        >
          BEGENA
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 3, y: 0 }}
          transition={{ duration: 3 }}
          className="text-2xl"
        >
          christian song streaming website
        </motion.p>
        {/* first catagory */}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div onClick={handleClick} className=" card animate ">
          <img className="image" src={newSong} alt="new song" />
          <div className="">
            <h2 className="font-bold">new songs</h2>
            <p>plays recently released songs of this week.</p>
          </div>
          {/* second catagory */}
        </div>
        <div onClick={handlePod} className=" card animate">
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
