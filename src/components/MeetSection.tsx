import RichText from "./RichText";

interface MeetCall {
  name: string;
  description: string;
  schedule: string;
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

export default function MeetSection({ data }: MeetSectionProps) {
  return (
    <div id="meet" className="anchor">
      <div className="bg-white">
        <div className="container pt-[40px] pb-[40px] sm:pt-[60px] sm:pb-[120px]">
          <div className="mb-10 sm:mb-16">
            <h2 className="text-2xl mb-2.5 sm:text-4xl sm:mb-5">
              {data.heading}
            </h2>
            <RichText
              html={data.text}
              className="text-lg max-w-full md:max-w-[800px] space-y-4"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {data.calls.map((call, i) => (
              <div
                key={i}
                className="border-2 border-white-dark rounded-2xl p-8 hover:border-red transition-colors duration-200 bg-white">
                <h3 className="text-xl sm:text-2xl font-medium mb-3">
                  {call.name}
                </h3>
                <p className="text-base mb-4 text-gray-600">
                  {call.description}
                </p>
                <p className="text-sm mb-4 text-gray-600">
                  <strong>Schedule:</strong> {call.schedule}
                </p>
                <div className="flex flex-col gap-2 mt-4">
                  <a
                    href={call.registerLink}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-red hover:text-red-dark text-base font-medium underline">
                    Register →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
