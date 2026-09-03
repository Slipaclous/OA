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
              dressCodeTitle: config.dressCodeTitle,
              dressCodeDesc: config.dressCodeDesc,
              dressCodeColors: config.dressCodeColors,
              dressCodeAdvice: config.dressCodeAdvice,
              weddingDate: config.weddingDate.toISOString(),
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
