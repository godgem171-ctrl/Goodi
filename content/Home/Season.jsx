import Card from "@/components/Cards/Card/Card";

const TopRated = ({ data }) => {
  console.log('TopRated render - results length:', (data?.results || []).length);

  return (
    <div className="w-full max-w-[96rem] relative bottom-28 mx-5 mt-12">
      <h1 className="text-[#ffffffbd] font-medium text-2xl font-['poppins']">| Top Rated Movies</h1>

      <div className="mt-8 grid grid-auto-fit gap-3">
        {data?.results?.map((item, index) => <Card data={item} key={index} />)}
      </div>

    </div>
  )
}

export default TopRated