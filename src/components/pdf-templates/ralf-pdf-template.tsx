import "./template.css";
import FoodMenuInterface from "@/interfaces/food-menu.interface";
import { forwardRef } from "react";
import PDFContainer, { PDFContainerPage } from "../pdf-container";
import { cn } from "@/lib/utils";
import { Libre_Caslon_Text, Raleway } from "next/font/google";

const LibreCaslonFont = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const RalewayFont = Raleway({
  subsets: ["latin"],
  display: "swap",
});

// The RALF PDF Template Component

interface Props {
  menu: FoodMenuInterface;
}

export const RALF_PDFTemplates_Menu = forwardRef<any, Props>(
  ({ menu }, ref) => {
    //
    return (
      <PDFContainer ref={ref} className="bg-white">
        {/* Menu Banner Header Page  */}
        <PDFContainerPage lastPage={false}>
          <div className="relative w-full h-full flex justify-center px-8">
            <h1
              style={{
                fontFamily: LibreCaslonFont.style.fontFamily,
              }}
              className="text-[90px] uppercase text-center line-clamp-4 mt-[38%] text-black "
            >
              {menu.name}
            </h1>
            <img
              width={200}
              height={180}
              src="/ralf.png"
              className="absolute w-[10em] bottom-8 left-1/2 -translate-x-1/2"
            />
          </div>
        </PDFContainerPage>
        {/* Sections */}

        {/* Looping sections as pages */}
        {menu.sections?.map((section, idx, arr) => (
          <PDFContainerPage
            key={section.title}
            lastPage={idx == arr.length - 1}
            className="py-[52px] px-14 flex flex-col justify-between"
          >
            {/* section container */}

            {/* content part */}
            <div className="w-full">
              {/* Section Header */}
              {/* header (title ,subTitle , notes) */}
              <div className="w-full flex items-start justify-between gap-2 mb-8">
                {/* title,subTitle */}
                <div className="flex flex-col gap-4">
                  <h2
                    style={{
                      fontFamily: LibreCaslonFont.style.fontFamily,
                    }}
                    className="text-4xl leading-5 text-black font-normal"
                  >
                    {section.title}
                  </h2>
                  <h3
                    style={{
                      fontFamily: RalewayFont.style.fontFamily,
                    }}
                    className="text-xl text-black font-normal"
                  >
                    {section.sub_title}
                  </h3>
                </div>
                {/* notes */}
                <div className="max-w-[20em]">
                  <p
                    style={{
                      fontFamily: RalewayFont.style.fontFamily,
                    }}
                    className="text-xs text-black font-normal italic"
                  >
                    {section?.notes?.join(" | ")}
                  </p>
                </div>
              </div>

              {/* Section Content */}
              <div className="w-full flex flex-col gap-12">
                {/* dishes */}
                {section.dishes.map((dish) => (
                  <div
                    key={dish.id}
                    className={cn(
                      "block relative w-full",
                      section.featured_dish == dish.id && "pl-4"
                    )}
                  >
                    {section.featured_dish == dish.id ? (
                      <div className="absolute left-0 top-0 h-[calc(100%+2em)] w-1 bg-black" />
                    ) : null}
                    {/* dish (title ,price) */}
                    <div className="flex gap-2 items-center mb-2">
                      {/* title */}
                      <h3
                        style={{
                          fontFamily: LibreCaslonFont.style.fontFamily,
                        }}
                        className="text-xl leading-normal text-black font-semibold min-w-max"
                      >
                        {dish.name}
                      </h3>
                      <div className="food-menu-lines translate-y-4 w-full h-1" />
                      {/* price */}
                      <span
                        style={{
                          fontFamily: LibreCaslonFont.style.fontFamily,
                        }}
                        className="text-lg leading-normal text-black min-w-max"
                      >
                        DA{dish.price}
                      </span>
                    </div>
                    {/* ingredients */}
                    <div
                      style={{
                        fontFamily: RalewayFont.style.fontFamily,
                      }}
                      className="w-full"
                    >
                      <p className="text-base text-wrap text-black">
                        {dish.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* descriptions part */}
            <div className="w-full flex justify-center">
              <p
                style={{
                  fontFamily: RalewayFont.style.fontFamily,
                }}
                className="text-center text-base text-black font-normal"
              >
                {section.description}
              </p>
            </div>
          </PDFContainerPage>
        ))}
      </PDFContainer>
    );
  }
);
