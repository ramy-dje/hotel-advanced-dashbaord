import { SystemPermissions } from "@/interfaces/permissions/permissions";
import {
  HiOutlineEye,
  HiOutlinePlusCircle,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineRefresh,
  HiOutlineBan,
  HiOutlineOfficeBuilding,
  HiOutlineCalendar,
  HiOutlineBriefcase,
  HiOutlineNewspaper,
  HiOutlineGlobe,
  HiOutlineUserGroup,
  HiOutlineChartBar,
  HiOutlineFolder,
  HiOutlineShare,
} from "react-icons/hi";
import { IoFastFoodOutline } from "react-icons/io5";
import { LiaBedSolid } from "react-icons/lia";
import { IconType } from "react-icons/lib";

// ModulesCRUDPermissionsList

const modulesCRUD: {
  id: string;
  title: string; // the name of module (e.g rooms)
  Icon: IconType; // the icon of the module
  allPermission: SystemPermissions[];
  cruds: {
    name: string; // name of the curd (e.g create room)
    Icon: IconType; //
    color:
      | "green"
      | "red"
      | "blue"
      | "yellow"
      | "gray"
      | "purple"
      | "dark-red"
      | "cyan";
    dependency: SystemPermissions[]; // permissions that this crud needs but can't remove
    permission: SystemPermissions[]; // the permission that this crud needs (e.g room:create , room_category:read...)
  }[];
}[] = [
  // rooms module
  {
    id: "rooms-permission",
    title: "Rooms Permissions",
    Icon: LiaBedSolid,
    allPermission: [
      "room:read",
      "room:create",
      "room:update",
      "room:delete",
      "room:recover",
      "room:force-delete",
    ],
    cruds: [
      // read rooms
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["room:read"],
      },
      // create room
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["room:read"],
        permission: ["room:create"],
      },
      // update room
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["room:read"],
        permission: ["room:update"],
      },
      // delete room
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["room:read"],
        permission: ["room:delete"],
      },
      // recover room
      {
        Icon: HiOutlineRefresh,
        name: "Recover",
        color: "cyan",
        dependency: ["room:read", "room:delete"],
        permission: ["room:recover"],
      },
      // force delete room
      {
        Icon: HiOutlineBan,
        name: "Trash",
        color: "dark-red",
        dependency: ["room:read", "room:delete"],
        permission: ["room:force-delete"],
      },
    ],
  },
  // floors module
  {
    id: "floors-permission",
    title: "Floors Permissions",
    Icon: HiOutlineOfficeBuilding,
    allPermission: [
      "floor:read",
      "floor:create",
      "floor:update",
      "floor:delete",
    ],
    cruds: [
      // read floors
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["floor:read"],
      },
      // create floor
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["floor:read"],
        permission: ["floor:create"],
      },
      // update floor
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["floor:read"],
        permission: ["floor:update"],
      },
      // delete floor
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["floor:read"],
        permission: ["floor:delete"],
      },
    ],
  },
  // room beds module
  {
    id: "room-beds-permission",
    title: "Room Beds Permissions",
    Icon: LiaBedSolid,
    allPermission: [
      "room_bed:read",
      "room_bed:create",
      "room_bed:update",
      "room_bed:delete",
    ],
    cruds: [
      // read beds
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["room_bed:read"],
      },
      // create bed
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["room_bed:read"],
        permission: ["room_bed:create"],
      },
      // update bed
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["room_bed:read"],
        permission: ["room_bed:update"],
      },
      // delete bed
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["room_bed:read"],
        permission: ["room_bed:delete"],
      },
    ],
  },
  // room type module
  {
    id: "room-types-permission",
    title: "Room Types Permissions",
    Icon: LiaBedSolid,
    allPermission: [
      "room_type:read",
      "room_type:create",
      "room_type:update",
      "room_type:delete",
    ],
    cruds: [
      // read types
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["room_type:read"],
      },
      // create type
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["room_type:read"],
        permission: ["room_type:create"],
      },
      // update type
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["room_type:read"],
        permission: ["room_type:update"],
      },
      // delete type
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["room_type:read"],
        permission: ["room_type:delete"],
      },
    ],
  },
  // room category module
  {
    id: "room-categories-permission",
    title: "Room Categories Permissions",
    Icon: LiaBedSolid,
    allPermission: [
      "room_category:read",
      "room_category:create",
      "room_category:update",
      "room_category:delete",
    ],
    cruds: [
      // read categories
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["room_category:read"],
      },
      // create category
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["room_category:read"],
        permission: ["room_category:create"],
      },
      // update category
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["room_category:read"],
        permission: ["room_category:update"],
      },
      // delete category
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["room_category:read"],
        permission: ["room_category:delete"],
      },
    ],
  },
  // room feature module
  {
    id: "room-features-permission",
    title: "Room Features Permissions",
    Icon: LiaBedSolid,
    allPermission: [
      "room_feature:read",
      "room_feature:create",
      "room_feature:update",
      "room_feature:delete",
    ],
    cruds: [
      // read features
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["room_feature:read"],
      },
      // create feature
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["room_feature:read"],
        permission: ["room_feature:create"],
      },
      // update feature
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["room_feature:read"],
        permission: ["room_feature:update"],
      },
      // delete feature
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["room_feature:read"],
        permission: ["room_feature:delete"],
      },
    ],
  },
  // room extra services module
  {
    id: "room-extra-service-permission",
    title: "Room Extra Service Permissions",
    Icon: LiaBedSolid,
    allPermission: [
      "room_extra_services:read",
      "room_extra_services:create",
      "room_extra_services:update",
      "room_extra_services:delete",
    ],
    cruds: [
      // read extra_services
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["room_extra_services:read"],
      },
      // create extra_services
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["room_extra_services:read"],
        permission: ["room_extra_services:create"],
      },
      // update extra_services
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["room_extra_services:read"],
        permission: ["room_extra_services:update"],
      },
      // delete extra_services
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["room_extra_services:read"],
        permission: ["room_extra_services:delete"],
      },
    ],
  },
  // room includes module
  {
    id: "room-includes-permission",
    title: "Room Includes Permissions",
    Icon: LiaBedSolid,
    allPermission: [
      "room_include:read",
      "room_include:create",
      "room_include:update",
      "room_include:delete",
    ],
    cruds: [
      // read includes
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["room_include:read"],
      },
      // create include
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["room_include:read"],
        permission: ["room_include:create"],
      },
      // update include
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["room_include:read"],
        permission: ["room_include:update"],
      },
      // delete include
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["room_include:read"],
        permission: ["room_include:delete"],
      },
    ],
  },
  // reservations module
  {
    id: "reservations-permission",
    title: "Reservations Permissions",
    Icon: HiOutlineCalendar,
    allPermission: [
      "reservation:read",
      "reservation:create",
      "reservation-status:update",
      "reservation:update",
      "reservation:delete",
    ],
    cruds: [
      // read reservations
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["reservation:read"],
      },
      // create reservation
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["reservation:read"],
        permission: ["reservation:create"],
      },
      // update reservation
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["reservation:read"],
        permission: ["reservation:update"],
      },
      // update status
      {
        Icon: HiOutlinePencil,
        name: "Status",
        color: "cyan",
        dependency: ["reservation:read"],
        permission: ["reservation-status:update"],
      },
      // delete reservation
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["reservation:read"],
        permission: ["reservation:delete"],
      },
    ],
  },
  // food menus module
  {
    id: "food-menus-permission",
    title: "Food Menus Permissions",
    Icon: IoFastFoodOutline,
    allPermission: [
      "food_menu:read",
      "food_menu:create",
      "food_menu:update",
      "food_menu:delete",
    ],
    cruds: [
      // read menus
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["food_menu:read"],
      },
      // create menu
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["food_menu:read"],
        permission: ["food_menu:create"],
      },
      // update menu
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["food_menu:read"],
        permission: ["food_menu:update"],
      },
      // delete menu
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["food_menu:read"],
        permission: ["food_menu:delete"],
      },
    ],
  },
  // food dishes module
  {
    id: "food-dishes-permission",
    title: "Food Dishes Permissions",
    Icon: IoFastFoodOutline,
    allPermission: [
      "food_dish:read",
      "food_dish:create",
      "food_dish:update",
      "food_dish:delete",
    ],
    cruds: [
      // read dishes
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["food_dish:read"],
      },
      // create dish
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["food_dish:read"],
        permission: ["food_dish:create"],
      },
      // update dish
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["food_dish:read"],
        permission: ["food_dish:update"],
      },
      // delete dish
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["food_dish:read"],
        permission: ["food_dish:delete"],
      },
    ],
  },
  // food ingredients module
  {
    id: "food-ingredients-permission",
    title: "Food Ingredients Permissions",
    Icon: IoFastFoodOutline,
    allPermission: [
      "food_ingredient:read",
      "food_ingredient:create",
      "food_ingredient:update",
      "food_ingredient:delete",
    ],
    cruds: [
      // read Ingredients
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["food_ingredient:read"],
      },
      // create ingredient
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["food_ingredient:read"],
        permission: ["food_ingredient:create"],
      },
      // update ingredient
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["food_ingredient:read"],
        permission: ["food_ingredient:update"],
      },
      // delete ingredient
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["food_ingredient:read"],
        permission: ["food_ingredient:delete"],
      },
    ],
  },
  // food types module
  {
    id: "food-types-permission",
    title: "Food Types Permissions",
    Icon: IoFastFoodOutline,
    allPermission: [
      "food_type:read",
      "food_type:create",
      "food_type:update",
      "food_type:delete",
    ],
    cruds: [
      // read types
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["food_type:read"],
      },
      // create type
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["food_type:read"],
        permission: ["food_type:create"],
      },
      // update type
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["food_type:read"],
        permission: ["food_type:update"],
      },
      // delete type
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["food_type:read"],
        permission: ["food_type:delete"],
      },
    ],
  },
  // job positions module
  {
    id: "job-positions-permission",
    title: "job Positions Permissions",
    Icon: HiOutlineBriefcase,
    allPermission: [
      "job_position:read",
      "job_position:create",
      "job_position:update",
      "job_position:delete",
    ],
    cruds: [
      // read positions
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["job_position:read"],
      },
      // create position
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["job_position:read"],
        permission: ["job_position:create"],
      },
      // update position
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["job_position:read"],
        permission: ["job_position:update"],
      },
      // delete position
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["job_position:read"],
        permission: ["job_position:delete"],
      },
    ],
  },
  // job submissions module
  {
    id: "job-submissions-permission",
    title: "job Submissions Permissions",
    Icon: HiOutlineBriefcase,
    allPermission: ["job_submission:read", "job_submission:delete"],
    cruds: [
      // read submissions
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["job_submission:read"],
      },
      // delete submission
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["job_submission:read"],
        permission: ["job_submission:delete"],
      },
    ],
  },
  // job departments module
  {
    id: "job-departments-permission",
    title: "job Departments Permissions",
    Icon: HiOutlineBriefcase,
    allPermission: [
      "job_department:read",
      "job_department:create",
      "job_department:update",
      "job_department:delete",
    ],
    cruds: [
      // read departments
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["job_department:read"],
      },
      // create department
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["job_department:read"],
        permission: ["job_department:create"],
      },
      // update department
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["job_department:read"],
        permission: ["job_department:update"],
      },
      // delete department
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["job_department:read"],
        permission: ["job_department:delete"],
      },
    ],
  },
  // blogs module
  {
    id: "blogs-permission",
    title: "Blogs Permissions",
    Icon: HiOutlineNewspaper,
    allPermission: ["blog:read", "blog:create", "blog:update", "blog:delete"],
    cruds: [
      // read blogs
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["blog:read"],
      },
      // create blog
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["blog:read"],
        permission: ["blog:create"],
      },
      // update blog
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["blog:read"],
        permission: ["blog:update"],
      },
      // delete blog
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["blog:read"],
        permission: ["blog:delete"],
      },
    ],
  },
  // property module
  {
    id: "property-permission",
    title: "Property Permissions",
    Icon: HiOutlineNewspaper,
    allPermission: ["property:read", "property:create", "property:update", "property:delete"],
    cruds: [
      // read blogs
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["property:read"],
      },
      // create blog
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["property:read"],
        permission: ["property:create"],
      },
      // update blog
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["property:read"],
        permission: ["property:update"],
      },
      // delete blog
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["property:read"],
        permission: ["property:delete"],
      },
    ],
  },
  // blog categories module
  {
    id: "blog-categories-permission",
    title: "Blog Categories Permissions",
    Icon: HiOutlineNewspaper,
    allPermission: [
      "blog_category:read",
      "blog_category:create",
      "blog_category:update",
      "blog_category:delete",
    ],
    cruds: [
      // read categories
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["blog_category:read"],
      },
      // create blog
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["blog_category:read"],
        permission: ["blog_category:create"],
      },
      // update blog
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["blog_category:read"],
        permission: ["blog_category:update"],
      },
      // delete blog
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["blog_category:read"],
        permission: ["blog_category:delete"],
      },
    ],
  },
  // blog tags module
  {
    id: "blog-tags-permission",
    title: "Blog Tags Permissions",
    Icon: HiOutlineNewspaper,
    allPermission: [
      "blog_tag:read",
      "blog_tag:create",
      "blog_tag:update",
      "blog_tag:delete",
    ],
    cruds: [
      // read tags
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["blog_tag:read"],
      },
      // create blog
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["blog_tag:read"],
        permission: ["blog_tag:create"],
      },
      // update blog
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["blog_tag:read"],
        permission: ["blog_tag:update"],
      },
      // delete blog
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["blog_tag:read"],
        permission: ["blog_tag:delete"],
      },
    ],
  },
  // destination module
  {
    id: "destination-permission",
    title: "Destination Permissions",
    Icon: HiOutlineGlobe,
    allPermission: [
      "destination:read",
      "destination:create",
      "destination:update",
      "destination:delete",
    ],
    cruds: [
      // read destinations
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["destination:read"],
      },
      // create destination
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["destination:read"],
        permission: ["destination:create"],
      },
      // update destination
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["destination:read"],
        permission: ["destination:update"],
      },
      // delete destination
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["destination:read"],
        permission: ["destination:delete"],
      },
    ],
  },
  // CRM contacts module
  {
    id: "CRM_contacts-permission",
    title: "CRM Contacts Permissions",
    Icon: HiOutlineUserGroup,
    allPermission: [
      "crm_contacts:read",
      "crm_contacts:create",
      "crm_contacts:update",
      "crm_contacts:delete",
    ],
    cruds: [
      // read contacts
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["crm_contacts:read"],
      },
      // create contact
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["crm_contacts:read"],
        permission: ["crm_contacts:create"],
      },
      // update contact
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["crm_contacts:read"],
        permission: ["crm_contacts:update"],
      },
      // delete contact
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["crm_contacts:read"],
        permission: ["crm_contacts:delete"],
      },
    ],
  },
  // CRM companies module
  {
    id: "CRM_companies-permission",
    title: "CRM Companies Permissions",
    Icon: HiOutlineOfficeBuilding,
    allPermission: [
      "crm_company:read",
      "crm_company:create",
      "crm_company:update",
      "crm_company:delete",
    ],
    cruds: [
      // read companies
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["crm_company:read"],
      },
      // create company
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["crm_company:read"],
        permission: ["crm_company:create"],
      },
      // update company
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["crm_company:read"],
        permission: ["crm_company:update"],
      },
      // delete company
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["crm_company:read"],
        permission: ["crm_company:delete"],
      },
    ],
  },
  // file manager module
  {
    id: "file-manager-permission",
    title: "File manager Permissions",
    Icon: HiOutlineFolder,
    allPermission: [
      "file_manager:read_all",
      "file_manager:read",
      "file_manager:share",
      "file_manager:create",
      "file_manager:update",
      "file_manager:delete",
    ],
    cruds: [
      // read files
      {
        Icon: HiOutlineEye,
        name: "Read",
        color: "green",
        dependency: [],
        permission: ["file_manager:read"],
      },
      // share file
      {
        Icon: HiOutlineShare,
        name: "Share",
        color: "gray",
        dependency: ["file_manager:read"],
        permission: ["file_manager:share"],
      },
      // create file
      {
        Icon: HiOutlinePlusCircle,
        name: "Create",
        color: "blue",
        dependency: ["file_manager:read"],
        permission: ["file_manager:create"],
      },
      // update file
      {
        Icon: HiOutlinePencil,
        name: "Update",
        color: "yellow",
        dependency: ["file_manager:read"],
        permission: ["file_manager:update"],
      },
      // delete file
      {
        Icon: HiOutlineTrash,
        name: "Delete",
        color: "red",
        dependency: ["file_manager:read"],
        permission: ["file_manager:delete"],
      },
    ],
  },
  // analytics module
  {
    id: "analytics-permission",
    title: "Analytics Permissions",
    Icon: HiOutlineChartBar,
    allPermission: [
      "analytics_rooms:read",
      "analytics_jobs:read",
      "analytics_crm_contacts:read",
      "analytics_crm_companies:read",
      "analytics_destinations:read",
      "analytics_blogs:read",
      "analytics_reservations:read",
      "file_manager_analytics:read",
    ],
    cruds: [
      // read rooms analytics
      {
        Icon: HiOutlineEye,
        name: "Rooms",
        color: "gray",
        dependency: [],
        permission: ["analytics_rooms:read"],
      },
      // read reservations analytics
      {
        Icon: HiOutlineEye,
        name: "Reservations",
        color: "gray",
        dependency: [],
        permission: ["analytics_reservations:read"],
      },
      // read blogs analytics
      {
        Icon: HiOutlineEye,
        name: "Blogs",
        color: "gray",
        dependency: [],
        permission: ["analytics_blogs:read"],
      },
      // read destinations analytics
      {
        Icon: HiOutlineEye,
        name: "Destinations",
        color: "gray",
        dependency: [],
        permission: ["analytics_destinations:read"],
      },
      // read crm_contacts analytics
      {
        Icon: HiOutlineEye,
        name: "CRM Contacts",
        color: "gray",
        dependency: [],
        permission: ["analytics_crm_contacts:read"],
      },
      // read crm_companies analytics
      {
        Icon: HiOutlineEye,
        name: "CRM Companies",
        color: "gray",
        dependency: [],
        permission: ["analytics_crm_companies:read"],
      },
      // read jobs analytics
      {
        Icon: HiOutlineEye,
        name: "Jobs",
        color: "gray",
        dependency: [],
        permission: ["analytics_jobs:read"],
      },
      {
        Icon: HiOutlineEye,
        name: "File manager",
        color: "gray",
        dependency: [],
        permission: ["file_manager_analytics:read"],
      },
    ],
  },
];

export { modulesCRUD };
export type modulesCRUDType = typeof modulesCRUD;
