// Only http(s) and www. links are matched, so schemes like javascript: can never become hrefs.
const URL_PATTERN = /((?:https?:\/\/|www\.)[^\s<]+[^\s<.,;:!?)\]'"])/gi;

export function LinkifiedText({ text }: { text: string }) {
  const parts = text.split(URL_PATTERN);

  return (
    <>
      {parts.map((part, index) => {
        // split() with a capture group puts matches at odd indexes.
        if (index % 2 === 0) return part;
        const href = part.startsWith("www.") ? `https://${part}` : part;
        return (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all font-medium text-accent underline underline-offset-2"
          >
            {part}
          </a>
        );
      })}
    </>
  );
}
