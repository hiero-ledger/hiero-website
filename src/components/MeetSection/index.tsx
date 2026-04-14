import RichText from "@/components/RichText";

interface MeetCall {
  name: string;
  description: string;
  registerLink: string;
}

interface MeetData {
  heading: string;
  text: string;
  calls: MeetCall[];
}

interface MeetSectionProps {
  data: MeetData;
}

const VISIBLE_COUNT = 4;

export default function MeetSection({ data }: MeetSectionProps) {
  const visibleCalls = data.calls.slice(0, VISIBLE_COUNT);

  return (
    <section id="meet" className="anchor bg-gray-light">
      <div className="container pt-[40px] pb-[40px] sm:pt-[60px] sm:pb-[120px] grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)] gap-10 lg:gap-20">
        <div>
          <p className="font-ibm text-sm text-red uppercase tracking-normal mb-4">
            Meet the community
          </p>
          <h2 className="text-2xl mb-2.5 sm:text-4xl sm:mb-5 tracking-normal">
            {data.heading}
          </h2>
          <RichText
            markdown={data.text}
            className="text-lg max-w-full md:max-w-[560px] space-y-4 tracking-normal"
          />
          <div className="mt-8">
            <a
              href="https://zoom-lfx.platform.linuxfoundation.org/meetings/hiero?view=month"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="View all community calls on LFX Calendar (opens in new tab)"
              className="text-red hover:text-red-dark text-lg font-medium underline underline-offset-4 tracking-normal">
              View all community calls →
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-medium mb-5 tracking-normal">
            Start with these calls
          </h3>
          <div className="space-y-4">
            {visibleCalls.map((call, i) => (
              <a
                key={i}
                href={call.registerLink}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`Register for ${call.name} (opens in new tab)`}
                className="hiero-agenda-card hiero-reveal grid grid-cols-1 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto] gap-4 rounded-lg border border-white-dark bg-white p-5 pl-6 no-underline text-charcoal shadow-[0_10px_28px_rgba(30,30,30,0.07)] hover:border-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-light focus-visible:ring-offset-2">
                <span
                  aria-hidden="true"
                  className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-red font-ibm text-sm text-white tracking-normal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <h4 className="text-xl sm:text-2xl font-medium tracking-normal">
                    {call.name}
                  </h4>
                  <p className="mt-2 text-base text-gray tracking-normal">
                    {call.description}
                  </p>
                </span>
                <span className="hiero-card-arrow self-start sm:self-center font-ibm text-sm text-red uppercase tracking-normal">
                  Register →
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
