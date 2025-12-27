"use client"
import { getSeason } from "@/utils/SmallPrograms"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

const MovieInfo = ({ info }) => {

  const media_type = info?.type || 'movie'

  return (
    <div className="text-white flex gap-6">
      <Image
        src={`https://image.tmdb.org/t/p/w500${info?.poster_path}`}
        alt="movieVerse Poster"
        width={215}
        height={300}
        className="rounded-2xl object-cover h-80 w-[16rem] max-[840px]:h-[14rem] max-[380px]:h-[9rem]"
      />
      <div className="mt-2">
        <h1 className="text-2xl font-['poppins'] font-medium max-[840px]:text-[22px] max-[380px]:text-[19px]">{info?.title || info?.name || ""}</h1>
        <div className="flex gap-2 mt-1 mb-2">
          <span className="bg-[#727587] text-[13px] px-1 rounded-[4px] text-slate-900 font-medium">HD</span>
          <span className="bg-[#727587] text-[13px] px-1 rounded-[4px] text-slate-900 font-medium">SD</span>
        </div>

        <p className="text-[15px] font-['poppins'] text-[#fff4f4b1] overflow-hidden text-ellipsis line-clamp-4 mb-2">{info?.overview}</p>

        <div className="flex gap-32 justify-between max-[960px]:flex-col max-[960px]:gap-0">
          <div>
            <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">Type: <Link target="_" href={`/`} className="text-[#e26bbcd9] cursor-pointer hover:text-[#ff3df9]">{media_type.length > 2 ? media_type?.charAt(0).toUpperCase() + media_type?.slice(1).toLowerCase() : media_type.toUpperCase()}</Link></div>
            <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">Country: <Link target="_" href={`/`} className="text-[#e26bbcd9] cursor-pointer hover:text-[#ff3df9]">{info?.origin_country?.[0] ?? 'N/A'}</Link></div>
            <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">Premiered: <Link target="_" href={`/`} className="text-[#e26bbcd9] cursor-pointer hover:text-[#ff3df9]">{info?.release_date ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(info?.release_date)) : 'N/A'}</Link></div>
            <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">Date aired: <Link href={`/year/${info?.seasonYear ?? (info?.release_date ? info.release_date.slice(0,4) : new Date().getFullYear())}`} className="text-[#e26bbcd9] cursor-pointer hover:text-[#ff3df9]">{info?.release_date ? info.release_date.slice(0, 4) : new Date().getFullYear()}</Link></div>
            <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">Season: <Link href={`/season/${info?.season ?? 1}`} className="text-[#e26bbcd9] cursor-pointer hover:text-[#ff3df9]">{getSeason(new Date(info?.release_date ?? Date.now()))}</Link></div>
            <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">Status: <Link target="_" href={`/catalog?airing=${info?.status}&sort=POPULARITY_DESC`} className="text-[#e26bbcd9] cursor-pointer hover:text-[#ff3df9]">{info?.status}</Link></div>
          </div>
          <div>
            <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">Genres: <span className="text-[#e26bbcd9]">{Array.isArray(info?.genres) && info.genres.length > 0 ? info.genres.map((item, index) => <Link key={item?.id || index} target="_" href={`/catalog?genres=%5B"${item?.name}"%5D&sort=POPULARITY_DESC`} className="cursor-pointer hover:text-[#ff3df9]">{item?.name}{info?.genres?.length - 1 === index ? null : ", "}</Link>) : 'N/A'}</span></div>
            <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">Episodes: <Link target="_" href={`/catalog?episodes=${info?.episodes}&sort=POPULARITY_DESC`} className="text-[#e26bbcd9] cursor-pointer hover:text-[#ff3df9]">{media_type === "movie" ? 1 : info?.number_of_episodes ? info?.number_of_episodes : 1}</Link></div>
            <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">Studios: <span className="text-[#e26bbcd9]"><Link href={`/`} className="cursor-pointer hover:text-[#ff3df9]">{info?.production_companies?.[0]?.name || 'N/A'}</Link></span></div>
            <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">Rating: <span className="text-[#e26bbcd9] cursor-pointer hover:text-[#ff3df9]">{info?.vote_average}</span></div>
            <div className="text-sm text-[#dadada] font-['poppins'] mt-[2px]">Budget: <span className="text-[#e26bbcd9] cursor-pointer hover:text-[#ff3df9]">{info?.budget ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(info?.budget) : "150 paisa"}</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieInfo