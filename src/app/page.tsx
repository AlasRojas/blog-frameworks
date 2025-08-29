import Link from "next/link";
import { CarouselHome } from "@/app/ui/CarrouselHome";

export default function Home() {
  return (
    <>
      <CarouselHome />
      <Link 
        href="/page?id=1"
        className="text-blue-500 hover:text-blue-700 underline"
      >
        Ir a Page
      </Link>
    </>
  );
}
