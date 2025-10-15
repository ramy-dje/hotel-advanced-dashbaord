import LimitedText from "@/components/limited-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CRMCompanyInterface from "@/interfaces/crm-company.interface";
import { copyTextToClipboard } from "@/lib/utils";
import {
  FaFacebook,
  FaFax,
  FaLinkedin,
  FaMobileRetro,
  FaViber,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";
import {
  HiAtSymbol,
  HiBriefcase,
  HiChatAlt,
  HiDocumentDuplicate,
  HiGlobe,
  HiGlobeAlt,
  HiLink,
  HiLocationMarker,
  HiOutlineDeviceMobile,
  HiOutlineDocumentDuplicate,
  HiUser,
  HiUserGroup,
} from "react-icons/hi";
import { FaBuilding } from "react-icons/fa6";
import { RiInstagramFill } from "react-icons/ri";
import { TbWorldWww } from "react-icons/tb";

// The CRM Company Profile Content Component
interface Props {
  company: CRMCompanyInterface;
}

export default function CompanyProfileCardContent({ company }: Props) {
  return (
    <div className="flex flex-col gap-4 lg:gap-6 lg:border lg:p-3 rounded-2xl lg:bg-muted/40">
      {/* profile info  */}
      <section
        role="contact-personal-and-profile-information-section"
        className="w-full bg-card border p-4 rounded-xl transition-all duration-200 hover:border-primary/20"
      >
        <h4 className="text-primary text-base lg:text-lg font-semibold mb-4 flex items-center gap-2">
          <FaBuilding className="size-5" />
          Profile Details
        </h4>
        <ul className="flex flex-col list-none space-y-1">
          {/* name */}
          <li className="group px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="block min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  Name:
                </span>
                <span className="text-foreground font-semibold break-all">
                  {company.info.name}
                </span>
              </div>
              <Button
                onClick={() => copyTextToClipboard(company.info.name)}
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 opacity-0 group-hover:opacity-100 text-foreground/60 transition-all hover:text-primary"
              >
                <HiOutlineDocumentDuplicate className="size-4" />
              </Button>
            </div>
          </li>
          {/* size */}
          <li className="group px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="block min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  Size:
                </span>
                <span className="flex items-center gap-2 text-foreground font-semibold break-all">
                  {company.info.size}
                  <HiUserGroup className="size-4" />
                </span>
              </div>
              <Button
                onClick={() => copyTextToClipboard(company.info.size)}
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 opacity-0 group-hover:opacity-100 text-foreground/60 transition-all hover:text-primary"
              >
                <HiOutlineDocumentDuplicate className="size-4" />
              </Button>
            </div>
          </li>
          {/* description */}
          <li className="group px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-start lg:items-center justify-between gap-2">
                <span className="block min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  Description:
                </span>
                {company.info?.description ? (
                  <Button
                    onClick={() =>
                      copyTextToClipboard(company.info.description)
                    }
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 opacity-0 group-hover:opacity-100 text-foreground/60 transition-all hover:text-primary"
                  >
                    <HiOutlineDocumentDuplicate className="size-4" />
                  </Button>
                ) : null}
              </div>
              <p className="text-sm text-foreground leading-relaxed break-all">
                {company.info.description || "/"}
              </p>
            </div>
          </li>
        </ul>
      </section>
      {/* location */}
      <section
        role="contact-personal-and-profile-information-section"
        className="w-full bg-card border p-4 rounded-xl transition-all duration-200 hover:border-primary/20"
      >
        <h4 className="text-primary text-base lg:text-lg font-semibold mb-4 flex items-center gap-2">
          <HiLocationMarker className="size-5" />
          Location Details
        </h4>
        <ul className="flex flex-col list-none space-y-1">
          {/* Region */}
          <li className="group px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start  lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="block min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  Region:
                </span>
                <span className="text-foreground font-semibold break-all">
                  {company.info.location?.region || "/"}
                </span>
              </div>
              {company.info.location?.region ? (
                <Button
                  onClick={() =>
                    copyTextToClipboard(company.info.location?.region)
                  }
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 opacity-0 group-hover:opacity-100 text-foreground/60 transition-all hover:text-primary"
                >
                  <HiOutlineDocumentDuplicate className="size-4" />
                </Button>
              ) : null}
            </div>
          </li>
          {/* Country */}
          <li className="group px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start  lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="block min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  Country:
                </span>
                <span className="text-foreground font-semibold break-all">
                  {company.info.location?.country || "/"}
                </span>
              </div>
              {company.info.location?.country ? (
                <Button
                  onClick={() =>
                    copyTextToClipboard(company.info.location?.country)
                  }
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 opacity-0 group-hover:opacity-100 text-foreground/60 transition-all hover:text-primary"
                >
                  <HiOutlineDocumentDuplicate className="size-4" />
                </Button>
              ) : null}
            </div>
          </li>
          {/* State */}
          <li className="group px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="block min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  State:
                </span>
                <span className="text-foreground font-semibold break-all">
                  {company.info.location?.state || "/"}
                </span>
              </div>
              {company.info.location?.state ? (
                <Button
                  onClick={() =>
                    copyTextToClipboard(company.info.location?.state)
                  }
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 opacity-0 group-hover:opacity-100 text-foreground/60 transition-all hover:text-primary"
                >
                  <HiOutlineDocumentDuplicate className="size-4" />
                </Button>
              ) : null}
            </div>
          </li>
          {/* City */}
          <li className="group px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="block min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  City:
                </span>
                <span className="text-foreground font-semibold break-all">
                  {company.info.location?.city || "/"}
                </span>
              </div>
              {company.info.location?.city ? (
                <Button
                  onClick={() =>
                    copyTextToClipboard(company.info.location?.city)
                  }
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 opacity-0 group-hover:opacity-100 text-foreground/60 transition-all hover:text-primary"
                >
                  <HiOutlineDocumentDuplicate className="size-4" />
                </Button>
              ) : null}
            </div>
          </li>
          {/* Address */}
          <li className="group px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="block min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  Address:
                </span>
                <span className="text-foreground font-semibold break-all">
                  {company.info.location?.address || "/"}
                </span>
              </div>
              {company.info.location?.address ? (
                <Button
                  onClick={() =>
                    copyTextToClipboard(company.info.location?.address)
                  }
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 opacity-0 group-hover:opacity-100 text-foreground/60 transition-all hover:text-primary"
                >
                  <HiOutlineDocumentDuplicate className="size-4" />
                </Button>
              ) : null}
            </div>
          </li>
          {/* Zipcode */}
          <li className="group px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="block min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  Zipcode:
                </span>
                <span className="text-foreground font-semibold break-all">
                  {company.info.location?.zipcode || "/"}
                </span>
              </div>
              {company.info.location?.zipcode ? (
                <Button
                  onClick={() =>
                    copyTextToClipboard(company.info.location?.zipcode)
                  }
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 opacity-0 group-hover:opacity-100 text-foreground/60 transition-all hover:text-primary"
                >
                  <HiOutlineDocumentDuplicate className="size-4" />
                </Button>
              ) : null}
            </div>
          </li>
        </ul>
      </section>
      {/* Industry & Work */}
      <section
        role="contact-personal-and-profile-information-section"
        className="w-full bg-card border p-4 rounded-xl transition-all duration-200 hover:border-primary/20"
      >
        <h4 className="text-primary text-base lg:text-lg font-semibold mb-4 flex items-center gap-2">
          <HiBriefcase className="size-5" />
          Industry & Work Details
        </h4>
        <ul className="flex flex-col list-none space-y-1">
          {/* Industry */}
          <li className="group px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start  lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="block min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  Industry:
                </span>
                <span className="text-foreground font-semibold break-all">
                  {company.industry || "/"}
                </span>
              </div>
              {company?.industry ? (
                <Button
                  onClick={() => copyTextToClipboard(company.industry)}
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 opacity-0 group-hover:opacity-100 text-foreground/60 transition-all hover:text-primary"
                >
                  <HiOutlineDocumentDuplicate className="size-4" />
                </Button>
              ) : null}
            </div>
          </li>
          {/* Category */}
          <li className="group px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="block min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  Category:
                </span>
                <span className="text-foreground font-semibold break-all">
                  {company.category || "/"}
                </span>
              </div>
              {company?.category ? (
                <Button
                  onClick={() => copyTextToClipboard(company.category)}
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 opacity-0 group-hover:opacity-100 text-foreground/60 transition-all hover:text-primary"
                >
                  <HiOutlineDocumentDuplicate className="size-4" />
                </Button>
              ) : null}
            </div>
          </li>
          {/* Source */}
          <li className="group px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-start lg:items-center justify-between gap-2">
                <span className="block min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  source:
                </span>
                {company.resource ? (
                  <Button
                    onClick={() => copyTextToClipboard(company.resource)}
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 opacity-0 group-hover:opacity-100 text-foreground/60 transition-all hover:text-primary"
                  >
                    <HiOutlineDocumentDuplicate className="size-4" />
                  </Button>
                ) : null}
              </div>
              <p className="text-sm text-foreground leading-relaxed break-all">
                {company.resource || "/"}
              </p>
            </div>
          </li>
        </ul>
      </section>
      {/* Contact */}
      <section
        role="contact-personal-and-profile-information-section"
        className="w-full bg-card border p-4 rounded-xl transition-all duration-200 hover:border-primary/20"
      >
        <h4 className="text-primary text-base lg:text-lg font-semibold mb-4 flex items-center gap-2">
          <HiChatAlt className="size-5" />
          Contact Details
        </h4>
        <ul className="flex flex-col list-none space-y-1">
          {/* email */}
          <li className="px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start  lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="flex items-center gap-2 min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  <HiAtSymbol className="size-4" />
                  Emails:
                </span>
                {/* warping emails */}
                {company.emails.map((email, i) => (
                  <Badge
                    key={email + i}
                    variant="outline"
                    className="group px-3 py-1.5 rounded-full gap-2 text-sm font-normal bg-card hover:bg-muted/50 transition-all duration-200 border-primary/20"
                  >
                    <HiAtSymbol className="text-primary size-4 -ml-1 transition-transform group-hover:scale-110" />
                    <a
                      href={("mailto:" + email) as string}
                      target="_blank"
                      className="group-hover:text-primary transition-colors flex items-center gap-1 line-clamp-1 hover:underline"
                    >
                      {email}
                    </a>
                    <button
                      onClick={() => copyTextToClipboard(email)}
                      type="button"
                      className="size-6 -mr-1.5 rounded-full flex items-center justify-center transition-all duration-200 text-foreground/40 hover:text-primary hover:bg-primary/10"
                    >
                      <HiDocumentDuplicate className="size-4" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </li>
          {/* phone numbers */}
          {/* Mobile */}
          <li className="px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start  lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="flex items-center gap-2 min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  <HiOutlineDeviceMobile className="size-4" />
                  Mobile Numbers:
                </span>
                {/* warping mobile */}
                {company.phoneNumbers.mobile.map((number, i) => (
                  <Badge
                    key={number + i}
                    variant="outline"
                    className="group px-3 py-1.5 rounded-full gap-2 text-sm font-normal bg-card hover:bg-muted/50 transition-all duration-200 border-primary/20"
                  >
                    <HiOutlineDeviceMobile className="text-primary size-4 -ml-1 transition-transform group-hover:scale-110" />
                    <a
                      href={("tel:" + number) as string}
                      target="_blank"
                      className="group-hover:text-primary transition-colors flex items-center gap-1 line-clamp-1 hover:underline"
                    >
                      {number}
                    </a>
                    <button
                      onClick={() => copyTextToClipboard(number)}
                      type="button"
                      className="size-6 -mr-1.5 rounded-full flex items-center justify-center transition-all duration-200 text-foreground/40 hover:text-primary hover:bg-primary/10"
                    >
                      <HiDocumentDuplicate className="size-4" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </li>
          {/* Fax */}
          <li className="px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start  lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="flex items-center gap-2 min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  <FaFax className="size-4" />
                  FAX Numbers:
                </span>
                {/* warping numbers */}
                {company.phoneNumbers.fax.map((number, i) => (
                  <Badge
                    key={number + i}
                    variant="outline"
                    className="group px-3 py-1.5 rounded-full gap-2 text-sm font-normal bg-card hover:bg-muted/50 transition-all duration-200 border-primary/20"
                  >
                    <FaFax className="text-primary size-4 -ml-1 transition-transform group-hover:scale-110" />
                    {number}
                    <button
                      onClick={() => copyTextToClipboard(number)}
                      type="button"
                      className="size-6 -mr-1.5 rounded-full flex items-center justify-center transition-all duration-200 text-foreground/40 hover:text-primary hover:bg-primary/10"
                    >
                      <HiDocumentDuplicate className="size-4" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </li>
          {/* Direct Line */}
          <li className="px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start  lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="flex items-center gap-2 min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  <FaFax className="size-4" />
                  Direct Line Numbers:
                </span>
                {/* warping numbers */}
                {company.phoneNumbers.direct_line.map((number, i) => (
                  <Badge
                    key={number + i}
                    variant="outline"
                    className="group px-3 py-1.5 rounded-full gap-2 text-sm font-normal bg-card hover:bg-muted/50 transition-all duration-200 border-primary/20"
                  >
                    <FaMobileRetro className="text-primary size-4 -ml-1 transition-transform group-hover:scale-110" />
                    {number}
                    <button
                      onClick={() => copyTextToClipboard(number)}
                      type="button"
                      className="size-6 -mr-1.5 rounded-full flex items-center justify-center transition-all duration-200 text-foreground/40 hover:text-primary hover:bg-primary/10"
                    >
                      <HiDocumentDuplicate className="size-4" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </li>
          {/* Whatsapp */}
          <li className="px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start  lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="flex items-center gap-2 min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  <FaWhatsapp className="size-4 text-green-500" />
                  Whatsapp Numbers:
                </span>
                {/* warping numbers */}
                {company.phoneNumbers.whatsapp.map((number, i) => (
                  <Badge
                    key={number + i}
                    variant="outline"
                    className="group px-3 py-1.5 rounded-full gap-2 text-sm font-normal bg-card hover:bg-muted/50 transition-all duration-200 border-primary/20"
                  >
                    <FaWhatsapp className="text-green-500 size-4 -ml-1 transition-transform group-hover:scale-110" />
                    {number}
                    <button
                      onClick={() => copyTextToClipboard(number)}
                      type="button"
                      className="size-6 -mr-1.5 rounded-full flex items-center justify-center transition-all duration-200 text-foreground/40 hover:text-primary hover:bg-primary/10"
                    >
                      <HiDocumentDuplicate className="size-4" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </li>
          {/* Viber */}
          <li className="px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start  lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="flex items-center gap-2 min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  <FaViber className="size-4 text-blue-500" />
                  Viber Numbers:
                </span>
                {/* warping numbers */}
                {company.phoneNumbers.viber.map((number, i) => (
                  <Badge
                    key={number + i}
                    variant="outline"
                    className="group px-3 py-1.5 rounded-full gap-2 text-sm font-normal bg-card hover:bg-muted/50 transition-all duration-200 border-primary/20"
                  >
                    <FaViber className="text-blue-500 size-4 -ml-1 transition-transform group-hover:scale-110" />
                    {number}
                    <button
                      onClick={() => copyTextToClipboard(number)}
                      type="button"
                      className="size-6 -mr-1.5 rounded-full flex items-center justify-center transition-all duration-200 text-foreground/40 hover:text-primary hover:bg-primary/10"
                    >
                      <HiDocumentDuplicate className="size-4" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </li>
        </ul>
      </section>
      {/* Social Media */}
      <section
        role="contact-personal-and-profile-information-section"
        className="w-full bg-card border p-4 rounded-xl transition-all duration-200 hover:border-primary/20"
      >
        <h4 className="text-primary text-base lg:text-lg font-semibold mb-4 flex items-center gap-2">
          <HiGlobe className="size-5" />
          Social Media
        </h4>
        <ul className="flex flex-col list-none space-y-1">
          {/* Website */}
          <li className="px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start  lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="flex items-center gap-2 min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  <TbWorldWww className="text-cyan-500 size-4" />
                  Websites:
                </span>
                {/* warping accounts/links */}
                {company.socialMedia.website.map((account, i) => (
                  <Badge
                    key={account + i}
                    variant="outline"
                    className="group px-3 py-1.5 rounded-full gap-2 text-sm font-normal bg-card hover:bg-muted/50 transition-all duration-200 border-primary/20"
                  >
                    <TbWorldWww className="text-cyan-500 size-4 -ml-1 transition-transform group-hover:scale-110" />
                    <LimitedText limit={40}>{account}</LimitedText>
                    <button
                      onClick={() => copyTextToClipboard(account)}
                      type="button"
                      className="size-6 -mr-1.5 rounded-full flex items-center justify-center transition-all duration-200 text-foreground/40 hover:text-primary hover:bg-primary/10"
                    >
                      <HiDocumentDuplicate className="size-4" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </li>
          {/* Linkedin */}
          <li className="px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start  lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="flex items-center gap-2 min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  <FaLinkedin className="text-sky-600 size-4" />
                  Linkedin:
                </span>
                {/* warping accounts */}
                {company.socialMedia.linkedin.map((account, i) => (
                  <Badge
                    key={account + i}
                    variant="outline"
                    className="group px-3 py-1.5 rounded-full gap-2 text-sm font-normal bg-card hover:bg-muted/50 transition-all duration-200 border-primary/20"
                  >
                    <FaLinkedin className="text-sky-600 size-4 -ml-1 transition-transform group-hover:scale-110" />
                    <LimitedText limit={40}>{account}</LimitedText>
                    <button
                      onClick={() => copyTextToClipboard(account)}
                      type="button"
                      className="size-6 -mr-1.5 rounded-full flex items-center justify-center transition-all duration-200 text-foreground/40 hover:text-primary hover:bg-primary/10"
                    >
                      <HiDocumentDuplicate className="size-4" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </li>
          {/* Facebook */}
          <li className="px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start  lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="flex items-center gap-2 min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  <FaFacebook className="text-blue-500 size-4" />
                  Facebook:
                </span>
                {/* warping accounts */}
                {company.socialMedia.facebook.map((account, i) => (
                  <Badge
                    key={account + i}
                    variant="outline"
                    className="group px-3 py-1.5 rounded-full gap-2 text-sm font-normal bg-card hover:bg-muted/50 transition-all duration-200 border-primary/20"
                  >
                    <FaFacebook className="text-blue-500 size-4 -ml-1 transition-transform group-hover:scale-110" />
                    <LimitedText limit={40}>{account}</LimitedText>
                    <button
                      onClick={() => copyTextToClipboard(account)}
                      type="button"
                      className="size-6 -mr-1.5 rounded-full flex items-center justify-center transition-all duration-200 text-foreground/40 hover:text-primary hover:bg-primary/10"
                    >
                      <HiDocumentDuplicate className="size-4" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </li>
          {/* Instagram */}
          <li className="px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start  lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="flex items-center gap-2 min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  <RiInstagramFill className="text-pink-500 size-4" />
                  Instagram:
                </span>
                {/* warping accounts */}
                {company.socialMedia.instagram.map((account, i) => (
                  <Badge
                    key={account + i}
                    variant="outline"
                    className="group px-3 py-1.5 rounded-full gap-2 text-sm font-normal bg-card hover:bg-muted/50 transition-all duration-200 border-primary/20"
                  >
                    <RiInstagramFill className="text-pink-500 size-4 -ml-1 transition-transform group-hover:scale-110" />
                    <LimitedText limit={40}>{account}</LimitedText>
                    <button
                      onClick={() => copyTextToClipboard(account)}
                      type="button"
                      className="size-6 -mr-1.5 rounded-full flex items-center justify-center transition-all duration-200 text-foreground/40 hover:text-primary hover:bg-primary/10"
                    >
                      <HiDocumentDuplicate className="size-4" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </li>
          {/* Youtube */}
          <li className="px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start  lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="flex items-center gap-2 min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  <FaYoutube className="text-red-500 size-4" />
                  Youtube:
                </span>
                {/* warping accounts */}
                {company.socialMedia.youtube.map((account, i) => (
                  <Badge
                    key={account + i}
                    variant="outline"
                    className="group px-3 py-1.5 rounded-full gap-2 text-sm font-normal bg-card hover:bg-muted/50 transition-all duration-200 border-primary/20"
                  >
                    <FaYoutube className="text-red-500 size-4 -ml-1 transition-transform group-hover:scale-110" />
                    <LimitedText limit={40}>{account}</LimitedText>
                    <button
                      onClick={() => copyTextToClipboard(account)}
                      type="button"
                      className="size-6 -mr-1.5 rounded-full flex items-center justify-center transition-all duration-200 text-foreground/40 hover:text-primary hover:bg-primary/10"
                    >
                      <HiDocumentDuplicate className="size-4" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </li>
          {/* Other */}
          <li className="px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start  lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="flex items-center gap-2 min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  <HiLink className="text-primary size-4" />
                  Other:
                </span>
                {/* warping accounts */}
                {company.socialMedia.other.map((account, i) => (
                  <Badge
                    key={account + i}
                    variant="outline"
                    className="group px-3 py-1.5 rounded-full gap-2 text-sm font-normal bg-card hover:bg-muted/50 transition-all duration-200 border-primary/20"
                  >
                    <HiLink className="text-primary size-4 -ml-1 transition-transform group-hover:scale-110" />
                    <LimitedText limit={40}>{account}</LimitedText>
                    <button
                      onClick={() => copyTextToClipboard(account)}
                      type="button"
                      className="size-6 -mr-1.5 rounded-full flex items-center justify-center transition-all duration-200 text-foreground/40 hover:text-primary hover:bg-primary/10"
                    >
                      <HiDocumentDuplicate className="size-4" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );
}
