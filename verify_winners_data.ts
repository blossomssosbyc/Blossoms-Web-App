
import { db } from "./server/db";
import { winnersList } from "./shared/schema";

async function main() {
  try {

    const winners = await db.select().from(winnersList);
    const uniqueEvents = [...new Set(winners.map(w => w.event))];
    console.log("Unique events in DB:", uniqueEvents.sort());
    if (winners.length > 0) {
      // console.log("First winner:", winners[0]);
    }
    process.exit(0);

  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

main();
