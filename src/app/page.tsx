import { SplitScreenExperience } from "@/components/SplitScreenExperience";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const config = await prisma.weddingConfig.findUnique({
    where: { id: "default" },
  });

  const mediaList = await prisma.media.findMany({
    orderBy: [{ chapter: "asc" }, { createdAt: "desc" }],
  });

  return (
    <SplitScreenExperience
      config={
        config
          ? {
              brideName: config.brideName,
              groomName: config.groomName,
              weddingDate: config.weddingDate.toISOString(),
              venueName: config.venueName,
              venueCity: config.venueCity,
              venueAddress: config.venueAddress,
              invitationSubtitle: config.invitationSubtitle,
              invitationText: config.invitationText,
              countdownTitle: config.countdownTitle,
              countdownText: config.countdownText,
              programmeTitle: config.programmeTitle,
              programmeText: config.programmeText,
              rsvpTitle: config.rsvpTitle,
              rsvpText: config.rsvpText,
              rsvpDeadline: config.rsvpDeadline,
              dressCodeTitle: config.dressCodeTitle,
              dressCodeDesc: config.dressCodeDesc,
              dressCodeColors: config.dressCodeColors,
              dressCodeAdvice: config.dressCodeAdvice,
            }
          : undefined
      }
      mediaList={mediaList.map((m) => ({
        id: m.id,
        url: m.url,
        caption: m.caption,
        chapter: m.chapter,
      }))}
    />
  );
}
