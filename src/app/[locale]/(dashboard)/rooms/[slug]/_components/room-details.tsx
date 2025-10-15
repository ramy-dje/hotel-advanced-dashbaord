import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format } from "date-fns";
import RoomInterface from "@/interfaces/room.interface";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { IoResize } from "react-icons/io5";
import { FaChildren } from "react-icons/fa6";
import { HiOutlineCode, HiUsers } from "react-icons/hi";
import ImagePreview from "@/components/select-images-dialog/image-preview";
import { FileDetails } from "@/interfaces/file-manager";
// The room Show

interface Props {
  room: RoomInterface;
}

export default function RoomShow({ room }: Props) {
  return (
    <div className="w-full flex items-start flex-col md:flex-row gap-4 justify-between">
      {/* images part */}
      <section className="w-full md:w-1/2 grid gap-5 grid-cols-2">
        {/* the main image */}
        <div className="col-span-full flex justify-center">
          <div className="w-full bg-muted rounded-md overflow-hidden">
            <Image
              src={(room.images_main as FileDetails).presignedUrl || ""}
              width={500}
              height={250}
              alt={(room.images_main as FileDetails).originalname}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* gallery */}
        {room.images_gallery.map((e) => (
          <div
            className="col-span-1 bg-muted rounded-md overflow-hidden"
            key={e.id}
          >
            <ImagePreview
              name={e.originalname}
              url={e.presignedUrl}
              width={300}
              height={150}
              alt={e.originalname}
              className="w-full "
            />
          </div>
        ))}
      </section>

      <section className="w-full p-1 md:w-1/2 flex flex-col">
        {/* main info section */}
        <div className="w-full pb-6">
          <h1 className="text-2xl font-extrabold text-foreground mb-2">
            {room.title}
          </h1>
          <div className="flex gap-2 mb-2">
            <p className="text-base text-muted-foreground ">
              {room.category.name}
            </p>
            {/* code */}
            <Badge
              className="gap-1 text-xs py-0.5 px-2 rounded-full"
              variant="outline"
            >
              <HiOutlineCode className="size-4" />
              {room.code}
            </Badge>
            {/* size */}
            <Badge
              className="gap-1 text-xs py-0.5 px-2 rounded-full"
              variant="outline"
            >
              <IoResize className="size-4" />
              {room.size} M<sup>2</sup>
            </Badge>
          </div>
          <p
            className="text-sm !text-foreground/90 [&_ul]:pl-4 [&_ul]:pt-2 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1 [&_ul>li]:list-disc"
            dangerouslySetInnerHTML={{ __html: room.description }}
          ></p>
        </div>
        {/* border-b border-border */}
        <div className="border-b border-border" />
        {/* pricing */}
        <div className="">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="pricing" className="py-4">
              <AccordionTrigger className="text-lg">Pricing</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2">
                <p className="text-base">
                  Default Price :{" "}
                  <Badge variant="outline" className="py-0.5 px-2 text-base">
                    {room.default_price || 0}DA
                  </Badge>{" "}
                </p>
                {room.price.map((price) => (
                  <p
                    className="text-base flex items-center gap-2 text-gray-800 dark:text-gray-100"
                    key={`room-price-${price.from}-${price.to}`}
                  >
                    From{" "}
                    <span className="text-primary font-semibold">
                      {format(price.from, "LLL dd, y")}
                    </span>{" "}
                    To{" "}
                    <span className="text-primary font-semibold">
                      {format(price.to, "LLL dd, y")}
                    </span>
                    {" : "}
                    <Badge variant="outline" className="py-0.5 px-2 text-base">
                      {price.price}DA
                    </Badge>
                  </p>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        {/* floors */}
        <div className="">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="floors" className="py-4">
              <AccordionTrigger className="text-lg">Floors</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2">
                {room.floors.map((floor) => (
                  <p
                    className="text-base flex items-center gap-2 text-gray-500 dark:text-gray-100"
                    key={`room-floor-${floor.id}`}
                  >
                    <Badge
                      variant="default"
                      className="py-0.5 px-2 text-sm hover:bg-primary"
                    >
                      {floor.name}
                    </Badge>
                    {" From "}
                    <span className="text-primary font-semibold">
                      {floor.range_start}
                    </span>
                    {" To "}
                    <span className="text-primary font-semibold">
                      {floor.range_end}
                    </span>
                  </p>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        {/* capacity */}
        <div className="">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="capacity" className="py-4">
              <AccordionTrigger className="text-lg">Capacity</AccordionTrigger>
              <AccordionContent className="flex items-center gap-2">
                <Badge className="min-w-max text-sm gap-2 font-normal py-0.5 px-3 rounded-full">
                  <HiUsers className="size-5" />
                  {room.capacity.adults} Adults
                </Badge>
                <Badge className="min-w-max text-sm gap-2 py-0.5 font-normal px-3 rounded-full">
                  <FaChildren className="size-5" />
                  {room.capacity.children} Child
                </Badge>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        {/* Beds */}
        <div className="">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="beds" className="py-4">
              <AccordionTrigger className="text-lg">Beds</AccordionTrigger>
              <AccordionContent className="w-full flex items-center flex-wrap gap-2">
                {room.beds.map((bed) => (
                  <Badge
                    className="min-w-max text-sm py-0.5 font-normal px-3 rounded-full"
                    key={`room-bed-${bed.id}`}
                  >
                    {bed.name}
                  </Badge>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        {/* Features */}
        <div className="">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="Features" className="py-4">
              <AccordionTrigger className="text-lg">Features</AccordionTrigger>
              <AccordionContent className="flex items-center flex-wrap gap-2">
                {room.features.map((feature) => (
                  <Badge
                    className="min-w-max text-sm py-0.5 font-normal px-3 rounded-full"
                    key={`room-feature-${feature.id}`}
                  >
                    {feature.name}
                  </Badge>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        {/* Includes */}
        <div className="">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="includes" className="py-4">
              <AccordionTrigger className="text-lg">Includes</AccordionTrigger>
              <AccordionContent className="w-full flex items-center flex-wrap gap-2">
                {room.includes.map((include) => (
                  <Badge
                    className="min-w-max text-sm py-0.5 font-normal px-3 rounded-full"
                    key={`room-include-${include.id}`}
                  >
                    {include.name}
                  </Badge>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        {/* Types */}
        <div className="">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="Types" className="py-4">
              <AccordionTrigger className="text-lg">Types</AccordionTrigger>
              <AccordionContent className="flex items-center flex-wrap gap-2">
                {room.types.map((type) => (
                  <Badge
                    className="min-w-max text-sm py-0.5 font-normal px-3 rounded-full"
                    key={`room-type-${type.id}`}
                  >
                    {type.name}
                  </Badge>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        {/* Extra services */}
        <div className="">
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="extra-services" className="py-4">
              <AccordionTrigger className="text-lg">
                Extra Services
              </AccordionTrigger>
              <AccordionContent className="flex items-center flex-wrap gap-2">
                {room.extra_services.map((service) => (
                  <Badge
                    className="min-w-max text-sm py-0.5 font-normal px-3 rounded-full"
                    key={`room-service-${service.id}`}
                  >
                    {service.name} ({service.price} DA)
                  </Badge>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}
