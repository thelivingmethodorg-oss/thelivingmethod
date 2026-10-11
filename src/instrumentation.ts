/** Runs once when a server process starts: begin listening for CMS publishes. */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  const { listenForPublishes } = await import("@/lib/publish-listener");
  void listenForPublishes();
}
