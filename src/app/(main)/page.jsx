import { Banner } from "@/components/banner/Banner";
import { CustomInput } from "../../components/ui/CustomInput/CustomInput";
import Link from "next/link";
import Features from "@/components/features/Features";
import { Recommendations } from "@/components/recomendation/Recommendations";
import { News } from "@/components/News/News";
import '../globals.css'
import CorporateBlock from "@/components/solution/CorporateBlock";
import CatalogButton from "@/components/catalogbutton/CatalogButton";
import FloatingButton from "@/components/handlClick/HandleClick";
export default function Home() {
  return (
    <div className="">
      <FloatingButton/>
      <Banner/>
      <Features/>
      <CatalogButton/>
      <Recommendations/>
      <News/>
      {/* <CorporateBlock/> */}
    </div>
  );
}
