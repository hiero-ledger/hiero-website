const meetData = {
  heading: "Join our Hiero Community Calls",
  text: '<p>Join our open TSC, Community and Project meetings. We welcome your opinion and invite you to collaborate with the team!</p><p>Register to any of our current meeting series <a href="https://github.com/hiero-ledger#open-community-meetings-and-tsc-schedules" target="_blank" rel="noreferrer noopener">HERE</a></p><p>View all meeting schedules and access recordings via our <a href="https://zoom-lfx.platform.linuxfoundation.org/meetings/hiero?view=week" target="_blank" rel="noreferrer noopener">LFX Calendar</a>.</p>',
  calls: [
    {
      name: "TSC",
      description:
        "The Technical Steering Committee (TSC) meeting for project governance, roadmap planning, and key technical decisions.",
      schedule: "Fortnightly",
      registerLink:
        "https://zoom-lfx.platform.linuxfoundation.org/meeting/95775743341?password=c07443bf-b0e6-4a68-93f1-5c7ce9bb49ab&invite=true",
    },
    {
      name: "Community Call",
      description:
        "Open community meeting for general discussions, updates, and Q&A sessions with the Hiero community and TSC members.",
      schedule: "Monthly",
      registerLink:
        "https://zoom-lfx.platform.linuxfoundation.org/meeting/97122675754?password=7eaa865a-2f17-4a7c-97b0-aff51933991c&invite=true",
    },
    {
      name: "Python SDK",
      description:
        "Focused discussions on the Hiero Python SDK development, including new features, issues, and contributions.",
      schedule: "Monthly",
      registerLink:
        "https://zoom-lfx.platform.linuxfoundation.org/meeting/92041330205?password=2f345bee-0c14-4dd5-9883-06fbc9c60581&invite=true",
    },
    {
      name: "Docs",
      description:
        "Documentation working group meetings to improve and maintain Hiero project documentation.",
      schedule: "Monthly",
      registerLink:
        "https://zoom-lfx.platform.linuxfoundation.org/meeting/96247351493?password=54a04164-8618-458d-8176-4ca21b346291&invite=true",
    },
    {
      name: "Solo",
      description:
        "Discussions and updates about Solo, an opinionated CLI tool to deploy and manage standalone test networks.",
      schedule: "Fortnightly",
      registerLink:
        "https://zoom-lfx.platform.linuxfoundation.org/meeting/94695703550?password=e8819002-3f6e-4905-9916-b049f501e866&invite=true",
    },
    {
      name: "Solo Action",
      description:
        "Working sessions focused on Solo Action project development, issues, and contributions.",
      schedule: "Fortnightly",
      registerLink:
        "https://zoom-lfx.platform.linuxfoundation.org/meeting/92576669768?password=8dab94bb-7315-4d37-a944-b1fa0e924741&invite=true",
    },
    {
      name: "SDK",
      description:
        "General SDK working group for cross-SDK discussions, standards, and coordination across all Hiero SDK implementations.",
      schedule: "Monthly",
      registerLink:
        "https://zoom-lfx.platform.linuxfoundation.org/meeting/94709702244?password=bcba4892-928c-47e0-9a21-e1abca95f7d3&invite=true",
    },
    {
      name: "Hiero Website",
      description:
        "Planning and development meetings for the Hiero website, content strategy, and user experience improvements.",
      schedule: "Monthly",
      registerLink:
        "https://zoom-lfx.platform.linuxfoundation.org/meeting/94831465670?password=50e11cd2-6450-4a97-b9ae-7a7585c4409b&invite=true",
    },
    {
      name: "Hiero Marketing",
      description:
        "Marketing and community outreach discussions, including events, communications, and ecosystem growth strategies.",
      schedule: "Monthly",
      registerLink:
        "https://zoom-lfx.platform.linuxfoundation.org/meeting/91725705912?password=57115f71-9576-46dc-90f7-98be38aade2d&invite=true",
    },
    {
      name: "Monthly Maintainers",
      description:
        "Regular meeting for maintainers across all Hiero projects to coordinate, share updates, and discuss best practices.",
      schedule: "Monthly",
      registerLink:
        "https://zoom-lfx.platform.linuxfoundation.org/meeting/99574473075?password=deff3fc9-0e80-4877-80de-91499b5480e9&invite=true",
    },
    {
      name: "Hiero/Hedera Identity",
      description:
        "Working group focused on identity-related projects, DID SDK development, and identity standards implementation.",
      schedule: "Monthly",
      registerLink:
        "https://zoom-lfx.platform.linuxfoundation.org/meeting/99097542854?password=3ee2d9c9-32de-4758-8a23-417c751bd7ab&invite=true",
    },
    {
      name: "Hiero Mirror Node",
      description:
        "Development and maintenance discussions for the Hiero Mirror Node, which archives data from consensus nodes and serves it via an API.",
      schedule: "Monthly",
      registerLink:
        "https://zoom-lfx.platform.linuxfoundation.org/meeting/94618152832?password=3b037576-2aab-4f7e-ab24-acf9ca2c3734&invite=true",
    },
  ],
};

export default function MeetSection() {
  return (
    <div id="meet" className="anchor">
      <div className="bg-white">
        <div className="container pt-[40px] pb-[40px] sm:pt-[60px] sm:pb-[120px]">
          <div className="mb-10 sm:mb-16">
            <h2 className="text-2xl mb-2.5 sm:text-4xl sm:mb-5">
              {meetData.heading}
            </h2>
            <div
              className="text-lg max-w-full md:max-w-[800px] space-y-4"
              dangerouslySetInnerHTML={{ __html: meetData.text }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {meetData.calls.map((call, i) => (
              <div
                key={i}
                className="border-2 border-white-dark rounded-2xl p-8 hover:border-red transition-colors duration-200 bg-white"
              >
                <h3 className="text-xl sm:text-2xl font-medium mb-3">{call.name}</h3>
                <p className="text-base mb-4 text-gray-600">{call.description}</p>
                <p className="text-sm mb-4 text-gray-600">
                  <strong>Schedule:</strong> {call.schedule}
                </p>
                <div className="flex flex-col gap-2 mt-4">
                  <a
                    href={call.registerLink}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-red hover:text-red-dark text-base font-medium underline"
                  >
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

