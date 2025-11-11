// src/utils/GraphBuilder.test.ts
import { GraphBuilder } from "../../utils/GraphBuilder";

describe("GraphBuilder", () => {
  it("adds nodes and links correctly", () => {
    const builder = new GraphBuilder();

    builder.addNode("A");
    builder.addNode("B");
    builder.addLink("A", "B", 0.5, "tx1");
    builder.incrementSent("A", 0.5);
    builder.incrementReceived("B", 0.5);

    const graph = builder.build("A");

    expect(graph.nodes.length).toBe(2);
    expect(graph.links.length).toBe(1);
    expect(graph.nodes.find(n => n.id === "A")?.totalSent).toBeCloseTo(0.5);
    expect(graph.nodes.find(n => n.id === "B")?.totalReceived).toBeCloseTo(0.5);
  });
});
