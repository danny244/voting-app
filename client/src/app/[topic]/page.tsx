import { redis } from "@/lib/redis";
import { ClientPage } from "./ClientPage";

interface PageProps {
      params: {
            topic: string
      }
}

type WordsType = {
      text: string,
      value: number
}

export default async function Page({ params }: PageProps) {

      const { topic } = params;

      const initialData = await redis.zrange<(string | number)[]>(`room:${topic}`, 0, 49, { withScores: true }) // zrange: allows us to get data from a sorted set // we re getting the first 50 data


      const words: WordsType[] = []

      for (let i = 0; i < initialData.length; i++) {
            const [text, value] = initialData.slice(i, i + 2)

            if (typeof text === "string" && typeof value === "number") {
                  words.push({ text, value })
            }
      }


      await redis.incr("served-requests");

      return (
            <ClientPage initialData={words} topicName={topic} />
      )
}