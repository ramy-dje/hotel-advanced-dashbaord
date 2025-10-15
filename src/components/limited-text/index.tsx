// A component that limits the passed text and add ... as element when the text longer then the limit

interface Props {
  limit: number; // default to 30 character
  children: string;
}

export default function LimitedText({ children, limit = 30 }: Props) {
  return (
    <>
      {children.slice(0, limit)}
      {""}
      {children.length > limit ? <span title={children}>...</span> : ""}
    </>
  );
}
