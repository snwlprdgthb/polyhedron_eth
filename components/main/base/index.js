import Link from "next/link";
import Image from "next/image";

export default function Main() {
  return (
    <div className="">
      <div className="w-full  bg-black text-white pt-32 md:pt-40 flex justify-center font-abeezee">
        <div className="flex grid grid-cols-1   w-2/3 sm:w-2/5 uppercase font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
          <div className="h-6 sm:h-8 md:h-10 lg:h-12 xl:h-14 justify-self-start">
            Semiregular
          </div>
          <div className="h-6 sm:h-8 md:h-10 lg:h-12 xl:h-14 justify-self-center ">
            Polyhedron
          </div>
          <div className="h-6 sm:h-8 md:h-10 lg:h-12 xl:h-14 justify-self-end">
            Marketplace
          </div>
          <div className="text-sm xl:text-md justify-self-end w-4/5 mt-5">
            SAY HELLO TO Catalan and Archimedean solid.THIS DAPP ENABLES THE BUY
            AND FULLY OWNERSHIP OF semiregular polytope throught to the ethereum
            blockchain and WEB3 Technology
          </div>
        </div>
      </div>

      <div className="animation-box mt-16 lg:mt-32">
        <div className="centered  w-1/3 md:w-2/4">
          <div className="blob-1"></div>
          <div className="blob-2"></div>
        </div>
      </div>

      <div className="flex  flex-col  text-lg items-center bg-black font-abeezee pt-20 md:pt-40">
        <Link href="/marketplace">
          <div className="cursor-pointer z-10 bg-white hover:bg-gray-200 text-black border rounded-md py-3 w-1/2 md:w-1/3 text-center">
            Just taste it
          </div>
        </Link>

        <div
          onClick={() =>
            window.open("https://github.com/snwlprdgthb", "_blank")
          }
          className="textHoverZinc cursor-pointer  py-3 mb-20 mt-2 border w-1/2 md:w-1/3 text-center rounded-md"
        >
          See more on Github
        </div>
      </div>

      <div className="flex flex-col text-sm text-white w-full lg:w-4/5 font-abeezee mb-10 lg:mb-20 lg:pt-20 p-5 lg:px-32">
        <div className="text-4xl font-bold">Core Concept of Polyhedron</div>
        <div className="my-7 text-lg md:text-xl w-5/6 md:w-4/6">
          In its original definition, it is a polyhedron with regular polygonal
          faces, and a symmetry group which is transitive on its vertices;
          today, this is more commonly referred to as a uniform polyhedron (this
          follows from Thorold Gossets 1900 definition of the more general
          semiregular polytope)
        </div>
        <div className="flex flex-col text-md md:text-lg sm:flex-row md:text-base">
          <div>
            These semiregular solids can be fully specified by a vertex
            configuration: a listing of the faces by number of sides, in order
            as they occur around a vertex.
          </div>
          <div className="mt-7 sm:mt-0 sm:ml-10">
            For example: 3.5.3.5 represents the icosidodecahedron, which
            alternates two triangles and two pentagons around each vertex. In
            contrast: 3.3.3.5 is a pentagonal antiprism. These polyhedra are
            sometimes described as vertex-transitive.
          </div>
        </div>
      </div>

      <div className="absolute custom">
        <Image width="3000" height="3000" layout="intrinsic" src="/eth.svg" />
      </div>
    </div>
  );
}
