import LimitedText from "@/components/limited-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CRMContactInterface from "@/interfaces/crm-contact.interface";
import { cn, copyTextToClipboard } from "@/lib/utils";
import {
  FaFacebook,
  FaFax,
  FaLinkedin,
  FaPinterest,
  FaReddit,
  FaSnapchat,
  FaTelegram,
  FaTiktok,
  FaTwitch,
  FaTwitter,
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
  HiLink,
  HiLocationMarker,
  HiOutlineDeviceMobile,
  HiOutlineDocumentDuplicate,
  HiUser,
} from "react-icons/hi";
import { RiInstagramFill } from "react-icons/ri";

// The CRM Contact Profile Content Component
interface Props {
  contact: CRMContactInterface;
}

export default function ContactProfileCardContent({ contact }: Props) {
  return (
    <div className="flex flex-col gap-4 lg:gap-6 lg:border lg:p-3 rounded-2xl lg:bg-muted/40">
      {/* personal & profile info  */}
      <section
        role="contact-personal-and-profile-information-section"
        className="w-full bg-card border p-4 rounded-xl transition-all duration-200 hover:border-primary/20"
      >
        <h4 className="text-primary text-base lg:text-lg font-semibold mb-4 flex items-center gap-2">
          <HiUser className="size-5" />
          Personal & Profile Details
        </h4>
        <ul className="flex flex-col list-none space-y-1">
          {/* first name */}
          <li className="group px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="block min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  First Name:
                </span>
                <span className="text-foreground font-semibold break-all">
                  {contact.personalInfo.firstName}
                </span>
              </div>
              <Button
                onClick={() =>
                  copyTextToClipboard(contact.personalInfo.firstName)
                }
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 opacity-0 group-hover:opacity-100 text-foreground/60 transition-all hover:text-primary"
              >
                <HiOutlineDocumentDuplicate className="size-4" />
              </Button>
            </div>
          </li>
          {/* last name */}
          <li className="group px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="block min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  Last Name:
                </span>
                <span className="text-foreground font-semibold break-all">
                  {contact.personalInfo.lastName}
                </span>
              </div>
              <Button
                onClick={() =>
                  copyTextToClipboard(contact.personalInfo.lastName)
                }
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 opacity-0 group-hover:opacity-100 text-foreground/60 transition-all hover:text-primary"
              >
                <HiOutlineDocumentDuplicate className="size-4" />
              </Button>
            </div>
          </li>
          {/* gender */}
          <li className="px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="block min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  Gender:
                </span>
                <span
                  className={cn(
                    "font-semibold capitalize",
                    contact.personalInfo.gender === "male"
                      ? "text-blue-500"
                      : "text-pink-500"
                  )}
                >
                  {contact.personalInfo.gender}
                </span>
              </div>
            </div>
          </li>
          {/* bio */}
          <li className="group px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-start lg:items-center justify-between gap-2">
                <span className="block min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  Bio:
                </span>
                {contact.bio ? (
                  <Button
                    onClick={() => copyTextToClipboard(contact.bio)}
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 opacity-0 group-hover:opacity-100 text-foreground/60 transition-all hover:text-primary"
                  >
                    <HiOutlineDocumentDuplicate className="size-4" />
                  </Button>
                ) : null}
              </div>
              <p className="text-sm text-foreground leading-relaxed break-all">
                {contact.bio || "/"}
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
          {/* Country */}
          <li className="group px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start  lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="block min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  Country:
                </span>
                <span className="text-foreground font-semibold break-all">
                  {contact.personalInfo.location.country || "/"}
                </span>
              </div>
              {contact.personalInfo.location?.country ? (
                <Button
                  onClick={() =>
                    copyTextToClipboard(contact.personalInfo.location.country)
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
                  {contact.personalInfo.location.state || "/"}
                </span>
              </div>
              {contact.personalInfo.location?.state ? (
                <Button
                  onClick={() =>
                    copyTextToClipboard(contact.personalInfo.location.state)
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
                  {contact.personalInfo.location.city || "/"}
                </span>
              </div>
              {contact.personalInfo.location?.city ? (
                <Button
                  onClick={() =>
                    copyTextToClipboard(contact.personalInfo.location.city)
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
                  {contact.personalInfo.location.address || "/"}
                </span>
              </div>
              {contact.personalInfo.location?.address ? (
                <Button
                  onClick={() =>
                    copyTextToClipboard(contact.personalInfo.location.address)
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
                  {contact.personalInfo.location.zipcode || "/"}
                </span>
              </div>
              {contact.personalInfo.location?.zipcode ? (
                <Button
                  onClick={() =>
                    copyTextToClipboard(contact.personalInfo.location.zipcode)
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
      {/* work & source */}
      <section
        role="contact-personal-and-profile-information-section"
        className="w-full bg-card border p-4 rounded-xl transition-all duration-200 hover:border-primary/20"
      >
        <h4 className="text-primary text-base lg:text-lg font-semibold mb-4 flex items-center gap-2">
          <HiBriefcase className="size-5" />
          Work & Source Details
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
                  {contact.work.industry || "/"}
                </span>
              </div>
              {contact.work?.industry ? (
                <Button
                  onClick={() => copyTextToClipboard(contact.work.industry)}
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 opacity-0 group-hover:opacity-100 text-foreground/60 transition-all hover:text-primary"
                >
                  <HiOutlineDocumentDuplicate className="size-4" />
                </Button>
              ) : null}
            </div>
          </li>
          {/* Occupation */}
          <li className="group px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="block min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  Occupation:
                </span>
                <span className="text-foreground font-semibold break-all">
                  {contact.work.occupation || "/"}
                </span>
              </div>
              {contact.work?.occupation ? (
                <Button
                  onClick={() => copyTextToClipboard(contact.work.occupation)}
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 opacity-0 group-hover:opacity-100 text-foreground/60 transition-all hover:text-primary"
                >
                  <HiOutlineDocumentDuplicate className="size-4" />
                </Button>
              ) : null}
            </div>
          </li>
          {/* Company */}
          <li className="group px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="block min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  Company:
                </span>
                <span className="text-foreground font-semibold break-all">
                  {contact.work.company || "/"}
                </span>
              </div>
              {contact.work?.company ? (
                <Button
                  onClick={() => copyTextToClipboard(contact.work?.company)}
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
                {contact.resource ? (
                  <Button
                    onClick={() => copyTextToClipboard(contact.resource)}
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 opacity-0 group-hover:opacity-100 text-foreground/60 transition-all hover:text-primary"
                  >
                    <HiOutlineDocumentDuplicate className="size-4" />
                  </Button>
                ) : null}
              </div>
              <p className="text-sm text-foreground leading-relaxed break-all">
                {contact.resource || "/"}
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
                {contact.emails.map((email, i) => (
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
                {contact.phoneNumbers.mobile.map((number, i) => (
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
                {contact.phoneNumbers.fax.map((number, i) => (
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
          {/* Whatsapp */}
          <li className="px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start  lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="flex items-center gap-2 min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  <FaWhatsapp className="size-4 text-green-500" />
                  Whatsapp Numbers:
                </span>
                {/* warping numbers */}
                {contact.phoneNumbers.whatsapp.map((number, i) => (
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
                {contact.phoneNumbers.viber.map((number, i) => (
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
          {/* Facebook */}
          <li className="px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start  lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="flex items-center gap-2 min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  <FaFacebook className="text-blue-500 size-4" />
                  Facebook:
                </span>
                {/* warping accounts */}
                {contact.socialMedia.facebook.map((account, i) => (
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
                {contact.socialMedia.instagram.map((account, i) => (
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
          {/* Telegram */}
          <li className="px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start  lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="flex items-center gap-2 min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  <FaTelegram className="text-sky-500 size-4" />
                  Telegram:
                </span>
                {/* warping accounts */}
                {contact.socialMedia.telegram.map((account, i) => (
                  <Badge
                    key={account + i}
                    variant="outline"
                    className="group px-3 py-1.5 rounded-full gap-2 text-sm font-normal bg-card hover:bg-muted/50 transition-all duration-200 border-primary/20"
                  >
                    <FaTelegram className="text-sky-500 size-4 -ml-1 transition-transform group-hover:scale-110" />
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
                {contact.socialMedia.youtube.map((account, i) => (
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
          {/* Linkedin */}
          <li className="px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start  lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="flex items-center gap-2 min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  <FaLinkedin className="text-sky-600 size-4" />
                  Linkedin:
                </span>
                {/* warping accounts */}
                {contact.socialMedia.linkedin.map((account, i) => (
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
          {/* Twitter */}
          <li className="px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start  lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="flex items-center gap-2 min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  <FaTwitter className="text-blue-500 size-4" />
                  Twitter:
                </span>
                {/* warping accounts */}
                {contact.socialMedia.twitter.map((account, i) => (
                  <Badge
                    key={account + i}
                    variant="outline"
                    className="group px-3 py-1.5 rounded-full gap-2 text-sm font-normal bg-card hover:bg-muted/50 transition-all duration-200 border-primary/20"
                  >
                    <FaTwitter className="text-blue-500 size-4 -ml-1 transition-transform group-hover:scale-110" />
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
          {/* Tiktok */}
          <li className="px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start  lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="flex items-center gap-2 min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  <FaTiktok className="text-purple-900 size-4" />
                  Tiktok:
                </span>
                {/* warping accounts */}
                {contact.socialMedia.tiktok.map((account, i) => (
                  <Badge
                    key={account + i}
                    variant="outline"
                    className="group px-3 py-1.5 rounded-full gap-2 text-sm font-normal bg-card hover:bg-muted/50 transition-all duration-200 border-primary/20"
                  >
                    <FaTiktok className="text-purple-900 size-4 -ml-1 transition-transform group-hover:scale-110" />
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
          {/* Pinterest */}
          <li className="px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start  lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="flex items-center gap-2 min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  <FaPinterest className="text-red-700 size-4" />
                  Pinterest:
                </span>
                {/* warping accounts */}
                {contact.socialMedia.pinterest.map((account, i) => (
                  <Badge
                    key={account + i}
                    variant="outline"
                    className="group px-3 py-1.5 rounded-full gap-2 text-sm font-normal bg-card hover:bg-muted/50 transition-all duration-200 border-primary/20"
                  >
                    <FaPinterest className="text-red-700 size-4 -ml-1 transition-transform group-hover:scale-110" />
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
          {/* Snapchat */}
          <li className="px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start  lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="flex items-center gap-2 min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  <FaSnapchat className="text-yellow-700 size-4" />
                  Snapchat:
                </span>
                {/* warping accounts */}
                {contact.socialMedia.snapchat.map((account, i) => (
                  <Badge
                    key={account + i}
                    variant="outline"
                    className="group px-3 py-1.5 rounded-full gap-2 text-sm font-normal bg-card hover:bg-muted/50 transition-all duration-200 border-primary/20"
                  >
                    <FaSnapchat className="text-yellow-700 size-4 -ml-1 transition-transform group-hover:scale-110" />
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
          {/* Reddit */}
          <li className="px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start  lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="flex items-center gap-2 min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  <FaReddit className="text-orange-500 size-4" />
                  Reddit:
                </span>
                {/* warping accounts */}
                {contact.socialMedia.reddit.map((account, i) => (
                  <Badge
                    key={account + i}
                    variant="outline"
                    className="group px-3 py-1.5 rounded-full gap-2 text-sm font-normal bg-card hover:bg-muted/50 transition-all duration-200 border-primary/20"
                  >
                    <FaReddit className="text-orange-500 size-4 -ml-1 transition-transform group-hover:scale-110" />
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
          {/* Twitch */}
          <li className="px-2 py-1 rounded-lg hover:bg-muted/50 transition-all duration-200">
            <div className="flex flex-wrap items-start  lg:items-center justify-between gap-2">
              <div className="flex flex-wrap flex-1 text-sm gap-3">
                <span className="flex items-center gap-2 min-w-[7em] shrink-0 text-foreground/70 font-medium">
                  <FaTwitch className="text-purple-500 size-4" />
                  Twitch:
                </span>
                {/* warping accounts */}
                {contact.socialMedia.twitch.map((account, i) => (
                  <Badge
                    key={account + i}
                    variant="outline"
                    className="group px-3 py-1.5 rounded-full gap-2 text-sm font-normal bg-card hover:bg-muted/50 transition-all duration-200 border-primary/20"
                  >
                    <FaTwitch className="text-purple-500 size-4 -ml-1 transition-transform group-hover:scale-110" />
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
                {contact.socialMedia.other.map((account, i) => (
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
