// The dashboard pages paths types

export type SystemPagesPathTypes =
  // home page
  | "/"

  // reservations pages paths
  | "reservations/pending"
  | "reservations/apposed"
  | "reservations/archived"
  | "reservations/canceled"

  // food dishes pages paths
  | "food/dishes"
  | "food/dishes/create"
  | "food/dishes/update"

  // food menus pages paths
  | "food/menus"
  | "food/menus/create"
  | "food/menus/update"

  // food ingredients pages paths
  | "food/ingredients"

  // food types pages paths
  | "food/types"

  // jobs positions pages paths
  | "jobs/positions"
  | "jobs/positions/create"
  | "jobs/positions/update"

  // jobs submissions pages paths
  | "jobs/submissions"

  // jobs departments pages paths
  | "jobs/departments"

  // destinations pages paths
  | "destinations"
  | "destinations/create"
  | "destinations/update"

  // blogs pages paths
  | "blogs"
  | "blogs/create"
  | "blogs/update"

  // blogs categories pages paths
  | "blogs/categories"

  // blogs tags pages paths
  | "blogs/tags"

  // rooms pages paths
  | "rooms"
  | "rooms/create"
  | "rooms/update"
  | "rooms/_room_id_" // room view

  // room-beds pages paths
  | "room-details/room-beds"

  // room-categories pages paths
  | "room-details/room-categories"

  // room-extra-services pages paths
  | "room-details/room-extra-services"

  // room-features pages paths
  | "room-details/room-features"

  // room-includes pages paths
  | "room-details/room-includes"

  // room-types pages paths
  | "room-details/room-types"

  // floors pages paths
  | "room-details/floors"
  | "property"
  | "property/create"
  | "property/update"
  | "property/view"
  ;
