import Image from 'next/image';

export default function Card() {
  return (
    <div className="w-full sm:w-56 md:w-1/4 lg:w-1/5 xl:w-1/6 max-w-xs mx-auto h-auto bg-black p-2 rounded-2xl overflow-hidden shadow-md transition-all hover:shadow-lg">
      <div className="relative w-full h-0" style={{ paddingBottom: '100%' /* Reduced height for portrait aspect ratio */ }}>
        <Image
          src="/people1.jpg" // Replace with your image path
          alt="Image description"
          layout="fill"
          objectFit="cover"
          priority
          className="rounded-t-2xl"
        />
      </div>
      <div className="p-3 bg-white rounded-2xl flex flex-col items-center">
        <h2 className="text-lg font-semibold">Mia</h2>
        <p className="text-gray-600 text-sm">CEO</p>
      </div>
    </div>
  );
}
