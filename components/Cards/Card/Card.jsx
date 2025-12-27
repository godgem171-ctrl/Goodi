"use client"
import Image from "next/image"
import styles from "./Card.module.css"
import Link from "next/link"
import { getLanguageCode } from "@/utils/SmallPrograms"
import { motion } from "framer-motion"

const Card = ({ data, index, loading, hidden, type }) => {

  if (hidden) {
    return <div
      className={`aspect-[9/14] mb-2 bg-[#1c1b2000]`}
    ></div>
  }

  const listItem = {
    hidden: { scale: 0 },
    show: { scale: 1 }
  };


  if (loading) {
    return <div
      className={`${styles.bounce} aspect-[9/14] rounded-2xl cursor-pointer mb-2 bg-[#22212c]`}
      style={{ animationDelay: `${index * 0.02 + 0.1}s` }}
    ></div>
  }

  return (
    <motion.div className="aspect-[9/14] rounded-2xl cursor-pointer mb-2 relative" variants={listItem}>
      <Link href={`/watch/${data?.id}?media_type=${data?.media_type || type || "movie"}`} className={`${styles.wrapper}`}>
        <Image
          src={data?.poster_path ? `https://image.tmdb.org/t/p/w500${data?.poster_path}` : `https://s4.anilist.co/file/anilistcdn/character/large/default.jpg`}
          alt="Trending"
          width={200}
          height={280}
          className="object-cover w-full h-full rounded-2xl cursor-pointer aspect-[4/6] pointer-events-none"
        />

        <div className={`${styles.info} bottom-2 left-0 right-0 absolute text-xs font-medium flex flex-wrap items-center justify-center gap-[.3rem] z-[7] opacity-0`}>
          <span className="uppercase text-slate-200">
            {data?.media_type ?
              ((data?.media_type || '').length > 2 ? (data?.media_type?.charAt(0)?.toUpperCase() + data?.media_type?.slice(1)?.toLowerCase()) : (data?.media_type || '').toUpperCase()) :
              type === "tv" ? (data?.first_air_date || '').slice(0, 4) : (data?.release_date || '').slice(0, 4)
            }
          </span>
          <span className="text-[10px]">•</span>
          <span className="font-medium text-green-400">{getLanguageCode(data?.original_language) || data?.original_language}</span>
          <span className="text-[10px]">•</span>
          <span className="text-slate-200">{data?.vote_average}</span>
        </div>

      </Link>

      <div className="text-[#efebebf2] font-['Poppins'] font-medium text-[14px] mt-2 text-center line-clamp-2 text-ellipsis overflow-hidden mx-3">{data?.title || data?.name || data?.original_name || data?.original_title}</div>

    </motion.div>
  )
}

export default Card
