// the destination interface
export default interface DestinationInterface {
  header: {
    title: string;
    sub_title: string;
    description: string;
  };
  title: string;
  sub_title: string;
  content: string;
  image: string;
  features: string[];
  images_gallery: string[];
  distance: number; // distance (KM) of destination
  seo: {
    title: string;
    description: string; // 160 characters is good for seo
    keywords: string[];
    slug: string;
  };
  createdAt: string | Date;
  updateAt: string | Date; // IOS Date
  id: string;
}
// the create destination interface
export interface CreateDestinationInterface {
  header: {
    title: string;
    sub_title: string;
    description: string;
  };
  title: string;
  sub_title: string;
  content: string;
  image: string;
  features: string[];
  images_gallery: string[];
  distance: number; // distance (KM) of destination
  seo: {
    title: string;
    description: string; // 160 characters is good for seo
    keywords: string[];
    slug: string;
  };
}
