"use client";
import {
  HiOutlineArchive,
  HiOutlineBriefcase,
  HiOutlineCalendar,
  HiOutlineCog,
  HiOutlineGlobe,
  HiOutlineHome,
  HiOutlineKey,
  HiOutlineNewspaper,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { PiCoffee, PiHamburger } from "react-icons/pi";
import { CgCoffee } from "react-icons/cg";
import { LiaBedSolid } from "react-icons/lia";
import SidebarItem from "./components/sidebar-item";
import {
  Accordion,
  AccordionItem,
  AccordionSidebarContent,
  AccordionSidebarTrigger,
} from "../ui/accordion";
import { BsBuildings } from "react-icons/bs";
import SidebarSubItem from "./components/sidebar-sub-item";
import { usePathname } from "@/i18n/routing";
import { useEffect, useState } from "react";
import logo_ralf_horizental from "../../app/logo_ralf_horizental.svg";
import Image from "next/image";
import { RiPictureInPictureExitFill } from "react-icons/ri";
import { Banknote, CreditCard, HandCoins } from "lucide-react";

interface Props {}

export default function DashboardSidebar({}: Props) {
  const pathname = usePathname();
  const [selectedItem, setSelectedItem] = useState<string>("");

  useEffect(() => {
    const selectedList = [];
    const path1 = pathname.split("/")[1] || "";
    const path2 = pathname.split("/")[2] || "";
    const path3 = pathname.split("/")[3] || "";

    if (path1.trim()) {
      selectedList.push(path1.trim());
      if (path2.trim()) {
        selectedList.push(path2.trim());
        if (path3.trim()) {
          selectedList.push(path3.trim());
        }
      }
      const res = selectedList.join("-");
      if (res) setSelectedItem(res);
    } else {
      setSelectedItem("");
    }
  }, [pathname]);

  return (
    <div className="group/sidebar w-full h-full bg-background">
      {/* logo */}
      <div className="sticky min-h-[80px] flex justify-start top-0 z-40 px-2 ml-2 py-4 md:py-5 lg:py-7 2xl:py-5">
        <Image alt="" src={logo_ralf_horizental} width={130} height={80} />
      </div>

      {/* list */}
      <div className="h-full pb-10 pr-1 bg-white dark:bg-muted/20 border-r border-border lg:border-none lg:shadow-none shadow-sm rounded-lg lg:rounded-none">
        <div className="w-full h-full max-h-[calc(100%-80px)] overflow-y-auto lg:sidebar-scrollbar sm-scrollbar">
          <div className="mt-4 pb-3 3xl:mt-6">
            <ul className="flex flex-col gap-1 px-2 ml-1">
              <SidebarItem
                selected={selectedItem == ""}
                url="/"
                Icon={HiOutlineHome}
              >
                Home
              </SidebarItem>

              <Accordion type="multiple">
                {/* Catalog */}
                <AccordionItem value="properties" className="border-none">
                  <AccordionSidebarTrigger
                    selected={selectedItem.split("-")[0] == "properties"}
                    Icon={BsBuildings}
                  >
                    Catalog
                  </AccordionSidebarTrigger>
                  <AccordionSidebarContent>
                    <SidebarSubItem
                      selected={selectedItem == "property-details"}
                      url="/property"
                    >
                      Properties
                    </SidebarSubItem>
                    <SidebarSubItem
                      selected={selectedItem == "blogs-categories"}
                      url="/property"
                    >
                      Facilities
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        Soon
                      </span>
                    </SidebarSubItem>
                    <SidebarSubItem
                      selected={selectedItem == "blogs-tags"}
                      url="/property/features"
                    >
                      House Features
                    </SidebarSubItem>
                  </AccordionSidebarContent>
                </AccordionItem>

                {/* Accommodations */}
                <AccordionItem value="rooms" className="border-none">
                  <AccordionSidebarTrigger
                    selected={selectedItem.split("-")[0] == "rooms"}
                    Icon={LiaBedSolid}
                  >
                    Accommodations
                  </AccordionSidebarTrigger>
                  <AccordionSidebarContent>
                    <SidebarSubItem
                      selected={selectedItem == "rooms"}
                      url="/rooms"
                    >
                      Rooms
                    </SidebarSubItem>
                    <SidebarSubItem
                      selected={selectedItem == "apartments"}
                      url="/apartments"
                    >
                      Apartments
                    </SidebarSubItem>
                    <SidebarSubItem
                      selected={selectedItem == "room-details-room-categories"}
                      url="/room-details/room-categories"
                    >
                      Room Categories
                    </SidebarSubItem>
                    <SidebarSubItem
                      selected={selectedItem == "room-details-room-features"}
                      url="/room-details/room-features"
                    >
                      Room Features
                    </SidebarSubItem>
                    <SidebarSubItem
                      selected={selectedItem == "room-details-room-types"}
                      url="/room-details/room-types"
                    >
                      Room Types
                    </SidebarSubItem>
                    <SidebarSubItem
                      selected={selectedItem == "room-details-room-beds"}
                      url="/room-details/room-beds"
                    >
                      Room Beds
                    </SidebarSubItem>
                    <SidebarSubItem
                      selected={selectedItem == "room-details-room-includes"}
                      url="/room-details/room-includes"
                    >
                      Room Includes
                    </SidebarSubItem>
                    <SidebarSubItem
                      selected={selectedItem == "rooms-deleted"}
                      url="/rooms/deleted"
                    >
                      Deleted Rooms
                    </SidebarSubItem>
                  </AccordionSidebarContent>
                </AccordionItem>

                {/* Services */}
                <SidebarItem
                  selected={selectedItem == "room-details-room-extra-services"}
                  url="/room-details/room-extra-services"
                  Icon={HiOutlineArchive}
                >
                  Services
                </SidebarItem>

                {/* Booking */}
                <AccordionItem value="reservations" className="border-none">
                  <AccordionSidebarTrigger
                    selected={selectedItem.split("-")[0] == "reservations"}
                    Icon={HiOutlineCalendar}
                  >
                    Booking
                  </AccordionSidebarTrigger>
                  <AccordionSidebarContent>
                    <SidebarSubItem
                      selected={selectedItem == "reservations-overview"}
                      url="/reservations/overview"
                    >
                      Overview
                    </SidebarSubItem>
                    <SidebarSubItem
                      selected={selectedItem == "reservations"}
                      url="/reservations"
                    >
                      All Bookings
                    </SidebarSubItem>
                    <SidebarSubItem
                      selected={selectedItem == "reservations-pending"}
                      url="/reservations/pending"
                    >
                      Processing
                    </SidebarSubItem>
                    <SidebarSubItem
                      selected={selectedItem == "reservations-checked-in"}
                      url="/reservations/checked-in"
                    >
                      Checked In
                    </SidebarSubItem>
                    <SidebarSubItem
                      selected={selectedItem == "reservations-diparted"}
                      url="/reservations/diparted"
                    >
                      Departers
                    </SidebarSubItem>
                    <SidebarSubItem
                      selected={selectedItem == "reservations-approved"}
                      url="/reservations/approved"
                    >
                      Approved
                    </SidebarSubItem>
                    <SidebarSubItem
                      selected={selectedItem == "reservations-canceled"}
                      url="/reservations/canceled"
                    >
                      Canceled
                    </SidebarSubItem>
                    <SidebarSubItem
                      selected={selectedItem == "reservations-archived"}
                      url="/reservations/archived"
                    >
                      Archived
                    </SidebarSubItem>
                  </AccordionSidebarContent>
                </AccordionItem>

                {/* CRM */}
                <AccordionItem value="crm" className="border-none">
                  <AccordionSidebarTrigger
                    selected={selectedItem.split("-")[0] == "crm"}
                    Icon={HiOutlineUserGroup}
                  >
                    CRM
                  </AccordionSidebarTrigger>
                  <AccordionSidebarContent>
                    <SidebarSubItem
                      selected={selectedItem == "crm-overview"}
                      url="/crm/overview"
                    >
                      Overview
                    </SidebarSubItem>
                    <SidebarSubItem
                      selected={selectedItem == "crm-contacts"}
                      url="/crm/contacts"
                    >
                      Contacts
                    </SidebarSubItem>
                    <SidebarSubItem
                      selected={selectedItem == "crm-companies"}
                      url="/crm/companies"
                    >
                      Companies
                    </SidebarSubItem>
                  </AccordionSidebarContent>
                </AccordionItem>

                {/* Jobs */}
                <AccordionItem value="jobs" className="border-none">
                  <AccordionSidebarTrigger
                    selected={selectedItem.split("-")[0] == "jobs"}
                    Icon={HiOutlineBriefcase}
                  >
                    Jobs
                  </AccordionSidebarTrigger>
                  <AccordionSidebarContent>
                    <SidebarSubItem
                      selected={selectedItem == "jobs-submissions"}
                      url="/jobs/submissions"
                    >
                      Submissions
                    </SidebarSubItem>
                    <SidebarSubItem
                      selected={selectedItem == "jobs-positions"}
                      url="/jobs/positions"
                    >
                      Positions
                    </SidebarSubItem>
                    <SidebarSubItem
                      selected={selectedItem == "jobs-departments"}
                      url="/jobs/departments"
                    >
                      Departments
                    </SidebarSubItem>
                  </AccordionSidebarContent>
                </AccordionItem>

                {/* Blog */}
                <AccordionItem value="blogs" className="border-none">
                  <AccordionSidebarTrigger
                    selected={selectedItem.split("-")[0] == "blogs"}
                    Icon={HiOutlineNewspaper}
                  >
                    Blog
                  </AccordionSidebarTrigger>
                  <AccordionSidebarContent>
                    <SidebarSubItem
                      selected={selectedItem == "blogs"}
                      url="/blogs"
                    >
                      Posts
                    </SidebarSubItem>
                    <SidebarSubItem
                      selected={selectedItem == "blogs-categories"}
                      url="/blogs/categories"
                    >
                      Categories
                    </SidebarSubItem>
                    <SidebarSubItem
                      selected={selectedItem == "blogs-tags"}
                      url="/blogs/tags"
                    >
                      Tags
                    </SidebarSubItem>
                  </AccordionSidebarContent>
                </AccordionItem>
                {/* Rate */}
                {/* render the rate item if the user has the needed permissions */}
                <AccordionItem value="rate" className="border-none relative">
                  <AccordionSidebarTrigger
                    selected={
                      selectedItem.split("-")[0] == "rate" ||
                      selectedItem.split("-")[0] == "session"
                    }
                    Icon={HandCoins}
                  >
                    Rates
                  </AccordionSidebarTrigger>
                  <AccordionSidebarContent
                  >
                    {/* render the rate item if the user has the needed permissions */}

                    <SidebarSubItem
                      selected={selectedItem == "rate"}
                      url="/rate/overview"
                    >
                      Rates
                    </SidebarSubItem>

                    {/* render the offers item if the user has the needed permissions */}

                    <SidebarSubItem
                      selected={selectedItem == "offers"}
                      url="/rate/offers"
                    >
                      Deals and Offers
                    </SidebarSubItem>

                    {/* render the seasons item if the user has the needed permissions */}

                    <SidebarSubItem
                      selected={selectedItem == "seasons"}
                      url="/rate/seasons"
                    >
                      Seasons
                    </SidebarSubItem>

                    {/* render the categories item if the user has the needed permissions */}

                    <SidebarSubItem
                      selected={selectedItem == "categories"}
                      url="/rate/categories"
                    >
                      Categories
                    </SidebarSubItem>
                  </AccordionSidebarContent>
                </AccordionItem>

                {/* Catering */}
                <AccordionItem value="restaurant" className="border-none">
                  <AccordionSidebarTrigger
                    selected={selectedItem.split("-")[0] == "food"}
                    Icon={CgCoffee}
                  >
                    Catering
                  </AccordionSidebarTrigger>
                  <AccordionSidebarContent>
                    <SidebarSubItem
                      selected={selectedItem == "food-dishes"}
                      url="/food/dishes"
                    >
                      Dishes
                    </SidebarSubItem>
                    <SidebarSubItem
                      selected={selectedItem == "food-menus"}
                      url="/food/menus"
                    >
                      Menus
                    </SidebarSubItem>
                    <SidebarSubItem
                      selected={selectedItem == "food-ingredients"}
                      url="/food/ingredients"
                    >
                      Ingredients
                    </SidebarSubItem>
                    <SidebarSubItem
                      selected={selectedItem == "food-types"}
                      url="/food/types"
                    >
                      Types
                    </SidebarSubItem>
                  </AccordionSidebarContent>
                </AccordionItem>

                {/* Users & Permissions */}
                <AccordionItem value="roles-users" className="border-none">
                  <AccordionSidebarTrigger
                    selected={
                      selectedItem.split("-")[0] == "users" ||
                      selectedItem.split("-")[0] == "roles"
                    }
                    Icon={HiOutlineKey}
                  >
                    Users & Permissions
                  </AccordionSidebarTrigger>
                  <AccordionSidebarContent>
                    <SidebarSubItem
                      selected={selectedItem == "users"}
                      url="/users"
                    >
                      Users
                    </SidebarSubItem>
                    <SidebarSubItem
                      selected={selectedItem == "roles"}
                      url="/roles"
                    >
                      Roles
                    </SidebarSubItem>
                  </AccordionSidebarContent>
                </AccordionItem>
              </Accordion>

              <SidebarItem
                selected={selectedItem == "destinations"}
                url="/destinations"
                Icon={HiOutlineGlobe}
              >
                Destinations
              </SidebarItem>
              <SidebarItem
                selected={selectedItem == "taxes"}
                url="/taxes"
                Icon={CreditCard}
              >
                Taxes
              </SidebarItem>
              <SidebarItem
                selected={selectedItem == "fees"}
                url="/fees"
                Icon={Banknote}
              >
                Fees
              </SidebarItem>

              <SidebarItem
                selected={selectedItem == "setting"}
                url="/setting"
                Icon={HiOutlineCog}
              >
                Setting
              </SidebarItem>

              <SidebarItem.Empty />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
