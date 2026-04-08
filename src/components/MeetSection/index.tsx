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

const VISIBLE_COUNT = 9;

export default function MeetSection({ data }: MeetSectionProps) {
  const visibleCalls = data.calls.slice(0, VISIBLE_COUNT);

  return (
    <div id="meet" className="anchor">
      <div className="bg-white">
        <div className="container pt-[40px] pb-[40px] sm:pt-[60px] sm:pb-[120px]">
          <div className="mb-10 sm:mb-16">
            <h2 className="text-2xl mb-2.5 sm:text-4xl sm:mb-5">
              {data.heading}
            </h2>
            <RichText
              markdown={data.text}
              className="text-lg max-w-full md:max-w-[800px] space-y-4"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {visibleCalls.map((call, i) => (
              <a
                key={i}
                href={call.registerLink}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`Register for ${call.name} (opens in new tab)`}
                className="flex flex-col border-2 border-white-dark rounded-2xl p-8 hover:border-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-light focus-visible:ring-offset-2 transition-colors duration-200 bg-white h-full no-underline text-charcoal">
                <h3 className="text-xl sm:text-2xl font-medium mb-3">
                  {call.name}
                </h3>
                <p className="text-base mb-4 text-gray-600 flex-grow">
                  {call.description}
                </p>
              </a>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href="https://zoom-lfx.platform.linuxfoundation.org/meetings/hiero?view=month"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="View all community calls on LFX Calendar (opens in new tab)"
              className="text-red hover:text-red-dark text-lg font-medium underline">
              View all community calls →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
