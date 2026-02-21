// Short: If `FaSearch` isn't visible it's usually because it's not imported where used or its color matches the background (use text-white).
import podcast from "../assets/podcast.jpeg";
import newSong from "../assets/newSong.jpeg";
import playlist from "../assets/playlist.jpeg";
import Lofi from "../assets/Lofu.jpeg";
import recent from "../assets/recent.jpeg";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Favourite from "../assets/favourite.jpeg";
export function Home() {
  const navigate = useNavigate();
  // handing click events
  function handleClick() {
    navigate("/newMusic");
  }
  function handlePod() {
    navigate("/Podcast");
  }
  function handleList() {
    navigate("/Playlist");
  }
  function handleLofi() {
    navigate("/LofiMusic");
  }
  function handleRecent() {
    navigate("/Recent");
  }
  function handleFav() {
    navigate("Favourite");
  }
  return (
    <>
      <div className="center m-4 sm:m-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-bold text-4xl sm:text-6xl text-center"
        >
          BEGENA
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-2xl text-center mt-2"
        >
          christian song streaming website
        </motion.p>
        {/*--------------------------- first category-------------------------*/}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onClick={handleClick}
          className="card animate cursor-pointer"
        >
          <img className="image" src={newSong} alt="new song" />
          <div className="">
            <h2 className="font-bold text-lg sm:text-xl">new songs</h2>
            <p className="text-sm sm:text-base">
              plays recently released songs of this week.
            </p>
          </div>
          {/* ------------------second category--------------------- */}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          onClick={handlePod}
          className="card animate cursor-pointer"
        >
          <img className="image" src={podcast} alt="podcast" />
          {/* the text */}
          <div>
            <h2 className="font-bold text-lg sm:text-xl">Podcast</h2>
            <p className="text-sm sm:text-base">
              stream,discover,connect - your world of podcast, all in one place.
            </p>
          </div>
        </motion.div>
        {/*------------the third category-------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          onClick={handleList}
          className="card animate cursor-pointer"
        >
          <img className="image" src={playlist} alt="playlist" />
          <div>
            <h2 className="font-bold text-lg sm:text-xl">
              Create your playlist
            </h2>
            <p className="text-sm sm:text-base">
              Hear your favourite song from the playlist you created.
            </p>
          </div>
        </motion.div>
        {/*------------- the 4th div------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          onClick={handleLofi}
          className="card animate cursor-pointer sm:col-span-2 lg:col-span-1"
        >
          <img className="image" src={Lofi} alt="Lo-fi" />
          <div>
            <h2 className="font-bold text-lg sm:text-xl">lofi</h2>
            <p className="text-sm sm:text-base">
              Unwind with soothing Christian lo-fi. Peaceful beats to inspire
              your soul. Focus, reflect, and find your calm in every note.
            </p>
          </div>
        </motion.div>
        {/* ---------the 5th div----------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          onClick={handleRecent}
          className="card animate cursor-pointer sm:col-span-2 lg:col-span-1"
        >
          <img className="image" src={recent} alt="recent" />
          <div>
            <h2 className="font-bold text-lg sm:text-xl">
              Recently played Music
            </h2>
            <p className="text-sm sm:text-base">
              your recently played music are here.
            </p>
          </div>
        </motion.div>
        {/* -------the 6th div----------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          onClick={handleFav}
          className="card animate cursor-pointer sm:col-span-2 lg:col-span-1"
        >
          <img className="image" src={Favourite} alt="favourite" />
          <div>
            <h2 className="font-bold text-lg sm:text-xl">Favourite Music</h2>
            <p className="text-sm sm:text-base">
              your favourite songs are here
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
