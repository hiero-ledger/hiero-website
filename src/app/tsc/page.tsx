"use client";

import { useState } from "react";
import Image from "next/image";
import tscMembers from "@/data/technical_steering_committee.json";
import RichText from "../../components/RichText";

interface Member {
  firstName: string;
  lastName: string;
  gitHubAccount: string;
  photo: string;
  bio: string;
}

const tscHeading = "The Technical Steering Committee of Hiero";
const tscText =
  "Hiero is governed by a Technical Steering Committee (TSC) composed of experienced and diverse members of the community. The duties, goals, and rights of the TSC are defined in the [technical charter](https://github.com/hiero-ledger/governance/blob/main/hiero-technical-charter.md) of the Hiero project.";

export default function TSCSection() {
  const [openBio, setOpenBio] = useState<string | null>(null);

  const sorted = [...(tscMembers as Member[])].sort((a, b) =>
    a.lastName.localeCompare(b.lastName),
  );

  return (
    <>
      <div id="technical-steering-committee" className="anchor">
        <div className="bg-white text-[20px]">
          <div className="bg-gradient-to-br from-red-dark via-red to-red relative">
          <div
            id="technical-steering-committee-intro"
            className="container py-14 sm:py-[100px] xl:py-36 text-white text-center">
            <h2 className="text-[55px] text-center text-white font-bold">
              {tscHeading}
            </h2>
            <RichText
              inline
              markdown={tscText}
              className="space-y-4 text-center mt-6 text-white [&_a]:text-white font-bold"
            />
            </div>
          </div>
          <div
            id="technical-steering-committee-content"
            className="container py-[40px] sm:pt-[120px] sm:pb-[120px] gap-10">
            <div
              id="technical-steering-committee-intro-column"
              className=""></div>
            <div className="team-members grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-[40px] sm:gap-y-[60px]">
              {sorted.map((member, index) => {
                const bioId = `${member.firstName}${member.lastName}${index}`;
                return (
                  <div key={bioId} className="team-member relative">
                    <div className="mb-3">
                      <Image
                        src={`/images/tsc/${member.photo}`}
                        alt={`${member.firstName} ${member.lastName}`}
                        width={400}
                        height={400}
                        className="w-full max-w-[250px] mx-auto aspect-square object-cover"
                        loading="lazy"
                      />
                    </div>
                    <h3 className="text-2xl max-w-[250px] mx-auto">
                      {member.firstName} {member.lastName}
                    </h3>
                    <div className="flex flex-row gap-2 items-center max-w-[250px] mx-auto">
                      <button
                        className="text-red border-2 border-red border-solid rounded-full py-1 px-[26px] text-lg cursor-pointer"
                        onClick={() => setOpenBio(bioId)}>
                        Bio
                      </button>
                      <a
                        href={member.gitHubAccount}
                        target="_blank"
                        rel="noopener"
                        className="border-2 border-red border-solid rounded-full h-[35px] w-[35px] flex justify-center items-center">
                        <Image
                          src="/images/Hiero-Icon-Github.svg"
                          alt="GitHub"
                          width={17}
                          height={17}
                        />
                      </a>
                    </div>
                    {/* Bio modal */}
                    {openBio === bioId && (
                      <div
                        className="absolute top-0 bg-white text-black text-lg z-10 flex flex-col p-[30px]"
                        aria-modal="true">
                        <button
                          className="absolute text-black top-1.5 right-1.5 cursor-pointer"
                          onClick={() => setOpenBio(null)}
                          aria-label="Close bio">
                          <Image
                            src="/images/Hiero-Icon-ModalClose.svg"
                            alt="Close"
                            width={24}
                            height={24}
                          />
                        </button>
                        <div className="mb-5">
                          <Image
                            src={`/images/tsc/${member.photo}`}
                            alt={`${member.firstName} ${member.lastName}`}
                            width={400}
                            height={400}
                            className="w-full aspect-square object-cover"
                            loading="lazy"
                          />
                        </div>
                        <p className="text-black mt-2">{member.bio}</p>
                        <button
                          className="text-black text-lg rounded-full py-1.5 px-[26px] bg-white-dark self-center mt-4 cursor-pointer"
                          onClick={() => setOpenBio(null)}>
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
