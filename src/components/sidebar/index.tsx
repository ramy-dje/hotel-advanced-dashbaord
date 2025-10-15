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
import { PiCoffee, PiHamburger } from "react-icons/pi"
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
import { IoFastFoodOutline } from "react-icons/io5";
import useAccess from "@/hooks/use-access";
import { RiPictureInPictureExitFill } from "react-icons/ri";

// The sidebar component

interface Props { }

export default function DashboardSidebar({ }: Props) {
  // access info
  const { has, permissions } = useAccess();
  // pathname & routes logic
  const pathname = usePathname();
  const [selectedItem, setSelectedItem] = useState<string>("");

  useEffect(() => {
    const selectedList = [];

    const path1 = pathname.split("/")[1] || "";
    const path2 = pathname.split("/")[2] || "";
    const path3 = pathname.split("/")[3] || "";

    // checking if it's valid
    if (path1.trim()) {
      selectedList.push(path1.trim());
      // checking the second pathname if its valid
      if (path2.trim()) {
        selectedList.push(path2.trim());

        // checking the third pathname if its valid
        if (path3.trim()) {
          selectedList.push(path3.trim());
        }
      }

      // generating the selected list
      const res = selectedList.join("-");
      // setting the selectedItem
      if (res) {
        setSelectedItem(res);
      }
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
                {permissions.includes("blog:read") ||
                  permissions.includes("blog_category:read") ||
                  permissions.includes("blog_tag:read") ? (
                  <AccordionItem value="properties" className="border-none">
                    <AccordionSidebarTrigger
                      selected={selectedItem.split("-")[0] == "properties"}
                      Icon={BsBuildings}
                    >
                      Catalog
                    </AccordionSidebarTrigger>
                    <AccordionSidebarContent>
                      {/* render the posts item if the user has the needed permissions */}
                      {has(["blog:read"]) ? (
                        <SidebarSubItem
                          selected={selectedItem == "property-details"}
                          url="/property"
                        >
                          Properties
                        </SidebarSubItem>
                      ) : null}
                      {/* render the blogs categories item if the user has the needed permissions */}
                      {has(["blog_category:read"]) ? (
                        <SidebarSubItem
                          selected={selectedItem == "blogs-categories"}
                          url="property"
                        >
                          Facilities
                          <span class="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Soon</span>
                          
                        </SidebarSubItem>
                      ) : null}
                      {/* render the blogs tags item if the user has the needed permissions */}
                      {has(["blog_tag:read"]) ? (
                        <SidebarSubItem
                          selected={selectedItem == "blogs-tags"}
                          url="/property/features"
                        >
                          House Features

                        </SidebarSubItem>
                      ) : null}
                    </AccordionSidebarContent>
                  </AccordionItem>
                ) : null}
                {permissions.includes("room:read") ||
                  permissions.includes("room_bed:read") ||
                  permissions.includes("room_category:read") ||
                  permissions.includes("room_type:read") ||
                  permissions.includes("room_include:read") ? (
                  <AccordionItem value="rooms" className="border-none">
                    <AccordionSidebarTrigger
                      selected={
                        selectedItem.split("-")[0] == "rooms" ||
                        (selectedItem.split("-")[1] == "details" &&
                          selectedItem != "room-details-floors" &&
                          selectedItem != "room-details-room-extra-services")
                      }
                      Icon={LiaBedSolid}
                    >
                      Accomodations
                    </AccordionSidebarTrigger>
                    <AccordionSidebarContent>
                      {/* render the item if the user has the needed permissions */}
                      {has(["room:read"]) ? (
                        <SidebarSubItem
                          selected={selectedItem == "rooms"}
                          url="/rooms"
                        >
                          Rooms
                        </SidebarSubItem>
                      ) : null}
                      {has(["room:read"]) ? (
                        <SidebarSubItem
                          selected={selectedItem == "rooms"}
                          url="/apartments"
                        >
                          Apartments
                        </SidebarSubItem>
                      ) : null}
                      {/* render the item if the user has the needed permissions */}
                      {has(["room_category:read"]) ? (
                        <SidebarSubItem
                          selected={
                            selectedItem == "room-details-room-categories"
                          }
                          url="/room-details/room-categories"
                        >
                          Room Categories
                        </SidebarSubItem>
                      ) : null}
                      {/* render the item if the user has the needed permissions */}
                      {has(["room_feature:read"]) ? (
                        <SidebarSubItem
                          selected={
                            selectedItem == "room-details-room-features"
                          }
                          url="/room-details/room-features"
                        >
                          Room Features
                        </SidebarSubItem>
                      ) : null}
                      {/* render the item if the user has the needed permissions */}
                      {has(["room_type:read"]) ? (
                        <SidebarSubItem
                          selected={selectedItem == "room-details-room-types"}
                          url="/room-details/room-types"
                        >
                          Room Types
                        </SidebarSubItem>
                      ) : null}
                      {/* render the item if the user has the needed permissions */}
                      {has(["room_bed:read"]) ? (
                        <SidebarSubItem
                          selected={selectedItem == "room-details-room-beds"}
                          url="/room-details/room-beds"
                        >
                          Room Beds
                        </SidebarSubItem>
                      ) : null}
                      {/* render the item if the user has the needed permissions */}
                      {has(["room_include:read"]) ? (
                        <SidebarSubItem
                          selected={
                            selectedItem == "room-details-room-includes"
                          }
                          url="/room-details/room-includes"
                        >
                          Room Includes
                        </SidebarSubItem>
                      ) : null}
                      {/* render the item if the user has the needed permissions */}
                      {has(["room:delete"]) ? (
                        <SidebarSubItem
                          selected={selectedItem == "rooms-deleted"}
                          url="/rooms/deleted"
                        >
                          Deleted Rooms
                        </SidebarSubItem>
                      ) : null}
                    </AccordionSidebarContent>
                  </AccordionItem>
                ) : null}
                {has(["room_extra_services:read"]) ? (
                  <SidebarItem
                    selected={selectedItem == "room-details-room-extra-services"}
                    url="/room-details/room-extra-services"
                    Icon={HiOutlineArchive}
                  >
                    Services
                  </SidebarItem>
                ) : null}
                {/* Reservations */}
                {permissions.includes("reservation:read") ? (
                  <AccordionItem value="reservations" className="border-none">
                    <AccordionSidebarTrigger
                      selected={selectedItem.split("-")[0] == "reservations"}
                      Icon={HiOutlineCalendar}
                    >
                      Booking
                    </AccordionSidebarTrigger>
                    <AccordionSidebarContent>
                      <SidebarSubItem
                        selected={
                          selectedItem.split("-")[0] == "reservations" &&
                          (selectedItem.split("-")[1] || "") == "overview"
                        }
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
                ) : null}

                {/* CRM */}
                {permissions.includes("crm_contacts:read") ||
                  permissions.includes("crm_company:read") ||
                  permissions.includes("analytics_crm_contacts:read") ||
                  permissions.includes("analytics_crm_companies:read") ? (
                  <AccordionItem value="crm" className="border-none">
                    <AccordionSidebarTrigger
                      selected={selectedItem.split("-")[0] == "crm"}
                      Icon={HiOutlineUserGroup}
                    >
                      CRM
                    </AccordionSidebarTrigger>
                    <AccordionSidebarContent>
                      {/* render the crm overview (analytics) item if the user has the needed permissions */}
                      {has(["analytics_crm_contacts:read"]) ||
                        has(["analytics_crm_companies:read"]) ? (
                        <SidebarSubItem
                          selected={selectedItem == "crm-overview"}
                          url="/crm/overview"
                        >
                          Overview
                        </SidebarSubItem>
                      ) : null}
                      {/* render the crm contacts item if the user has the needed permissions */}
                      {has(["crm_contacts:read"]) ? (
                        <SidebarSubItem
                          selected={selectedItem == "crm-contacts"}
                          url="/crm/contacts"
                        >
                          Contacts
                        </SidebarSubItem>
                      ) : null}
                      {/* render the crm companies item if the user has the needed permissions */}
                      {has(["crm_company:read"]) ? (
                        <SidebarSubItem
                          selected={selectedItem == "crm-companies"}
                          url="/crm/companies"
                        >
                          Companies
                        </SidebarSubItem>
                      ) : null}
                    </AccordionSidebarContent>
                  </AccordionItem>
                ) : null}

                {/* room item */}


                {/* Jobs */}
                {permissions.includes("job_position:read") ||
                  permissions.includes("job_submission:read") ||
                  permissions.includes("job_department:read") ? (
                  <AccordionItem value="jobs" className="border-none">
                    <AccordionSidebarTrigger
                      selected={selectedItem.split("-")[0] == "jobs"}
                      Icon={HiOutlineBriefcase}
                    >
                      Jobs
                    </AccordionSidebarTrigger>
                    <AccordionSidebarContent>
                      {/* render the jobs submissions item if the user has the needed permissions */}
                      {has(["job_submission:read"]) ? (
                        <SidebarSubItem
                          selected={selectedItem == "jobs-submissions"}
                          url="/jobs/submissions"
                        >
                          Submissions
                        </SidebarSubItem>
                      ) : null}
                      {/* render the job positions item if the user has the needed permissions */}
                      {has(["job_position:read"]) ? (
                        <SidebarSubItem
                          selected={selectedItem == "jobs-positions"}
                          url="/jobs/positions"
                        >
                          Positions
                        </SidebarSubItem>
                      ) : null}
                      {/* render the job department item if the user has the needed permissions */}
                      {has(["job_department:read"]) ? (
                        <SidebarSubItem
                          selected={selectedItem == "jobs-departments"}
                          url="/jobs/departments"
                        >
                          Departments
                        </SidebarSubItem>
                      ) : null}
                    </AccordionSidebarContent>
                  </AccordionItem>
                ) : null}

                {/* Blogs */}
                {permissions.includes("blog:read") ||
                  permissions.includes("blog_category:read") ||
                  permissions.includes("blog_tag:read") ? (
                  <AccordionItem value="blogs" className="border-none">
                    <AccordionSidebarTrigger
                      selected={selectedItem.split("-")[0] == "blogs"}
                      Icon={HiOutlineNewspaper}
                    >
                      Blog
                    </AccordionSidebarTrigger>
                    <AccordionSidebarContent>
                      {/* render the posts item if the user has the needed permissions */}
                      {has(["blog:read"]) ? (
                        <SidebarSubItem
                          selected={selectedItem == "blogs"}
                          url="/blogs"
                        >
                          Posts
                        </SidebarSubItem>
                      ) : null}
                      {/* render the blogs categories item if the user has the needed permissions */}
                      {has(["blog_category:read"]) ? (
                        <SidebarSubItem
                          selected={selectedItem == "blogs-categories"}
                          url="/blogs/categories"
                        >
                          Categories
                        </SidebarSubItem>
                      ) : null}
                      {/* render the blogs tags item if the user has the needed permissions */}
                      {has(["blog_tag:read"]) ? (
                        <SidebarSubItem
                          selected={selectedItem == "blogs-tags"}
                          url="/blogs/tags"
                        >
                          Tags
                        </SidebarSubItem>
                      ) : null}
                    </AccordionSidebarContent>
                  </AccordionItem>
                ) : null}

                {/* Food & Drink */}
                {permissions.includes("food_dish:read") ||
                  permissions.includes("food_ingredient:read") ||
                  permissions.includes("food_menu:read") ||
                  permissions.includes("food_type:read") ? (
                  <AccordionItem value="restaurant" className="border-none">
                    <AccordionSidebarTrigger
                      selected={selectedItem.split("-")[0] == "food"}
                      Icon={CgCoffee}
                    >
                      Catering
                    </AccordionSidebarTrigger>
                    <AccordionSidebarContent>
                      {/* render the food dishes item if the user has the needed permissions */}
                      {has(["food_dish:read"]) ? (
                        <SidebarSubItem
                          selected={selectedItem == "food-dishes"}
                          url="/food/dishes"
                        >
                          Dishes
                        </SidebarSubItem>
                      ) : null}
                      {/* render the food menus item if the user has the needed permissions */}
                      {has(["food_menu:read"]) ? (
                        <SidebarSubItem
                          selected={selectedItem == "food-menus"}
                          url="/food/menus"
                        >
                          Menus
                        </SidebarSubItem>
                      ) : null}
                      {/* render the food ingredient item if the user has the needed permissions */}
                      {has(["food_ingredient:read"]) ? (
                        <SidebarSubItem
                          selected={selectedItem == "food-ingredients"}
                          url="/food/ingredients"
                        >
                          Ingredients
                        </SidebarSubItem>
                      ) : null}
                      {/* render the food type item if the user has the needed permissions */}
                      {has(["food_type:read"]) ? (
                        <SidebarSubItem
                          selected={selectedItem == "food-types"}
                          url="/food/types"
                        >
                          Types
                        </SidebarSubItem>
                      ) : null}
                    </AccordionSidebarContent>
                  </AccordionItem>
                ) : null}

                {/* Users & Permissions */}
                {permissions.includes("user:read") ||
                  permissions.includes("role:read") ? (
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
                      {/* render the users item if the user has the needed permissions */}
                      {has(["user:read"]) ? (
                        <SidebarSubItem
                          selected={selectedItem == "users"}
                          url="/users"
                        >
                          Users
                        </SidebarSubItem>
                      ) : null}
                      {/* render the roles item if the user has the needed permissions */}
                      {has(["role:read"]) ? (
                        <SidebarSubItem
                          selected={selectedItem == "roles"}
                          url="/roles"
                        >
                          Roles
                        </SidebarSubItem>
                      ) : null}
                    </AccordionSidebarContent>
                  </AccordionItem>
                ) : null}
              </Accordion>

              {/* Floors */}
              {/* render the floors item if the user has the needed permissions */}

              {/* {has(["room:read"]) ? (
                <SidebarItem
                  selected={selectedItem == "property-details"}
                  url="/property"
                  Icon={BsBuildings}
                >
                  Properties
                </SidebarItem>
              ) : null} */}





              {/* {has(["floor:read"]) ? (
                <SidebarItem
                  selected={selectedItem == "room-details-floors"}
                  url="/room-details/floors"
                  Icon={RiPictureInPictureExitFill}
                >
                  Floors
                </SidebarItem>
              ) : null} */}

              {/* Extra Services */}
              {/* render the extra services item if the user has the needed permissions */}


              {/* Destinations */}
              {/* render the destinations item if the user has the needed permissions */}
              {has(["destination:read"]) ? (
                <SidebarItem
                  selected={selectedItem == "destinations"}
                  url="/destinations"
                  Icon={HiOutlineGlobe}
                >
                  Destinations
                </SidebarItem>
              ) : null}

              {/* setting */}
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
