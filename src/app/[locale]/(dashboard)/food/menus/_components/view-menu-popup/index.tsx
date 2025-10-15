"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HiStar } from "react-icons/hi";
import FoodMenuInterface from "@/interfaces/food-menu.interface";
import { useRef, useState } from "react";
import generatePDF from "react-to-pdf";
import { Badge } from "@/components/ui/badge";
import { RALF_PDFTemplates_Menu } from "@/components/pdf-templates/ralf-pdf-template";
import { IoPrint } from "react-icons/io5";

interface Props {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  data: FoodMenuInterface | null;
}

export default function ViewFoodMenuPopup({ data, open, setOpen }: Props) {
  // generating pdf loading state
  const [generateLoading, setGenerateLoading] = useState(false);
  // target div to be printed
  const targetRef = useRef(null);

  // Print PDF
  const handlePrintPDF = async () => {
    // set the loading
    setGenerateLoading(true);
    // Print the menu as PDF
    await generatePDF(targetRef, {
      filename: (data?.name || "document") + ".pdf",
      resolution: 3,
      method: "open",
      page: {
        format: "A4",
        margin: 0,
        orientation: "portrait",
      },
      overrides: {
        pdf: {
          unit: "mm",
          format: "A4",
          orientation: "portrait",
          compress: true,
        },
        canvas: {
          useCORS: true,
        },
      },
    });

    // set the loading
    setGenerateLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
        className="max-w-full lg:w-[54em] min-h-[32em] max-h-[35em] overflow-hidden"
      >
        {" "}
        {/* PDF Template */}
        {data ? <RALF_PDFTemplates_Menu ref={targetRef} menu={data} /> : null}
        <div className="w-full h-full flex flex-col gap-4 justify-between">
          <DialogHeader>
            <DialogTitle>View Menu</DialogTitle>
          </DialogHeader>

          {/*  */}
          <div className="w-full h-full">
            <div className="w-full max-h-[24em] overflow-hidden overflow-y-auto">
              {/* Menu Title */}
              <div className="w-full h-[10em] overflow-hidden rounded-lg">
                <div className="w-full h-full bg-[url('/menu-banner.jpg')] bg-center bg-cover">
                  <div className="w-full h-full flex justify-center items-center bg-primary/20 backdrop-blur-sm rounded-lg">
                    <h4 className="text-2xl lg:text-3xl uppercase font-semibold text-white line-clamp-1">
                      {data?.name}
                    </h4>
                  </div>
                </div>
              </div>
              {/* Menu Sections */}
              <div className="mt-4">
                <p className="text-base text-accent-foreground font-medium mb-2">
                  Sections
                </p>

                {/* Sections wrapping */}
                <div className="w-full flex flex-col gap-4">
                  {data?.sections.map((sec) => (
                    <div className="flex flex-col items-center rounded-md border overflow-hidden">
                      <div className="w-full flex gap-1 items-center p-2 border-b bg-muted">
                        <div>
                          <h5 className="text-foreground/80 font-semibold">
                            {sec.title}
                          </h5>
                          <p className="text-sm line-clamp-1 text-muted-foreground">
                            {sec.description}
                          </p>
                        </div>
                      </div>
                      <div className="w-full p-2">
                        <div className="w-full flex items-center flex-wrap gap-2 mt-1">
                          {sec.dishes.map((dish) => (
                            <Badge
                              key={dish.id}
                              variant="outline"
                              className="relative rounded-full gap-2 text-sm font-normal"
                            >
                              <img
                                src={dish.image}
                                alt={sec.title}
                                width={20}
                                height={20}
                                loading="lazy"
                                className="-ml-1.5 size-10 border rounded-full object-cover bg-muted/50"
                              />
                              {dish.name}
                              {sec.featured_dish == dish.id ? (
                                <HiStar className="absolute size-[1.5rem] -top-1 -right-1 text-yellow-500 " />
                              ) : null}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* the footer */}
          <DialogFooter className="justify-between gap-2">
            <Button
              onClick={handlePrintPDF}
              disabled={generateLoading}
              isLoading={generateLoading}
              className="w-full gap-2"
            >
              Download And Print Menu
              <IoPrint className="size-[18px]" />
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
