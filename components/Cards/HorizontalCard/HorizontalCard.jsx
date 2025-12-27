import { Totalgenres } from "@/utils/Genres";
import Image from "next/image"
import Link from "next/link";
import { IoLayers } from "react-icons/io5";

const HorizontalCard = ({ data, type }) => {
  const languageMap = {
    en: "English",
    ja: "Japanese",
    id: "Indonesia",
    fr: "France"
  };

  return (
    <div
      className="bg-[#242735] border-[1px] border-[#39374b] flex w-full h-full overflow-hidden rounded-md relative items-center">

      <Link href={`/watch/${data?.id}?media_type=${type}`} >
        <Image
          src={`https://image.tmdb.org/t/p/w94_and_h141_face${data?.backdrop_path}`}
          alt="Recommendation"
          height={130}
          width={100}
          className={"object-cover h-[106px] w-[80px] cursor-pointer max-[420px]:w-[112px]"}
        />
      </Link>

      <div className="w-full h-full flex flex-col mx-2 my-2 max-w-[17rem] justify-center">

        <div className="flex flex-col gap-3">
          <Link href={`/watch/${data?.id}?media_type=${type}`} className="text-[#c4c7cc] text-[15px] font-medium overflow-hidden text-ellipsis line-clamp-2 hover:text-[#e4e5e8] transition-all cursor-pointer">{data?.title || data?.name || "A God like movie"}</Link>

          <div className="flex gap-[6px] text-[14px] text-[#c4c7ccce] items-center">
            <div className="flex items-center gap-1 font-medium overflow-hidden text-ellipsis line-clamp-1"> {((data?.media_type || '').length > 2 ? (data?.media_type?.charAt(0)?.toUpperCase() + data?.media_type?.slice(1).toLowerCase()) : (data?.media_type || '').toUpperCase())}</div>
            <div className="h-1 w-1 bg-[#ffffff94] rounded-full"></div>
            <div className="flex items-center gap-1 font-medium overflow-hidden text-ellipsis line-clamp-1"><IoLayers /> {(data?.genre_ids && data.genre_ids[0]) ? Totalgenres.find(g => g.id === data?.genre_ids[0])?.name : 'N/A'}</div>
            <div className="h-1 w-1 bg-[#ffffff94] rounded-full"></div>
            <div className="flex items-center gap-1 font-medium overflow-hidden text-ellipsis line-clamp-1">{languageMap[data?.original_language] || data?.original_language}</div>
          </div>

        </div>

      </div>

    </div>
  )
}

export default HorizontalCard